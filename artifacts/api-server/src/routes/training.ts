// artifacts\api-server\src\routes\training.ts
import { upload } from "../lib/upload";
import { Router, type IRouter } from "express";
import {
  eq,
  desc,
  and,
  inArray,
  asc,
} from "drizzle-orm";
import {
  db,
  coursesTable,
  sectionsTable,
  subSectionsTable,
  candidatesTable,
  usersTable,
  trainingAssignmentsTable,
  activityTable,
  mcqTable,
  paymentLinksTable,
  learningPathsTable,
  liveSessionsTable,
  userCourseProgressTable,
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
import { requireAuth, requireRole, requireCandidateAccess, attachUser } from "../lib/auth";


// Add ai imports
import { AI_CONFIG } from "../lib/ai/config";
import { recommendTrainingWithAI } from "../lib/training-ai";

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

    // Legacy recomendation
    // const rec = recommendTraining({
    //   id: candidate.id,
    //   targetRole: candidate.targetRole,
    //   evaluation: candidate.evaluation,
    // });

    // Legacy + AI RECOMENDATION
    const trainingCandidate = {
      id: candidate.id,
      targetRole: candidate.targetRole,
      evaluation: candidate.evaluation,
    };

    // ==========================================================
    // LEGACY RECOMMENDATION
    // ==========================================================

    // const rec = recommendTraining(trainingCandidate);

    // ==========================================================
    // FULL AI RECOMMENDATION
    // ==========================================================

    const rec = await recommendTrainingWithAI(
      trainingCandidate,
    );

    // ==========================================================
    // HYBRID MODE (AI + LEGACY FALLBACK)
    // ==========================================================

    // let rec = recommendTraining(trainingCandidate);

    // if (AI_CONFIG.enabled) {
    //   try {
    //     rec = await recommendTrainingWithAI(
    //       trainingCandidate,
    //     );
    //   } catch {}
    // }

    const start = new Date();
    start.setDate(start.getDate() + 7);

    const target = new Date(start);
    target.setMonth(target.getMonth() + 3);

    res.json({
      candidateId: candidate.id,

      assessmentCategory: rec.assessmentCategory,

      trainingType: rec.trainingType,

      learningPathId: rec.learningPathId,

      learningPathTitle: rec.learningPathTitle,

      confidence: rec.confidence,

      rationale: rec.rationale,

      suggestedStartDate: start.toISOString(),

      suggestedTargetCompletionDate: target.toISOString(),
    });
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
router.post(
  "/training/assignments",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    try {
      console.log("========== CREATE TRAINING ASSIGNMENT ==========");
      console.log("USER =", req.user);
      console.log("BODY =", req.body);

      const body = CreateTrainingAssignmentBody.safeParse(req.body);

      if (!body.success) {
        console.log(body.error.flatten());

        return res.status(400).json({
          success: false,
          issues: body.error.flatten(),
        });
      }

      // =====================================================
      // Candidate
      // =====================================================

      const [candidate] = await db
        .select()
        .from(candidatesTable)
        .where(eq(candidatesTable.id, body.data.candidateId));

        const recruiters = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.role, "recruiter"));
          console.log("recruiters=",recruiters);

      if (!recruiters) {
        return res.status(404).json({
          success: false,
          error: "Candidate not found",
        });
      }

      // =====================================================
      // Learning Path
      // =====================================================

      const [learningPath] = await db
        .select()
        .from(learningPathsTable)
        .where(eq(learningPathsTable.id, body.data.learningPathId));

      if (!learningPath) {
        return res.status(404).json({
          success: false,
          error: "Learning Path not found",
        });
      }

      // =====================================================
      // Courses
      // =====================================================

      const courses =
        learningPath.courseIds?.length > 0
          ? await db
              .select()
              .from(coursesTable)
              .where(
                inArray(
                  coursesTable.id,
                  learningPath.courseIds
                )
              )
          : [];

      // =====================================================
      // Program Object
      // =====================================================

      const program = {
        id: learningPath.id,
        name: learningPath.title,
         trainingType: "upskilling",
        // trainingType: body.data.trainingType,
        recommendedPath: learningPath.title,
        deliveryMode: "hybrid",
        durationWeeks: 8,
        focusAreas: [],
        moduleTemplates: courses.map((course) => ({
          title: course.title,
          durationMinutes: 60,
        })),
      };

     // =====================================================
      // Trainer = Logged In User
      // =====================================================

      const trainer = {
        id: req.user!.id,
        name: req.user!.fullName,
      };

      console.log("Logged In User =>", trainer);
      // =====================================================
      // Dates
      // =====================================================

      const startDate = new Date(body.data.startDate);

      const targetCompletionDate = new Date(
        body.data.targetCompletionDate
      );

      // =====================================================
      // Modules & Sessions
      // =====================================================

      const modules = buildInitialModules(program);

      const liveSessions =
        buildInitialLiveSessions(
          program,
          trainer,
          startDate
        );

      // =====================================================
      // Assessment
      // =====================================================

      const assessmentCategory =
        program.trainingType === "reskilling"
          ? "needs_reskilling"
          : "needs_upskilling";

      // =====================================================
      // Save Assignment
      // =====================================================

    const [row] = await db
  .insert(trainingAssignmentsTable)
  .values({
    candidateId: candidate.id,

    learningPathId: learningPath.id,

    assessmentCategory,

    trainingType: program.trainingType,

    programId: program.id,

    programName: program.name,

    recommendedPath: program.recommendedPath,

    deliveryMode: program.deliveryMode,

    trainerId: req.user!.id,

    trainerName: req.user!.fullName,

    modules,

    liveSessions,

    startDate,

    targetCompletionDate,

    status: "not_started",

    progressPct: 0,
  })
  .returning();

      if (!row) {
        return res.status(500).json({
          success: false,
          error: "Failed to create assignment",
        });
      }

      // =====================================================
      // Activity
      // =====================================================

      await db.insert(activityTable).values({
        kind: "upskilling",

        candidateName:
          candidate.fullName,

        country: candidate.country,

        message: `${candidate.fullName} assigned to ${learningPath.title}`,
      });

      // =====================================================
      // Response
      // =====================================================

      return res.status(201).json(
        GetTrainingAssignmentResponse.parse(
          serializeTrainingAssignment(
            row,
            candidate
          )
        )
      );

    } catch (error: any) {

      console.log(
        "CREATE TRAINING ERROR =>",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);
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
    try {
      const candidateId = req.params.id;

      let [row] = await db
        .select()
        .from(trainingAssignmentsTable)
        .where(eq(trainingAssignmentsTable.candidateId, candidateId))
        .orderBy(desc(trainingAssignmentsTable.createdAt))
        .limit(1);

      if (!row) {
        // Fallback: check if id is a user ID
        const [u] = await db.select().from(usersTable).where(eq(usersTable.id, candidateId)).limit(1);
        if (u?.candidateId) {
          [row] = await db
            .select()
            .from(trainingAssignmentsTable)
            .where(eq(trainingAssignmentsTable.candidateId, u.candidateId))
            .orderBy(desc(trainingAssignmentsTable.createdAt))
            .limit(1);
        }
      }

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
    } catch (error: any) {
      console.error("GET CANDIDATE TRAINING ERROR:", error);
      res.status(500).json({ error: error?.message || "Failed to load candidate training" });
    }
  },
);

router.get(
  "/candidates/:id/course-progress-details",
  requireAuth,
  requireCandidateAccess(),
  async (req, res): Promise<void> => {
    try {
      const candidateId = req.params.id;

      const userIds = new Set<string>([candidateId]);
      let candRow: any = null;

      try {
        const [c] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, candidateId)).limit(1);
        if (c) {
          candRow = c;
          userIds.add(c.id);
          if (c.email) {
            userIds.add(c.email);
            userIds.add(c.email.split("@")[0]);
          }
          const matchedUsers = await db.select().from(usersTable);
          matchedUsers.forEach((u) => {
            if (u.candidateId === c.id || (c.email && u.email?.toLowerCase() === c.email.toLowerCase())) {
              if (u.id) userIds.add(u.id);
              if (u.email) {
                userIds.add(u.email);
                userIds.add(u.email.split("@")[0]);
              }
            }
          });
        } else {
          const allUsers = await db.select().from(usersTable);
          const matched = allUsers.filter(u => u.id === candidateId || u.email?.toLowerCase() === candidateId.toLowerCase());
          matched.forEach((u) => {
            if (u.id) userIds.add(u.id);
            if (u.email) {
              userIds.add(u.email);
              userIds.add(u.email.split("@")[0]);
            }
            if (u.candidateId) userIds.add(u.candidateId);
          });
        }
      } catch (err) {
        console.warn("Candidate lookup error:", err);
      }

      const idList = Array.from(userIds).filter(Boolean);

      let progressEntries: any[] = [];
      try {
        const allProgress = await db.select().from(userCourseProgressTable);
        progressEntries = allProgress.filter((p) =>
          idList.some((id) => p.userId && (String(p.userId) === String(id) || String(p.userId).includes(String(id))))
        );
      } catch (err) {
        console.warn("Progress entries lookup error:", err);
      }

      const courseIdSet = new Set<string>();
      progressEntries.forEach((p) => {
        if (p.courseId) courseIdSet.add(p.courseId);
      });

      let assignments: any[] = [];
      try {
        const allAsg = await db.select().from(trainingAssignmentsTable);
        assignments = allAsg.filter(a => idList.includes(a.candidateId));
        for (const a of assignments) {
          if (a.programName) {
            const lps = await db.select().from(learningPathsTable);
            for (const lp of lps) {
              if (lp.title?.toLowerCase() === a.programName.toLowerCase() && Array.isArray(lp.courseIds)) {
                lp.courseIds.forEach((cid) => courseIdSet.add(cid));
              }
            }
          }
        }
      } catch (err) {
        console.warn("Assignments lookup error:", err);
      }

      if (courseIdSet.size === 0) {
        try {
          const allProg = await db.select().from(userCourseProgressTable);
          allProg.forEach((p) => {
            if (p.courseId) courseIdSet.add(p.courseId);
          });
          if (courseIdSet.size === 0) {
            const allCourses = await db.select().from(coursesTable);
            allCourses.forEach((c) => courseIdSet.add(c.id));
          }
        } catch (err) {
          console.warn("Fallback courses lookup error:", err);
        }
      }

      const courseIds = Array.from(courseIdSet);
      const detailedCourses = [];

      for (const courseId of courseIds) {
        try {
          const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
          if (!course) continue;

          const sections = await db.select().from(sectionsTable).where(eq(sectionsTable.courseId, course.id)).orderBy(asc(sectionsTable.createdAt));
          const finalSections = [];

          for (const sec of sections) {
            const rawLessons = await db.select().from(subSectionsTable).where(eq(subSectionsTable.sectionId, sec.id)).orderBy(asc(subSectionsTable.createdAt));
            // Filter out empty auto-created "Final Assessment" placeholder subsections from standard course curriculum
            const lessons = rawLessons.filter((l) => {
              const t = (l.title || "").trim().toLowerCase();
              if ((t === "final assessment" || t === "assessment" || t.includes("auto-created assessment")) && !l.videoUrl && !l.pdfUrl) {
                return false;
              }
              return true;
            });
            if (lessons.length > 0) {
              finalSections.push({
                id: sec.id,
                title: sec.sectionName,
                lessons: lessons.map((l) => ({
                  id: l.id,
                  title: l.title,
                  description: l.description,
                  duration: l.timeDuration,
                  durationMinutes: l.timeDuration ? parseInt(l.timeDuration, 10) || undefined : undefined,
                  videoUrl: l.videoUrl,
                  pdfUrl: l.pdfUrl,
                })),
              });
            }
          }

          const courseProgressList = progressEntries.filter((p) => p.courseId === course.id);
          let mergedLessons: Record<string, boolean> = {};
          let mergedQuizzes: Record<string, boolean> = {};
          let mergedPositions: Record<string, number> = {};
          let lastActiveLessonId: string | undefined = undefined;
          let lastContentMode: string | undefined = undefined;
          let finalAssessment: any = undefined;

          for (const rec of courseProgressList) {
            if (rec.completedLessons && typeof rec.completedLessons === "object") {
              mergedLessons = { ...mergedLessons, ...(rec.completedLessons as Record<string, boolean>) };
            }
            if (rec.completedQuizzes && typeof rec.completedQuizzes === "object") {
              mergedQuizzes = { ...mergedQuizzes, ...(rec.completedQuizzes as Record<string, boolean>) };
            }
            if (rec.lessonPositions && typeof rec.lessonPositions === "object") {
              mergedPositions = { ...mergedPositions, ...(rec.lessonPositions as Record<string, number>) };
            }
            if (rec.lastActiveLessonId) lastActiveLessonId = rec.lastActiveLessonId;
            if (rec.lastContentMode) lastContentMode = rec.lastContentMode;
            if (rec.finalAssessment) finalAssessment = rec.finalAssessment;
          }

          detailedCourses.push({
            id: course.id,
            title: course.title || (course as any).courseName,
            courseName: course.title || (course as any).courseName,
            description: course.description,
            thumbnail: course.thumbnail,
            difficulty: course.difficulty || (course as any).courseLevel,
            sections: finalSections,
            progress: {
              completedLessons: mergedLessons,
              completedQuizzes: mergedQuizzes,
              lessonPositions: mergedPositions,
              lastActiveLessonId,
              lastContentMode,
              finalAssessment,
            },
          });
        } catch (err) {
          console.warn("Course detailed item lookup error:", err);
        }
      }

      let projectsList: any[] = [];

      const [latestAssignment] = assignments.length > 0 ? assignments : [null];

      res.json({
        success: true,
        candidate: candRow,
        training: latestAssignment,
        courses: detailedCourses,
        projects: projectsList,
      });
    } catch (error: any) {
      console.error("Course progress details handler error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch candidate progress details", error: String(error) });
    }
  }
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
          success: false,
          message: "subsectionId missing",
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
        success: true,
        data: mcq,
      })

    } catch (error: any) {

      console.log(
        "MCQ CREATE ERROR =>",
        error
      )

      res.status(500).json({
        success: false,
        message: error?.message,
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
          )
          .orderBy(
            asc(sectionsTable.createdAt)
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
                  )
                  .orderBy(
                    asc(subSectionsTable.createdAt)
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
// COURSE PROGRESS (GET & POST)
// ======================================================
router.get("/courses/:id/progress", attachUser, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const rawUserId = (req.query.userId as string) || (req as any).user?.id || (req.headers["x-user-id"] as string) || "guest";

    const userIds = new Set<string>([rawUserId]);
    if (rawUserId && rawUserId !== "guest") {
      try {
        const [u] = await db.select().from(usersTable).where(eq(usersTable.id, rawUserId)).limit(1);
        if (u) {
          userIds.add(u.id);
          if (u.candidateId) userIds.add(u.candidateId);
        }
      } catch {}
      try {
        const [c] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, rawUserId)).limit(1);
        if (c) {
          userIds.add(c.id);
          const [u2] = await db.select().from(usersTable).where(eq(usersTable.candidateId, c.id)).limit(1);
          if (u2) userIds.add(u2.id);
        }
      } catch {}
    }

    const idList = Array.from(userIds);
    const existingList = await db
      .select()
      .from(userCourseProgressTable)
      .where(
        and(
          inArray(userCourseProgressTable.userId, idList),
          eq(userCourseProgressTable.courseId, id)
        )
      );

    if (existingList.length > 0) {
      // Merge progress from all matching user / candidate records
      let mergedLessons: Record<string, boolean> = {};
      let mergedQuizzes: Record<string, boolean> = {};
      let mergedPositions: Record<string, number> = {};
      let lastActiveLessonId: string | undefined = undefined;
      let lastContentMode: string | undefined = undefined;
      let finalAssessment: any = undefined;

      for (const rec of existingList) {
        if (rec.completedLessons && typeof rec.completedLessons === "object") {
          mergedLessons = { ...mergedLessons, ...(rec.completedLessons as Record<string, boolean>) };
        }
        if (rec.completedQuizzes && typeof rec.completedQuizzes === "object") {
          mergedQuizzes = { ...mergedQuizzes, ...(rec.completedQuizzes as Record<string, boolean>) };
        }
        if (rec.lessonPositions && typeof rec.lessonPositions === "object") {
          mergedPositions = { ...mergedPositions, ...(rec.lessonPositions as Record<string, number>) };
        }
        if (rec.lastActiveLessonId) lastActiveLessonId = rec.lastActiveLessonId;
        if (rec.lastContentMode) lastContentMode = rec.lastContentMode;
        if (rec.finalAssessment) finalAssessment = rec.finalAssessment;
      }

      res.json({
        success: true,
        data: {
          completedLessons: mergedLessons,
          completedQuizzes: mergedQuizzes,
          lessonPositions: mergedPositions,
          lastActiveLessonId: lastActiveLessonId || undefined,
          lastContentMode: lastContentMode || undefined,
          finalAssessment: finalAssessment || undefined,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        completedLessons: {},
        completedQuizzes: {},
        lessonPositions: {},
      },
    });
  } catch (error) {
    console.error("Failed to get course progress:", error);
    res.status(500).json({ success: false, message: "Failed to get progress" });
  }
});

router.post("/courses/:id/progress", attachUser, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const rawUserId = (req.query.userId as string) || (req as any).user?.id || (req.headers["x-user-id"] as string) || req.body?.userId || "guest";

    const userIds = new Set<string>([rawUserId]);
    if (rawUserId && rawUserId !== "guest") {
      try {
        const [u] = await db.select().from(usersTable).where(eq(usersTable.id, rawUserId)).limit(1);
        if (u) {
          userIds.add(u.id);
          if (u.candidateId) userIds.add(u.candidateId);
        }
      } catch {}
      try {
        const [c] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, rawUserId)).limit(1);
        if (c) {
          userIds.add(c.id);
          const [u2] = await db.select().from(usersTable).where(eq(usersTable.candidateId, c.id)).limit(1);
          if (u2) userIds.add(u2.id);
        }
      } catch {}
    }

    const idList = Array.from(userIds);
    const [existing] = await db
      .select()
      .from(userCourseProgressTable)
      .where(
        and(
          inArray(userCourseProgressTable.userId, idList),
          eq(userCourseProgressTable.courseId, id)
        )
      )
      .limit(1);

    const prevLessons = (existing?.completedLessons && typeof existing.completedLessons === "object") ? existing.completedLessons : {};
    const prevQuizzes = (existing?.completedQuizzes && typeof existing.completedQuizzes === "object") ? existing.completedQuizzes : {};
    const prevPositions = (existing?.lessonPositions && typeof existing.lessonPositions === "object") ? existing.lessonPositions : {};

    const updatedLessons = {
      ...prevLessons,
      ...(req.body.completedLessons || {}),
    };
    const updatedQuizzes = {
      ...prevQuizzes,
      ...(req.body.completedQuizzes || {}),
    };
    const updatedPositions = {
      ...prevPositions,
      ...(req.body.lessonPositions || {}),
    };
    const updatedLastActiveLessonId = req.body.lastActiveLessonId ?? existing?.lastActiveLessonId ?? null;
    const updatedLastContentMode = req.body.lastContentMode ?? existing?.lastContentMode ?? null;
    const updatedFinalAssessment = req.body.finalAssessment ?? existing?.finalAssessment ?? null;

    if (existing) {
      await db
        .update(userCourseProgressTable)
        .set({
          completedLessons: updatedLessons,
          completedQuizzes: updatedQuizzes,
          lessonPositions: updatedPositions,
          lastActiveLessonId: updatedLastActiveLessonId,
          lastContentMode: updatedLastContentMode,
          finalAssessment: updatedFinalAssessment,
          updatedAt: new Date(),
        })
        .where(eq(userCourseProgressTable.id, existing.id));
    } else {
      await db.insert(userCourseProgressTable).values({
        userId: rawUserId,
        courseId: id,
        completedLessons: updatedLessons,
        completedQuizzes: updatedQuizzes,
        lessonPositions: updatedPositions,
        lastActiveLessonId: updatedLastActiveLessonId,
        lastContentMode: updatedLastContentMode,
        finalAssessment: updatedFinalAssessment,
      });
    }

    const responseData = {
      completedLessons: updatedLessons,
      completedQuizzes: updatedQuizzes,
      lessonPositions: updatedPositions,
      lastActiveLessonId: updatedLastActiveLessonId || undefined,
      lastContentMode: updatedLastContentMode || undefined,
      finalAssessment: updatedFinalAssessment || undefined,
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Failed to save course progress:", error);
    res.status(500).json({ success: false, message: "Failed to save progress" });
  }
});




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

          whatYouWillLearn: body.whatYouWillLearn
            ? JSON.parse(body.whatYouWillLearn)
            : [],

          instructions: body.instructions
            ? JSON.parse(body.instructions)
            : [],

          faqs: body.faqs
            ? JSON.parse(body.faqs)
            : [],

          tags: body.tag
            ? JSON.parse(body.tag)
            : [],

          ...(thumbnail && {
            thumbnail: thumbnail.location,
          }),

          ...(promoVideo && {
            promotionalVideo: promoVideo.location,
          }),
        })
        .where(eq(coursesTable.id, courseId));

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

router.get(
  "/student/my-learning",
  requireAuth,
  async (req, res) => {
    try {
      const user = req.user;

      // =========================
      // PAID PAYMENTS
      // =========================

      const payments = await db
        .select()
        .from(paymentLinksTable)
        .where(
          eq(
            paymentLinksTable.studentEmail,
            user.email
          )
        );

      const paidPayments =
        payments.filter(
          (p) => p.status === "paid"
        );

      const purchasedCourseIds = [
        ...new Set(
          paidPayments.flatMap(
            (p) => p.courseIds || []
          )
        ),
      ];

      // =========================
      // COURSES
      // =========================

      const allCourses = await db
        .select()
        .from(coursesTable);

      const courses =
        allCourses.filter((course) =>
          purchasedCourseIds.includes(
            course.id
          )
        );

      // =========================
      // LEARNING PATHS
      // =========================

      const learningPaths =
        await db
          .select()
          .from(
            learningPathsTable
          );

      const userLearningPaths =
        learningPaths.filter((lp) =>
          lp.courseIds?.some(
            (id) =>
              purchasedCourseIds.includes(
                id
              )
          )
        );

      // =========================
      // LIVE SESSIONS
      // =========================

      const sessions =
        await db
          .select()
          .from(
            liveSessionsTable
          )
          .where(
            eq(
              liveSessionsTable.studentEmail,
              user.email
            )
          );

      // =========================
      // FINAL RESPONSE
      // =========================

      const data = await Promise.all(
        userLearningPaths.map(
          async (lp) => {

            const lpCourses = await Promise.all(
              courses
                .filter((course) =>
                  lp.courseIds?.includes(course.id)
                )
                .map(async (course) => {

                  const sections = await db
                    .select()
                    .from(sectionsTable)
                    .where(
                      eq(
                        sectionsTable.courseId,
                        course.id
                      )
                    );

                  const sectionIds = sections.map(
                    (s) => s.id
                  );

                  let lessons: any[] = [];

                  if (sectionIds.length > 0) {
                    lessons = await db
                      .select()
                      .from(subSectionsTable)
                      .where(
                        inArray(
                          subSectionsTable.sectionId,
                          sectionIds
                        )
                      );
                  }

                  const quizzes = await db
                    .select()
                    .from(mcqTable)
                    .where(
                      eq(
                        mcqTable.courseId,
                        course.id
                      )
                    );

                  return {
                    ...course,
                    lessonCount: lessons.length,
                    quizCount: quizzes.length,
                    videoCount: lessons.filter(
                      (lesson) => lesson.videoUrl
                    ).length,
                  };
                })
            );

            const lpSessions = sessions.filter(
              (session) =>
                lp.courseIds?.includes(
                  session.courseId
                )
            );

            return {
              learningPath: {
                id: lp.id,
                title: lp.title,
                description: lp.description,
                thumbnail: lp.thumbnail,
                introVideo: lp.introVideo,
                paymentLink: lp.paymentLink,
              },

              courses: lpCourses,
              sessions: lpSessions,

              payments: paidPayments.filter(
                (payment) =>
                  payment.courseIds?.some(
                    (id) =>
                      lp.courseIds?.includes(id)
                  )
              ),
            };
          }
        )
      );

      return res.json({
        success: true,
        student: {
          name:
            paidPayments[0]
              ?.studentName,
          email:
            user.email,
        },
        data,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to load student data",
      });
    }
  }
);
export default router;