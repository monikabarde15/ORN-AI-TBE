import { upload } from "../lib/upload";
import { Router, type IRouter } from "express";
import { eq, desc, and, inArray } from "drizzle-orm";
import {
  db,
  coursesTable,
  sectionsTable,
  subSectionsTable,
  candidatesTable,
  trainingAssignmentsTable,
  activityTable,
  mcqTable,
  type CandidateRow,
} from "@workspace/db";
import {
  ListTrainingCatalogResponse,
  TrainingDashboardResponse,
  ListTrainingAssignmentsResponse,
  ListTrainingAssignmentsQueryParams,
  CreateTrainingAssignmentBody,
  GetTrainingAssignmentParams,
  GetTrainingAssignmentResponse,
  UpdateTrainingAssignmentParams,
  UpdateTrainingAssignmentBody,
  UpdateTrainingAssignmentResponse,
  GetCandidateTrainingParams,
  GetCandidateTrainingResponse,
  RecommendTrainingForCandidateParams,
  RecommendTrainingForCandidateResponse,
} from "@workspace/api-zod";
import {
  TRAINING_PROGRAMS,
  TRAINERS,
  findProgramById,
  findTrainerById,
} from "../lib/training-catalog";
import {
  recommendTraining,
  buildInitialModules,
  buildInitialLiveSessions,
  applyTrainingUpdate,
  serializeTrainingAssignment,
  type LiveSessionState,
} from "../lib/training";
import { requireAuth, requireRole, requireCandidateAccess } from "../lib/auth";

const router: IRouter = Router();

// ----- Catalog -----
router.get("/training/catalog", requireAuth, async (_req, res): Promise<void> => {
  res.json(
    ListTrainingCatalogResponse.parse({
      programs: TRAINING_PROGRAMS,
      trainers: TRAINERS,
    }),
  );
});

// ----- Recommendation -----
router.get(
  "/training/recommend/:candidateId",
  requireAuth,
  requireCandidateAccess("candidateId"),
  async (req, res): Promise<void> => {
    const params = RecommendTrainingForCandidateParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [candidate] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, params.data.candidateId));
    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    const rec = recommendTraining({
      id: candidate.id,
      targetRole: candidate.targetRole,
      evaluation: candidate.evaluation,
    });
    const start = new Date();
    start.setDate(start.getDate() + 7); // suggest a 7-day kickoff window
    const target = new Date(start);
    target.setDate(target.getDate() + rec.program.durationWeeks * 7);

    res.json(
      RecommendTrainingForCandidateResponse.parse({
        candidateId: candidate.id,
        assessmentCategory: rec.assessmentCategory,
        trainingType: rec.trainingType,
        recommendedPath: rec.recommendedPath,
        program: rec.program,
        suggestedTrainer: rec.suggestedTrainer,
        suggestedStartDate: start.toISOString(),
        suggestedTargetCompletionDate: target.toISOString(),
        rationale: rec.rationale,
      }),
    );
  },
);

// ----- List assignments -----
router.get("/training/assignments", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "candidate") {
    if (!req.user!.candidateId) {
      res.json(ListTrainingAssignmentsResponse.parse({ items: [] }));
      return;
    }
    req.query["candidateId"] = req.user!.candidateId;
  }
  const parsed = ListTrainingAssignmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const f = parsed.data;
  const filters = [];
  if (f.status) filters.push(eq(trainingAssignmentsTable.status, f.status));
  if (f.trainingType)
    filters.push(eq(trainingAssignmentsTable.trainingType, f.trainingType));
  if (f.trainerId)
    filters.push(eq(trainingAssignmentsTable.trainerId, f.trainerId));

  const rows = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(trainingAssignmentsTable.updatedAt))
    .limit(200);

  // Hydrate candidate basics in a single query
  const ids = Array.from(new Set(rows.map((r) => r.candidateId)));
  const candidates = ids.length
    ? await db
        .select()
        .from(candidatesTable)
        .where(inArray(candidatesTable.id, ids))
    : [];
  const byId = new Map<string, CandidateRow>(candidates.map((c) => [c.id, c]));

  const out = rows
    .map((r) => {
      const c = byId.get(r.candidateId);
      if (!c) return null;
      return serializeTrainingAssignment(r, c);
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  res.json(ListTrainingAssignmentsResponse.parse(out));
});
// ----- Create assignment -----
router.post("/training/assignments", requireAuth, requireRole("recruiter", "admin"), async (req, res): Promise<void> => {
  const body = CreateTrainingAssignmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const program = findProgramById(body.data.programId);
  if (!program) {
    res.status(400).json({ error: "Unknown programId" });
    return;
  }
  const trainer = findTrainerById(body.data.trainerId);
  if (!trainer) {
    res.status(400).json({ error: "Unknown trainerId" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, body.data.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const startDate = new Date(body.data.startDate);
  const targetCompletionDate = new Date(body.data.targetCompletionDate);
  const modules = buildInitialModules(program);
  const liveSessions = buildInitialLiveSessions(program, trainer, startDate);

  // Derive assessment category from program training type (single source of truth)
  const assessmentCategory =
    program.trainingType === "reskilling" ? "needs_reskilling" : "needs_upskilling";

  const [row] = await db
    .insert(trainingAssignmentsTable)
    .values({
      candidateId: candidate.id,
      assessmentCategory,
      trainingType: program.trainingType,
      programId: program.id,
      programName: program.name,
      recommendedPath: program.recommendedPath,
      deliveryMode: "hybrid",
      trainerId: trainer.id,
      trainerName: trainer.name,
      modules,
      liveSessions,
      startDate,
      targetCompletionDate,
      status: "not_started",
      progressPct: 0,
    })
    .returning();
  if (!row) {
    res.status(500).json({ error: "Failed to create assignment" });
    return;
  }

  await db.insert(activityTable).values({
    kind: "upskilling",
    candidateName: candidate.fullName,
    country: candidate.country,
    message: `${candidate.fullName} assigned to ${program.name}`,
  });

  res
    .status(201)
    .json(
      GetTrainingAssignmentResponse.parse(
        serializeTrainingAssignment(row, candidate),
      ),
    );
});

// ----- Get one -----
router.get("/training/assignments/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetTrainingAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(eq(trainingAssignmentsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, row.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  if (
    req.user!.role === "candidate" &&
    req.user!.candidateId !== row.candidateId
  ) {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }
  res.json(
    GetTrainingAssignmentResponse.parse(
      serializeTrainingAssignment(row, candidate),
    ),
  );
});

// ----- Patch progress -----
router.patch("/training/assignments/:id", requireAuth, requireRole("recruiter", "admin"), async (req, res): Promise<void> => {
  const params = UpdateTrainingAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateTrainingAssignmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [current] = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(eq(trainingAssignmentsTable.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }

  const next = applyTrainingUpdate(current, body.data);

  const [updated] = await db
    .update(trainingAssignmentsTable)
    .set({
      modules: next.modules,
      liveSessions: next.liveSessions,
      status: next.status,
      progressPct: next.progressPct,
      finalReadinessNote: next.finalReadinessNote,
      updatedAt: new Date(),
    })
    .where(eq(trainingAssignmentsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(500).json({ error: "Failed to update assignment" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, updated.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json(
    UpdateTrainingAssignmentResponse.parse(
      serializeTrainingAssignment(updated, candidate),
    ),
  );
});

// ----- Candidate's assignment -----
router.get(
  "/candidates/:id/training",
  requireAuth,
  requireCandidateAccess(),
  async (req, res): Promise<void> => {
    const params = GetCandidateTrainingParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [row] = await db
      .select()
      .from(trainingAssignmentsTable)
      .where(eq(trainingAssignmentsTable.candidateId, params.data.id))
      .orderBy(desc(trainingAssignmentsTable.createdAt))
      .limit(1);
    if (!row) {
      res.json(GetCandidateTrainingResponse.parse(null));
      return;
    }
    const [candidate] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, row.candidateId));
    if (!candidate) {
      res.json(GetCandidateTrainingResponse.parse(null));
      return;
    }
    res.json(
      GetCandidateTrainingResponse.parse(
        serializeTrainingAssignment(row, candidate),
      ),
    );
  },
);

// ----- Dashboard aggregates -----
router.get("/training/dashboard", requireAuth, requireRole("recruiter", "admin"), async (_req, res): Promise<void> => {
  const allRows = await db.select().from(trainingAssignmentsTable);

  const totalInTraining = allRows.filter(
    (r) => r.status !== "completed" && r.status !== "recruiter_ready",
  ).length;
  const upskillingCount = allRows.filter(
    (r) => r.trainingType === "upskilling",
  ).length;
  const reskillingCount = allRows.filter(
    (r) => r.trainingType === "reskilling",
  ).length;
  const completedCount = allRows.filter((r) => r.status === "completed").length;
  const recruiterReadyCount = allRows.filter(
    (r) => r.status === "recruiter_ready",
  ).length;

  // Pending live sessions = scheduled sessions in the future
  const now = Date.now();
  let pendingLiveSessions = 0;
  const upcomingFlat: Array<{
    assignmentId: string;
    candidateName: string;
    sessionTitle: string;
    trainerName: string;
    scheduledFor: string;
    scheduledTs: number;
  }> = [];
  for (const r of allRows) {
    const sessions = (r.liveSessions as LiveSessionState[]) ?? [];
    for (const s of sessions) {
      if (s.status === "scheduled" && new Date(s.scheduledFor).getTime() >= now) {
        pendingLiveSessions++;
      }
    }
  }

  // Hydrate candidates for upcoming sessions
  const ids = Array.from(new Set(allRows.map((r) => r.candidateId)));
  const cands = ids.length
    ? await db
        .select()
        .from(candidatesTable)
        .where(inArray(candidatesTable.id, ids))
    : [];
  const candById = new Map(cands.map((c) => [c.id, c]));

  for (const r of allRows) {
    const c = candById.get(r.candidateId);
    if (!c) continue;
    const sessions = (r.liveSessions as LiveSessionState[]) ?? [];
    for (const s of sessions) {
      if (s.status === "scheduled" && new Date(s.scheduledFor).getTime() >= now) {
        upcomingFlat.push({
          assignmentId: r.id,
          candidateName: c.fullName,
          sessionTitle: s.title,
          trainerName: s.trainerName,
          scheduledFor: s.scheduledFor,
          scheduledTs: new Date(s.scheduledFor).getTime(),
        });
      }
    }
  }
  upcomingFlat.sort((a, b) => a.scheduledTs - b.scheduledTs);
  const upcomingLiveSessions = upcomingFlat.slice(0, 8).map((u) => ({
    assignmentId: u.assignmentId,
    candidateName: u.candidateName,
    sessionTitle: u.sessionTitle,
    trainerName: u.trainerName,
    scheduledFor: u.scheduledFor,
  }));

  // Status breakdown — include all 7 statuses, even with count 0
  const STATUSES = [
    "not_started",
    "in_progress",
    "module_completed",
    "live_session_pending",
    "assessment_pending",
    "completed",
    "recruiter_ready",
  ] as const;
  const statusBreakdown = STATUSES.map((s) => ({
    status: s,
    count: allRows.filter((r) => r.status === s).length,
  }));

  // Trainer allocation (only include trainers who have at least one assignment OR
  // who exist in the catalog so allocation cards always render)
  const trainerAllocation = TRAINERS.map((t) => {
    const mine = allRows.filter((r) => r.trainerId === t.id);
    const active = mine.filter(
      (r) => r.status !== "completed" && r.status !== "recruiter_ready",
    ).length;
    const completed = mine.filter(
      (r) => r.status === "completed" || r.status === "recruiter_ready",
    ).length;
    return {
      trainerId: t.id,
      trainerName: t.name,
      specialism: t.specialism,
      activeAssignments: active,
      completedAssignments: completed,
    };
  });

  const avgProgressPct =
    allRows.length === 0
      ? 0
      : Math.round(
          allRows.reduce((sum, r) => sum + r.progressPct, 0) / allRows.length,
        );

  res.json(
    TrainingDashboardResponse.parse({
      totalInTraining,
      upskillingCount,
      reskillingCount,
      completedCount,
      recruiterReadyCount,
      pendingLiveSessions,
      avgProgressPct,
      statusBreakdown,
      trainerAllocation,
      upcomingLiveSessions,
    }),
  );
});

router.post(
  "/course/createCourse",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "promotionalVideo", maxCount: 1 },
    { name: "ebook", maxCount: 1 },
  ]),
  async (req, res): Promise<void> => {
    try {
      const body = req.body;

      const thumbnail =
        (req.files as any)?.thumbnailImage?.[0];

      const promoVideo =
        (req.files as any)?.promotionalVideo?.[0];

      const ebook =
        (req.files as any)?.ebook?.[0];

      const [course] = await db
        .insert(coursesTable)
        .values({
          // Basic Details
          title: body.courseName,

          subtitle:
            body.subtitle || null,

          description:
            body.courseDescription,

          category:
            body.category || null,

          difficulty:
            body.difficulty || null,

          duration:
            body.duration || null,

          instructor:
            body.instructor || null,

          subscriptionName:
            body.subscription_name || null,

          price:
            body.price || "0",

          // Learning Outcomes
          whatYouWillLearn:
            body.whatYouWillLearn
              ? JSON.parse(
                  body.whatYouWillLearn
                )
              : [],

          // Prerequisites
          instructions:
            body.instructions
              ? JSON.parse(
                  body.instructions
                )
              : [],

          // FAQS
          faqs:
            body.faqs
              ? JSON.parse(
                  body.faqs
                )
              : [],

          // Tags
          tags:
            body.tag
              ? JSON.parse(
                  body.tag
                )
              : [],

          // Media
          thumbnail:
            thumbnail?.location ||
            null,

          promotionalVideo:
            promoVideo?.location ||
            null,

          ebook:
            ebook?.location || null,

          // Status
          status:
            body.status || "Draft",
        })
        .returning();

      return res.status(201).json({
        success: true,
        message:
          "Course created successfully",
        data: {
          _id: course.id,
          course,
        },
      });
    } catch (error: any) {
      console.error(
        "CREATE COURSE ERROR =>",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create course",
        error:
          error?.message ||
          "Unknown Error",
      });
    }
  }
);

router.post(
  "/course/addSection",
  async (req, res): Promise<void> => {
    try {
      const { sectionName, courseId } = req.body;

      const [section] = await db
        .insert(sectionsTable)
        .values({
          courseId,
          sectionName,
        })
        .returning();

      res.status(201).json({
        success: true,
        updatedCourse: {
          courseContent: [
            {
              _id: section.id,
            },
          ],
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add section",
      });
    }
  }
);
router.post(
  "/course/addSubSection",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res): Promise<void> => {
    try {
      const body = req.body;

      const video =
        (req.files as any)?.video?.[0];

      const pdf =
        (req.files as any)?.pdf?.[0];

      const [lesson] = await db
        .insert(subSectionsTable)
        .values({
          sectionId: body.sectionId,
          title: body.title,
          description: body.description,
          timeDuration: body.timeDuration,
          videoUrl:
            (video as any)?.location || null,

          pdfUrl:
            (pdf as any)?.location || null,
        })
        .returning();

      res.status(201).json({
        success: true,
        data: {
          subSection: [
            {
              _id: lesson.id,
            },
          ],
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add lesson",
      });
    }
  }
);

router.post(
  "/course/publishCourse",
  async (req, res): Promise<void> => {
    try {
      const { courseId } = req.body;

      await db
        .update(coursesTable)
        .set({
          status: "Published",
        })
        .where(eq(coursesTable.id, courseId));

      res.json({
        success: true,
        message: "Course published",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to publish course",
      });
    }
  }
);


router.post(
  "/mcq/create",
  async (req, res): Promise<void> => {

    try {

      const {
        question,
        options,
        correctAnswer,
        courseId,
        subsectionId,
      } = req.body



      if (!subsectionId) {

        res.status(400).json({
          success:false,
          message:"subsectionId missing",
        })

        return
      }



      const [mcq] =
        await db
          .insert(mcqTable)
          .values({
            question,

            options:
              typeof options === "string"
                ? JSON.parse(options)
                : options,

            correctAnswer,

            courseId,

            subsectionId,
          })
          .returning()



      res.status(201).json({
        success:true,
        data:mcq,
      })

    } catch (error:any) {

      console.log(
        "MCQ CREATE ERROR =>",
        error
      )

      res.status(500).json({
        success:false,
        message:error?.message,
      })
    }
  }
);

// ======================================================
// GET ALL COURSES
// ======================================================

router.get(
  "/courses",
  async (_req, res): Promise<void> => {
    try {

      const courses =
        await db
          .select()
          .from(coursesTable)
          .orderBy(desc(coursesTable.createdAt));

      const finalCourses =
        await Promise.all(
          courses.map(async (course) => {

            // =========================
            // SECTIONS
            // =========================

            const sections =
              await db
                .select()
                .from(sectionsTable)
                .where(
                  eq(
                    sectionsTable.courseId,
                    course.id
                  )
                );

            const sectionIds =
              sections.map((s) => s.id);

            // =========================
            // LESSONS
            // =========================

            let lessons: any[] = [];

            if (sectionIds.length > 0) {

              lessons =
                await db
                  .select()
                  .from(subSectionsTable)
                  .where(
                    inArray(
                      subSectionsTable.sectionId,
                      sectionIds
                    )
                  );
            }

            // =========================
            // QUIZ COUNT
            // =========================

            let quizzes: any[] = [];

            if (lessons.length > 0) {

              quizzes =
                await db
                  .select()
                  .from(mcqTable)
                  .where(
                    eq(
                      mcqTable.courseId,
                      course.id
                    )
                  );
            }

            // =========================
            // VIDEO COUNT
            // =========================

            const videoCount =
              lessons.filter(
                (l) => l.videoUrl
              ).length;

            // =========================
            // FINAL
            // =========================

            return {
              _id: course.id,

              title: course.title,

              description:
                course.description,

              thumbnail:
                course.thumbnail,

              promotionalVideo:
                course.promotionalVideo,

              category:
                course.category,

              price: course.price,

              status: course.status,

              instructor:
                "Admin",

              studentsCount: 0,

              lessonCount:
                lessons.length,

              quizCount:
                quizzes.length,

              videoCount,

              createdAt:
                course.createdAt,
            };
          })
        );

      res.json(finalCourses);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch courses",
      });
    }
  }
);

// ======================================================
// DELETE COURSE
// ======================================================

router.delete(
  "/courses/:id",
  async (req, res): Promise<void> => {

    try {

      const { id } = req.params;

      // =========================
      // FIND SECTIONS
      // =========================

      const sections =
        await db
          .select()
          .from(sectionsTable)
          .where(
            eq(
              sectionsTable.courseId,
              id
            )
          );

      const sectionIds =
        sections.map((s) => s.id);

      // =========================
      // DELETE LESSONS
      // =========================

      if (sectionIds.length > 0) {

        await db
          .delete(subSectionsTable)
          .where(
            inArray(
              subSectionsTable.sectionId,
              sectionIds
            )
          );
      }

      // =========================
      // DELETE QUIZ
      // =========================

      await db
        .delete(mcqTable)
        .where(
          eq(
            mcqTable.courseId,
            id
          )
        );

      // =========================
      // DELETE SECTIONS
      // =========================

      await db
        .delete(sectionsTable)
        .where(
          eq(
            sectionsTable.courseId,
            id
          )
        );

      // =========================
      // DELETE COURSE
      // =========================

      await db
        .delete(coursesTable)
        .where(
          eq(
            coursesTable.id,
            id
          )
        );

      res.json({
        success: true,
        message:
          "Course deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete course",
      });
    }
  }
);

// ======================================================
// GET SINGLE COURSE
// ======================================================

router.get(
  "/courses/:id",
  async (req, res): Promise<void> => {

    try {

      const { id } = req.params;

      // ==================================================
      // COURSE
      // ==================================================

      const [course] =
        await db
          .select()
          .from(coursesTable)
          .where(
            eq(
              coursesTable.id,
              id
            )
          );

      if (!course) {

        res.status(404).json({
          success: false,
          message:
            "Course not found",
        });

        return;
      }

      // ==================================================
      // SECTIONS
      // ==================================================

      const sections =
        await db
          .select()
          .from(sectionsTable)
          .where(
            eq(
              sectionsTable.courseId,
              id
            )
          );

      // ==================================================
      // FINAL SECTIONS
      // ==================================================

      const finalSections =
        await Promise.all(

          sections.map(
            async (section) => {

              // ============================================
              // LESSONS
              // ============================================

              const lessons =
                await db
                  .select()
                  .from(subSectionsTable)
                  .where(
                    eq(
                      subSectionsTable.sectionId,
                      section.id
                    )
                  );

              // ============================================
              // FINAL LESSONS
              // ============================================

              const finalLessons =
  await Promise.all(
    lessons.map(async (lesson) => {

      const quizzes =
        await db
          .select()
          .from(mcqTable)
          .where(
            eq(
              mcqTable.subsectionId,
              lesson.id
            )
          )

      return {

        id:
          lesson.id,

        title:
          lesson.title,

        description:
          lesson.description,

        timeDuration:
          lesson.timeDuration,

        videoUrl:
          lesson.videoUrl,

        pdfUrl:
          lesson.pdfUrl,

        quizzes,
      }
    })
  )

              return {

                id:
                  section.id,

                sectionName:
                  section.sectionName,

                lessons:
                  finalLessons,
              };
            }
          )
        );

      // ==================================================
      // COUNTS
      // ==================================================

      const totalModules =
        finalSections.length;

      const totalLessons =
        finalSections.reduce(
          (acc, section) =>
            acc +
            section.lessons.length,
          0
        );

      const totalQuizzes =
        finalSections.reduce(
          (acc, section) =>
            acc +
            section.lessons.reduce(
              (quizAcc, lesson) =>
                quizAcc +
                lesson.quizzes.length,
              0
            ),
          0
        );

      const totalVideos =
        finalSections.reduce(
          (acc, section) =>
            acc +
            section.lessons.filter(
              (lesson) =>
                lesson.videoUrl
            ).length,
          0
        );

      const totalPdfs =
        finalSections.reduce(
          (acc, section) =>
            acc +
            section.lessons.filter(
              (lesson) =>
                lesson.pdfUrl
            ).length,
          0
        );

      // ==================================================
      // RESPONSE
      // ==================================================

res.json({
  success: true,

  data: {
    // ==============================================
    // COURSE
    // ==============================================

    id: course.id,

    title: course.title,

    subtitle: course.subtitle,

    description: course.description,

    category: course.category,

    difficulty: course.difficulty,

    duration: course.duration,

    instructor: course.instructor,

    subscriptionName:
      course.subscriptionName,

    price: course.price,

    // NEW JSON FIELDS
    whatYouWillLearn:
      course.whatYouWillLearn || [],

    instructions:
      course.instructions || [],

    faqs:
      course.faqs || [],

    tags:
      course.tags || [],

    thumbnail:
      course.thumbnail,

    promotionalVideo:
      course.promotionalVideo,

    ebook:
      course.ebook,

    status:
      course.status,

    createdAt:
      course.createdAt,

    updatedAt:
      course.updatedAt,

    // ==============================================
    // COUNTS
    // ==============================================

    totalModules,

    totalLessons,

    totalQuizzes,

    totalVideos,

    totalPdfs,

    // ==============================================
    // SECTIONS
    // ==============================================

    sections:
      finalSections,
  },
});


    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch course",
      });
    }
  }
);



// ======================================================
// UPDATE COURSE
// ======================================================
router.post(
  "/course/editCourse",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "promotionalVideo", maxCount: 1 },
  ]),
  async (req, res): Promise<void> => {
    try {

      console.log("BODY =>", req.body);

      const body = req.body;

      const { courseId } = body;

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: "courseId is required",
        });
        return;
      }

      const thumbnail =
        (req.files as any)?.thumbnailImage?.[0];

      const promoVideo =
        (req.files as any)?.promotionalVideo?.[0];

      await db
  .update(coursesTable)
  .set({
    title: body.courseName,
    subtitle: body.subtitle,
    description: body.courseDescription,
    category: body.category,
    difficulty: body.difficulty,
    instructor: body.instructor,
    price: body.price,

    ...(thumbnail && {
      thumbnail: thumbnail.location,
    }),

    ...(promoVideo && {
      promotionalVideo: promoVideo.location,
    }),
  })
  .where(
    eq(coursesTable.id, courseId)
  );

      res.json({
        success: true,
        message: "Course updated",
      });

    } catch (error: any) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.put(
  "/courses/:id",
  upload.fields([
    {
      name: "thumbnailImage",
      maxCount: 1,
    },
    {
      name: "promotionalVideo",
      maxCount: 1,
    },
  ]),
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Course ID is required",
        });
        return;
      }

      const body = req.body;

      const thumbnail =
        (req.files as any)?.thumbnailImage?.[0];

      const promoVideo =
        (req.files as any)?.promotionalVideo?.[0];

      const [existingCourse] = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, id));

      if (!existingCourse) {
        res.status(404).json({
          success: false,
          message: "Course not found",
        });
        return;
      }

      await db
        .update(coursesTable)
        .set({
          title:
            body.title ??
            existingCourse.title,

          description:
            body.description ??
            existingCourse.description,

          category:
            body.category ??
            existingCourse.category,

          price:
            body.price ??
            existingCourse.price,

          ...(thumbnail && {
            thumbnail:
              (thumbnail as any).location,
          }),

          ...(promoVideo && {
            promotionalVideo:
              (promoVideo as any).location,
          }),

          updatedAt: new Date(),
        })
        .where(
          eq(
            coursesTable.id,
            id
          )
        );

      const [updatedCourse] =
        await db
          .select()
          .from(coursesTable)
          .where(
            eq(
              coursesTable.id,
              id
            )
          );

      res.status(200).json({
        success: true,
        message:
          "Course updated successfully",
        data: updatedCourse,
      });

    } catch (error) {

      console.error(
        "UPDATE COURSE ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update course",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }
);

router.post(
  "/course/updateSection",
  async (req, res): Promise<void> => {
    try {

      const {
        sectionId,
        sectionName,
      } = req.body;

      await db
        .update(sectionsTable)
        .set({
          sectionName,
        })
        .where(
          eq(
            sectionsTable.id,
            sectionId
          )
        );

      res.json({
        success: true,
        message:
          "Module updated",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to update module",
      });
    }
  }
);
router.post(
  "/course/deleteSection",
  async (req, res): Promise<void> => {

    try {

      const { sectionId } =
        req.body;

      const lessons =
        await db
          .select()
          .from(subSectionsTable)
          .where(
            eq(
              subSectionsTable.sectionId,
              sectionId
            )
          );

      const lessonIds =
        lessons.map(
          (l) => l.id
        );

      if (
        lessonIds.length
      ) {

        await db
          .delete(mcqTable)
          .where(
            inArray(
              mcqTable.subsectionId,
              lessonIds
            )
          );
      }

      await db
        .delete(
          subSectionsTable
        )
        .where(
          eq(
            subSectionsTable.sectionId,
            sectionId
          )
        );

      await db
        .delete(
          sectionsTable
        )
        .where(
          eq(
            sectionsTable.id,
            sectionId
          )
        );

      res.json({
        success: true,
      });

    } catch {

      res.status(500).json({
        success: false,
      });
    }
  }
);
router.post(
  "/course/updateSubSection",
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  async (req, res): Promise<void> => {

    try {

      const {
        subSectionId,
        title,
        description,
        timeDuration,
      } = req.body;

      const video =
        (req.files as any)
          ?.video?.[0];

      const pdf =
        (req.files as any)
          ?.pdf?.[0];

      const updateData: any = {
        title,
        description,
        timeDuration,
      };

      if (video?.location) {
        updateData.videoUrl =
          video.location;
      }

      if (pdf?.location) {
        updateData.pdfUrl =
          pdf.location;
      }

      await db
        .update(
          subSectionsTable
        )
        .set(updateData)
        .where(
          eq(
            subSectionsTable.id,
            subSectionId
          )
        );

      res.json({
        success: true,
        message:
          "Lesson updated",
      });

    } catch (error) {

      console.log(
        "UPDATE SUBSECTION ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        error:
          String(error),
      });
    }
  }
);
router.post(
  "/course/deleteSubSection",
  async (req, res): Promise<void> => {

    try {

      const {
        subSectionId,
      } = req.body;

      await db
        .delete(mcqTable)
        .where(
          eq(
            mcqTable.subsectionId,
            subSectionId
          )
        );

      await db
        .delete(
          subSectionsTable
        )
        .where(
          eq(
            subSectionsTable.id,
            subSectionId
          )
        );

      res.json({
        success: true,
      });

    } catch {

      res.status(500).json({
        success: false,
      });
    }
  }
);
router.post(
  "/mcq/update",
  async (req, res): Promise<void> => {

    try {

      console.log(
        "MCQ UPDATE BODY =>",
        req.body
      );

      const {
        mcqId,
        question,
        options,
        correctAnswer,
      } = req.body;

      await db
        .update(mcqTable)
        .set({
          question,
          options,
          correctAnswer,
        })
        .where(
          eq(
            mcqTable.id,
            mcqId
          )
        );

      res.json({
        success: true,
      });

    } catch (error: any) {

      console.log(
        "MCQ UPDATE ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error?.message,
      });
    }
  }
);
router.delete(
  "/mcq/:id",
  async (req, res): Promise<void> => {

    try {

      const { id } =
        req.params;

      await db
        .delete(mcqTable)
        .where(
          eq(
            mcqTable.id,
            id
          )
        );

      res.json({
        success: true,
      });

    } catch {

      res.status(500).json({
        success: false,
      });
    }
  }
);
export default router;
