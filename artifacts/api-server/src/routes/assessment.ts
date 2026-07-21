import { Router, type IRouter } from "express";
import { db, assessmentsTable, assessmentQuestionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

/* ======================================================
   CREATE ASSESSMENT
====================================================== */

router.post(
  "/assessment/create",
  async (req, res): Promise<void> => {
    try {
      const {
        assessmentName,
        targetRole,
        category,
        difficulty,
        passingPercentage,
        durationMinutes,
        instructions,
        description,
        status,
        createdBy,
        questions,
      } = req.body;

      if (!assessmentName) {
        res.status(400).json({
          success: false,
          message: "Assessment Name is required",
        });
        return;
      }

      if (!targetRole) {
        res.status(400).json({
          success: false,
          message: "Target Role is required",
        });
        return;
      }

      if (!category) {
        res.status(400).json({
          success: false,
          message: "Category is required",
        });
        return;
      }

      const [assessment] = await db
        .insert(assessmentsTable)
        .values({
          assessmentName,
          targetRole,
          category,
          difficulty: difficulty || "Easy",
          passingPercentage:
            Number(passingPercentage) || 70,
          durationMinutes:
            Number(durationMinutes) || 30,
          instructions,
          description,
          status: status || "Draft",
          createdBy,
        })
        .returning();

      /* -----------------------------------
         SAVE QUESTIONS
      ------------------------------------ */

      if (
        Array.isArray(questions) &&
        questions.length > 0
      ) {
        const questionRows = questions.map(
          (question: any, index: number) => ({
            assessmentId: assessment.id,

            question: question.question,

            options:
              question.options || [],

            correctAnswer:
              Number(
                question.correctAnswer
              ) || 0,

            explanation:
              question.explanation || "",

            difficulty:
              question.difficulty ||
              "Easy",

            marks:
              Number(question.marks) || 1,

            timeLimitSeconds:
              Number(
                question.timeLimitSeconds
              ) || 60,

            status:
              question.status ||
              "Draft",

            orderNo: index + 1,
          })
        );

        await db
          .insert(
            assessmentQuestionsTable
          )
          .values(questionRows);
      }

      res.status(201).json({
        success: true,
        message:
          "Assessment created successfully",
        data: assessment,
      });
    } catch (error) {
      console.log(
        "CREATE ASSESSMENT ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create assessment",
      });
    }
  }
);
/* ======================================================
   GET ALL ASSESSMENTS
====================================================== */

router.get(
  "/assessments",
  async (_req, res): Promise<void> => {
    try {
      const assessments = await db
        .select()
        .from(assessmentsTable)
        .orderBy(desc(assessmentsTable.createdAt));

      const data = await Promise.all(
        assessments.map(async (assessment) => {
          const questions = await db
            .select()
            .from(assessmentQuestionsTable)
            .where(
              eq(
                assessmentQuestionsTable.assessmentId,
                assessment.id
              )
            )
            .orderBy(
              assessmentQuestionsTable.orderNo
            );

          return {
            ...assessment,
            questions,
            totalQuestions: questions.length,
            activeQuestions: questions.filter(
              (q) => q.status === "Published"
            ).length,
          };
        })
      );

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.log(
        "GET ASSESSMENTS ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch assessments",
      });
    }
  }
);

/* ======================================================
   GET SINGLE ASSESSMENT
====================================================== */

router.get(
  "/assessments/:id",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        )
        .orderBy(
          assessmentQuestionsTable.orderNo
        );

      res.status(200).json({
        success: true,
        data: {
          ...assessment,
          questions,
        },
      });
    } catch (error) {
      console.log(
        "GET ASSESSMENT ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch assessment",
      });
    }
  }
);

/* ======================================================
   UPDATE ASSESSMENT
====================================================== */

router.put(
  "/assessments/:id",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const {
        assessmentName,
        targetRole,
        category,
        difficulty,
        passingPercentage,
        durationMinutes,
        instructions,
        description,
        status,
      } = req.body;

      const [existingAssessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!existingAssessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      await db
        .update(assessmentsTable)
        .set({
          assessmentName:
            assessmentName ??
            existingAssessment.assessmentName,

          targetRole:
            targetRole ??
            existingAssessment.targetRole,

          category:
            category ??
            existingAssessment.category,

          difficulty:
            difficulty ??
            existingAssessment.difficulty,

          passingPercentage:
            passingPercentage ??
            existingAssessment.passingPercentage,

          durationMinutes:
            durationMinutes ??
            existingAssessment.durationMinutes,

          instructions:
            instructions ??
            existingAssessment.instructions,

          description:
            description ??
            existingAssessment.description,

          status:
            status ??
            existingAssessment.status,

          updatedAt: new Date(),
        })
        .where(eq(assessmentsTable.id, id));

      const [updatedAssessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      res.status(200).json({
        success: true,
        message:
          "Assessment updated successfully",
        data: updatedAssessment,
      });
    } catch (error) {
      console.log(
        "UPDATE ASSESSMENT ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update assessment",
      });
    }
  }
);

/* ======================================================
   DELETE ASSESSMENT
====================================================== */

router.delete(
  "/assessments/:id",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      // Delete Questions First
      await db
        .delete(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      // Delete Assessment
      await db
        .delete(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      res.status(200).json({
        success: true,
        message:
          "Assessment deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE ASSESSMENT ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete assessment",
      });
    }
  }
);

/* ======================================================
   PUBLISH ASSESSMENT
====================================================== */

router.put(
  "/assessments/:id/publish",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      if (questions.length === 0) {
        res.status(400).json({
          success: false,
          message:
            "Add at least one question before publishing.",
        });
        return;
      }

      await db
        .update(assessmentsTable)
        .set({
          status: "Published",
          updatedAt: new Date(),
        })
        .where(eq(assessmentsTable.id, id));

      await db
        .update(assessmentQuestionsTable)
        .set({
          status: "Published",
        })
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      res.json({
        success: true,
        message:
          "Assessment published successfully.",
      });
    } catch (error) {
      console.log(
        "PUBLISH ASSESSMENT ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to publish assessment",
      });
    }
  }
);

/* ======================================================
   UNPUBLISH ASSESSMENT
====================================================== */

router.put(
  "/assessments/:id/unpublish",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      await db
        .update(assessmentsTable)
        .set({
          status: "Draft",
          updatedAt: new Date(),
        })
        .where(eq(assessmentsTable.id, id));

      await db
        .update(assessmentQuestionsTable)
        .set({
          status: "Draft",
        })
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      res.json({
        success: true,
        message:
          "Assessment moved to Draft.",
      });
    } catch (error) {
      console.log(
        "UNPUBLISH ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to unpublish assessment",
      });
    }
  }
);

/* ======================================================
   DASHBOARD SUMMARY
====================================================== */

router.get(
  "/assessments-dashboard",
  async (_req, res): Promise<void> => {
    try {
      const assessments = await db
        .select()
        .from(assessmentsTable);

      const questions = await db
        .select()
        .from(assessmentQuestionsTable);

      const totalAssessments =
        assessments.length;

      const publishedAssessments =
        assessments.filter(
          (a) =>
            a.status === "Published"
        ).length;

      const draftAssessments =
        assessments.filter(
          (a) => a.status === "Draft"
        ).length;

      const archivedAssessments =
        assessments.filter(
          (a) =>
            a.status === "Archived"
        ).length;

      res.json({
        success: true,
        data: {
          totalAssessments,
          publishedAssessments,
          draftAssessments,
          archivedAssessments,
          totalQuestions:
            questions.length,
        },
      });
    } catch (error) {
      console.log(
        "SUMMARY ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard summary",
      });
    }
  }
);
/* ======================================================
   ADD QUESTION
====================================================== */

router.post(
  "/assessments/:id/questions",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const {
        question,
        options,
        correctAnswer,
        explanation,
        difficulty,
        marks,
        timeLimitSeconds,
        status,
      } = req.body;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      if (!question) {
        res.status(400).json({
          success: false,
          message: "Question is required",
        });
        return;
      }

      if (!Array.isArray(options) || options.length < 2) {
        res.status(400).json({
          success: false,
          message: "Minimum 2 options required",
        });
        return;
      }

      const existingQuestions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.assessmentId, id));

      const [newQuestion] = await db
        .insert(assessmentQuestionsTable)
        .values({
          assessmentId: id,
          question,
          options,
          correctAnswer: Number(correctAnswer),
          explanation,
          difficulty: difficulty || "Easy",
          marks: Number(marks) || 1,
          timeLimitSeconds:
            Number(timeLimitSeconds) || 60,
          status: status || "Draft",
          orderNo: existingQuestions.length + 1,
        })
        .returning();

      res.status(201).json({
        success: true,
        message: "Question added successfully",
        data: newQuestion,
      });
    } catch (error) {
      console.log("ADD QUESTION ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to add question",
      });
    }
  }
);

/* ======================================================
   GET ALL QUESTIONS
====================================================== */

router.get(
  "/assessments/:id/questions",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.assessmentId, id))
        .orderBy(assessmentQuestionsTable.orderNo);

      res.json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (error) {
      console.log("GET QUESTIONS ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch questions",
      });
    }
  }
);

/* ======================================================
   GET SINGLE QUESTION
====================================================== */

router.get(
  "/questions/:questionId",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const [question] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.id,
            questionId
          )
        );

      if (!question) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      console.log("GET QUESTION ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch question",
      });
    }
  }
);
/* ======================================================
   UPDATE QUESTION
====================================================== */

router.put(
  "/questions/:questionId",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const {
        question,
        options,
        correctAnswer,
        explanation,
        difficulty,
        marks,
        timeLimitSeconds,
        status,
      } = req.body;

      const [existingQuestion] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      if (!existingQuestion) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      await db
        .update(assessmentQuestionsTable)
        .set({
          question:
            question ??
            existingQuestion.question,

          options:
            options ??
            existingQuestion.options,

          correctAnswer:
            correctAnswer ??
            existingQuestion.correctAnswer,

          explanation:
            explanation ??
            existingQuestion.explanation,

          difficulty:
            difficulty ??
            existingQuestion.difficulty,

          marks:
            marks ??
            existingQuestion.marks,

          timeLimitSeconds:
            timeLimitSeconds ??
            existingQuestion.timeLimitSeconds,

          status:
            status ??
            existingQuestion.status,
        })
        .where(eq(assessmentQuestionsTable.id, questionId));

      const [updatedQuestion] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      res.json({
        success: true,
        message: "Question updated successfully",
        data: updatedQuestion,
      });
    } catch (error) {
      console.log("UPDATE QUESTION ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to update question",
      });
    }
  }
);

/* ======================================================
   SAVE QUESTION AS DRAFT
====================================================== */

router.put(
  "/questions/:questionId/draft",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      await db
        .update(assessmentQuestionsTable)
        .set({
          status: "Draft",
        })
        .where(eq(assessmentQuestionsTable.id, questionId));

      res.json({
        success: true,
        message: "Question saved as Draft",
      });
    } catch (error) {
      console.log("SAVE DRAFT ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to save draft",
      });
    }
  }
);

/* ======================================================
   DUPLICATE QUESTION
====================================================== */

router.post(
  "/questions/:questionId/duplicate",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const [question] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      if (!question) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            question.assessmentId
          )
        );

      const [duplicate] = await db
        .insert(assessmentQuestionsTable)
        .values({
          assessmentId: question.assessmentId,

          question: `${question.question} (Copy)`,

          options: question.options,

          correctAnswer: question.correctAnswer,

          explanation: question.explanation,

          difficulty: question.difficulty,

          marks: question.marks,

          timeLimitSeconds:
            question.timeLimitSeconds,

          status: "Draft",

          orderNo: questions.length + 1,
        })
        .returning();

      res.json({
        success: true,
        message: "Question duplicated successfully",
        data: duplicate,
      });
    } catch (error) {
      console.log("DUPLICATE ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to duplicate question",
      });
    }
  }
);

/* ======================================================
   DELETE QUESTION
====================================================== */

router.delete(
  "/questions/:questionId",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const [question] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      if (!question) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      await db
        .delete(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      res.json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      console.log("DELETE QUESTION ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete question",
      });
    }
  }
);
/* ======================================================
   PUBLISH QUESTION
====================================================== */

router.put(
  "/questions/:questionId/publish",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const [question] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      if (!question) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      await db
        .update(assessmentQuestionsTable)
        .set({
          status: "Published",
        })
        .where(eq(assessmentQuestionsTable.id, questionId));

      res.json({
        success: true,
        message: "Question published successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to publish question",
      });
    }
  }
);

/* ======================================================
   ARCHIVE QUESTION
====================================================== */

router.put(
  "/questions/:questionId/archive",
  async (req, res): Promise<void> => {
    try {
      const { questionId } = req.params;

      const [question] = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.id, questionId));

      if (!question) {
        res.status(404).json({
          success: false,
          message: "Question not found",
        });
        return;
      }

      await db
        .update(assessmentQuestionsTable)
        .set({
          status: "Archived",
        })
        .where(eq(assessmentQuestionsTable.id, questionId));

      res.json({
        success: true,
        message: "Question archived successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to archive question",
      });
    }
  }
);

/* ======================================================
   REORDER QUESTIONS
====================================================== */

router.put(
  "/questions/reorder",
  async (req, res): Promise<void> => {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions)) {
        res.status(400).json({
          success: false,
          message: "Questions array is required",
        });
        return;
      }

      for (const item of questions) {
        await db
          .update(assessmentQuestionsTable)
          .set({
            orderNo: item.orderNo,
          })
          .where(
            eq(
              assessmentQuestionsTable.id,
              item.id
            )
          );
      }

      res.json({
        success: true,
        message: "Question order updated successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to reorder questions",
      });
    }
  }
);

/* ======================================================
   SEARCH QUESTIONS
====================================================== */

router.get(
  "/assessments/:id/questions/search",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;
      const search = String(req.query.search || "").toLowerCase();

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      const filtered = questions.filter((q) =>
        q.question.toLowerCase().includes(search)
      );

      res.json({
        success: true,
        data: filtered,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Search failed",
      });
    }
  }
);

/* ======================================================
   FILTER QUESTIONS
====================================================== */

router.get(
  "/assessments/:id/questions/filter",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const difficulty = String(
        req.query.difficulty || ""
      );

      const status = String(
        req.query.status || ""
      );

      let questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(
          eq(
            assessmentQuestionsTable.assessmentId,
            id
          )
        );

      if (difficulty) {
        questions = questions.filter(
          (q) => q.difficulty === difficulty
        );
      }

      if (status) {
        questions = questions.filter(
          (q) => q.status === status
        );
      }

      res.json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Filter failed",
      });
    }
  }
);
/* ======================================================
   DUPLICATE ASSESSMENT
====================================================== */

router.post(
  "/assessments/:id/duplicate",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      const questions = await db
        .select()
        .from(assessmentQuestionsTable)
        .where(eq(assessmentQuestionsTable.assessmentId, id));

      const [newAssessment] = await db
        .insert(assessmentsTable)
        .values({
          assessmentName: `${assessment.assessmentName} (Copy)`,
          targetRole: assessment.targetRole,
          category: assessment.category,
          difficulty: assessment.difficulty,
          passingPercentage: assessment.passingPercentage,
          durationMinutes: assessment.durationMinutes,
          instructions: assessment.instructions,
          description: assessment.description,
          status: "Draft",
          createdBy: assessment.createdBy,
        })
        .returning();

      if (questions.length > 0) {
        await db
          .insert(assessmentQuestionsTable)
          .values(
            questions.map((q, index) => ({
              assessmentId: newAssessment.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              marks: q.marks,
              timeLimitSeconds: q.timeLimitSeconds,
              status: "Draft",
              orderNo: index + 1,
            }))
          );
      }

      res.status(201).json({
        success: true,
        message: "Assessment duplicated successfully",
        data: newAssessment,
      });
    } catch (error) {
      console.log("DUPLICATE ASSESSMENT ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to duplicate assessment",
      });
    }
  }
);
/* ======================================================
   ARCHIVE ASSESSMENT
====================================================== */

router.put(
  "/assessments/:id/archive",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [assessment] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.id, id));

      if (!assessment) {
        res.status(404).json({
          success: false,
          message: "Assessment not found",
        });
        return;
      }

      await db
        .update(assessmentsTable)
        .set({
          status: "Archived",
          updatedAt: new Date(),
        })
        .where(eq(assessmentsTable.id, id));

      res.json({
        success: true,
        message: "Assessment archived successfully",
      });
    } catch (error) {
      console.log("ARCHIVE ASSESSMENT ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to archive assessment",
      });
    }
  }
);
router.get("/student/assessments", async (_req, res) => {
  try {
    const assessments = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.status, "Published"))
      .orderBy(desc(assessmentsTable.createdAt));

    const data = await Promise.all(
      assessments.map(async (assessment) => {
        const questions = await db
          .select()
          .from(assessmentQuestionsTable)
          .where(eq(assessmentQuestionsTable.assessmentId, assessment.id));

        return {
          id: assessment.id,
          assessmentName: assessment.assessmentName,
          targetRole: assessment.targetRole,
          durationMinutes: assessment.durationMinutes,
          passingPercentage: assessment.passingPercentage,
          difficulty:assessment.difficulty,
          instructions:assessment.instructions,
          totalQuestions: questions.filter(
            (q) => q.status === "Published"
          ).length,
          totalTimeLimitSeconds: questions
            .filter((q) => q.status === "Published")
            .reduce((total, question) => total + question.timeLimitSeconds, 0),
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to load assessments",
    });
  }
});
router.post("/student/assessment/submit", async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "Assessment ID is required",
      });
    }

    const questions = await db
      .select()
      .from(assessmentQuestionsTable)
      .where(eq(assessmentQuestionsTable.assessmentId, assessmentId));

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    const review = questions.map((q) => {
      const answer = answers.find(
        (a: any) => a.questionId === q.id
      );

      if (!answer || answer.selectedOption === null || answer.selectedOption === undefined) {
        skipped++;

        return {
          questionId: q.id,
          correct: false,
          skipped: true,
          selectedOption: null,
          correctOption: q.correctAnswer,
        };
      }

      const isCorrect =
        Number(answer.selectedOption) ===
        Number(q.correctAnswer);

      if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }

      return {
        questionId: q.id,
        correct: isCorrect,
        skipped: false,
        selectedOption: answer.selectedOption,
        correctOption: q.correctAnswer,
      };
    });

    const total = questions.length;

    const percentage =
      total === 0
        ? 0
        : Math.round((correct / total) * 100);

    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, assessmentId));

    const passed =
      percentage >= assessment.passingPercentage;

    res.json({
      success: true,
      data: {
        total,
        correct,
        wrong,
        skipped,
        percentage,
        passed,
        review,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Submit failed",
    });
  }
});
export default router;
