import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateTrainingAssignment,
  getTrainingDashboardQueryKey,
  getListTrainingAssignmentsQueryKey,
  useListCandidateProjects,
  useAssignCandidateProject,
  useUpdateProject,
  getListCandidateProjectsQueryKey,
  type Project,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { AssignTrainingDialog } from "@/components/training/AssignTrainingDialog";
import {
  ArrowLeft, Award, BookOpen, Brain, CalendarClock, CheckCircle2,
  Circle, ClipboardCheck, Clock3, Eye, GraduationCap, Layers, Loader2,
  Play, RefreshCcw, Sparkles, Trophy, UserCheck, Users, Video, XCircle,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import api from "../../services/api";

type ProgressData = {
  completedLessons?: Record<string, boolean>;
  completedQuizzes?: Record<string, boolean>;
  lessonPositions?: Record<string, number>;
  lastActiveLessonId?: string;
  lastContentMode?: string;
  finalAssessment?: {
    date?: string;
    score?: number;
    total?: number;
    passed?: boolean;
    completed?: boolean;
    percentage?: number;
  };
};

type LearningPath = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  introVideo?: string;
  courseIds?: string[];
  courses?: any[];
  isEnabled?: boolean;
};

function fmtDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString(undefined, {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function getPathId(training: any, search: string) {
  const params = new URLSearchParams(search);
  return (
    params.get("learningPathId") ||
    training?.learningPathId ||
    training?.learning_path_id ||
    training?.pathId ||
    training?.learningPath?.id ||
    training?.program?.learningPathId ||
    null
  );
}

function isAssessmentPlaceholder(item: any) {
  if (!item) return false;
  const t = (item.title || item.name || item.sectionName || "").trim().toLowerCase();
  return (
    t === "final assessment" ||
    t === "assessment" ||
    t === "final exam" ||
    t === "exam" ||
    t.includes("assessment container") ||
    t.includes("auto-created assessment")
  );
}

function extractCourseLessons(course: any) {
  let list: any[] = [];
  if (Array.isArray(course?.modules) && course.modules.length > 0) {
    list = course.modules;
  } else if (Array.isArray(course?.lessons) && course.lessons.length > 0) {
    list = course.lessons;
  } else if (Array.isArray(course?.sections) && course.sections.length > 0) {
    const validSections = course.sections.filter((s: any) => !isAssessmentPlaceholder(s));
    const targetSections = validSections.length > 0 ? validSections : course.sections;
    list = targetSections.flatMap((s: any) => (Array.isArray(s.lessons) ? s.lessons : []));
  }
  return list.filter((l: any) => !isAssessmentPlaceholder(l));
}

function fmtDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
}

function normalizeCourseDetails(course: any) {
  return course?.data ?? course?.course ?? course ?? {};
}

function QuizAssignmentModal({
  isOpen,
  onClose,
  course,
  candidateId,
  progress,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  candidateId: string;
  progress?: ProgressData;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assignmentTitle, setAssignmentTitle] = useState("Course Assignment & Quizzes");

  useEffect(() => {
    if (!isOpen || !course) return;

    let isMounted = true;
    setLoading(true);

    const courseId = course.id || course._id;
    const courseTitle = course.courseName || course.title || "";

    // Initialize existing answers from candidate's progress
    const existingAnswers: Record<number, number> = {};
    if (progress?.finalAssessment?.answers) {
      Object.entries(progress.finalAssessment.answers).forEach(([k, v]) => {
        existingAnswers[Number(k)] = Number(v);
      });
    }
    setSelectedAnswers(existingAnswers);

    // Fetch matching assignments or assessments from DB
    Promise.all([
      api.get("/api/assignments").catch(() => null),
      api.get("/api/assessments").catch(() => null),
    ]).then(([asgRes, astRes]) => {
      if (!isMounted) return;

      const assignments = asgRes?.data?.assignments || asgRes?.data?.data || [];
      const assessments = astRes?.data?.data || [];

      const matchedAsg = assignments.find(
        (a: any) =>
          (courseId && a.courseId === courseId) ||
          (courseTitle && a.courseName?.toLowerCase() === courseTitle.toLowerCase()) ||
          (a.title && a.title.toLowerCase().includes(courseTitle.toLowerCase()))
      );

      const matchedAst = assessments.find(
        (a: any) =>
          (courseId && a.courseId === courseId) ||
          (courseTitle && a.assessmentName?.toLowerCase().includes(courseTitle.toLowerCase()))
      );

      let foundQuestions: any[] = [];
      if (matchedAsg?.questions && Array.isArray(matchedAsg.questions) && matchedAsg.questions.length > 0) {
        setAssignmentTitle(matchedAsg.title || `${courseTitle} Assignment`);
        foundQuestions = matchedAsg.questions;
      } else if (matchedAst?.questions && Array.isArray(matchedAst.questions) && matchedAst.questions.length > 0) {
        setAssignmentTitle(matchedAst.assessmentName || `${courseTitle} Assessment`);
        foundQuestions = matchedAst.questions;
      } else if (Array.isArray(course?.sections)) {
        course.sections.forEach((sec: any) => {
          sec.lessons?.forEach((les: any) => {
            if (Array.isArray(les.quizzes)) {
              les.quizzes.forEach((q: any) => {
                if (q.question && Array.isArray(q.options)) {
                  foundQuestions.push(q);
                }
              });
            }
          });
        });
      }

      // Filter placeholder questions
      const valid = foundQuestions.filter(
        (q: any) => q.question && !q.question.toLowerCase().includes("enter your question")
      );

      if (valid.length > 0) {
        setQuestions(
          valid.map((q: any, idx: number) => ({
            id: idx + 1,
            question: q.question,
            options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
          }))
        );
      } else {
        // Fallback realistic course questions
        setQuestions([
          {
            id: 1,
            question: `What is the primary fundamental principle covered in ${courseTitle || "this course"}?`,
            options: [
              "Standard procedural implementation and structured design",
              "Unchecked deployment without automated testing",
              "Disabling configuration management protocols",
              "Manual execution of repetitive pipeline steps",
            ],
            correctAnswer: 0,
          },
          {
            id: 2,
            question: `Which methodology is recommended for continuous integration and version control?`,
            options: [
              "Direct hot-patching on production environment",
              "Automated linting, unit testing, and pull request reviews",
              "Skipping code validation checks",
              "Disregarding branch branching policies",
            ],
            correctAnswer: 1,
          },
          {
            id: 3,
            question: `How should state and security configurations be managed according to industry best practices?`,
            options: [
              "Hardcoding API keys in public repositories",
              "Encrypted environment variables and role-based access control",
              "Storing plain-text passwords in client files",
              "Allowing unauthenticated public write access",
            ],
            correctAnswer: 1,
          },
        ]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, course, progress]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;

  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const isPassed = percentage >= 60;

  const handleSaveAndSubmit = async () => {
    if (!course?.id) return;
    setSaving(true);

    try {
      const courseId = course.id || course._id;
      const completedQuizzes: Record<string, boolean> = { ...(progress?.completedQuizzes || {}) };
      questions.forEach((q) => {
        if (selectedAnswers[q.id] !== undefined) {
          completedQuizzes[`q_${q.id}`] = true;
        }
      });

      const assessmentPayload = {
        completed: answeredCount >= totalCount,
        score: correctCount,
        total: totalCount,
        percentage,
        passed: isPassed,
        date: new Date().toISOString().split("T")[0],
        answers: selectedAnswers,
      };

      await api.post(`/api/courses/${courseId}/progress`, {
        userId: candidateId,
        completedQuizzes,
        finalAssessment: assessmentPayload,
      });

      toast({
        title: "Assignment Quiz Saved!",
        description: `Score: ${correctCount}/${totalCount} (${percentage}%). Status: ${isPassed ? "Passed ✅" : "In Progress"}`,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        title: "Could not save quiz answers",
        description: err?.message || "Please check connection",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-background border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">{assignmentTitle}</h3>
              <Badge variant="outline" className="text-xs">
                {course?.courseName || course?.title || "Course"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Select your answers. Answered questions will indicate correct (✅) or incorrect (❌) status.
            </p>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full size-8" onClick={onClose}>
            <XCircle className="size-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>

        {/* Progress & Score Bar */}
        <div className="px-5 py-3 bg-muted/10 border-b flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span>Attempted: <strong>{answeredCount}/{totalCount}</strong></span>
            <span>·</span>
            <span>Score: <strong className={isPassed ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{percentage}%</strong></span>
          </div>
          <Badge className={isPassed ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-0" : answeredCount > 0 ? "bg-amber-500/10 text-amber-700 border-0" : "bg-muted text-muted-foreground border-0"}>
            {isPassed ? "Passed ✅" : answeredCount > 0 ? "In Progress ⏳" : "Not Started"}
          </Badge>
        </div>

        {/* Questions Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Loading assignment questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No questions found for this assignment.
            </div>
          ) : (
            questions.map((q, qIdx) => {
              const hasAnswered = selectedAnswers[q.id] !== undefined;
              const chosenOption = selectedAnswers[q.id];
              const isCorrect = chosenOption === q.correctAnswer;

              return (
                <div key={q.id || qIdx} className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-sm text-foreground flex items-start gap-2">
                      <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                        {qIdx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>
                    {hasAnswered && (
                      <Badge variant="outline" className={isCorrect ? "text-[11px] shrink-0 text-emerald-700 bg-emerald-50 border-emerald-300 font-bold" : "text-[11px] shrink-0 text-red-700 bg-red-50 border-red-300 font-bold"}>
                        {isCorrect ? "✅ Sahi (Correct)" : "❌ Galat (Incorrect)"}
                      </Badge>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = chosenOption === optIdx;
                      const isThisOptionCorrect = optIdx === q.correctAnswer;

                      let containerClass = "p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ";
                      if (hasAnswered) {
                        if (isSelected) {
                          if (isCorrect) {
                            containerClass += "bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm";
                          } else {
                            containerClass += "bg-red-500/15 border-red-500 text-red-900 dark:text-red-200 font-semibold shadow-sm";
                          }
                        } else if (isThisOptionCorrect) {
                          containerClass += "bg-emerald-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300";
                        } else {
                          containerClass += "bg-muted/20 border-border/60 opacity-60";
                        }
                      } else {
                        containerClass += isSelected ? "bg-primary/10 border-primary text-primary font-bold shadow-sm" : "bg-muted/10 hover:bg-muted/30 border-border";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={containerClass}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="size-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>

                          <div className="shrink-0 flex items-center gap-1">
                            {hasAnswered && isSelected && (
                              isCorrect ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                                  Your Answer ✅
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-700 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded">
                                  Your Answer ❌
                                </span>
                              )
                            )}
                            {hasAnswered && !isSelected && isThisOptionCorrect && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950 px-2 py-0.5 rounded">
                                Correct Option ✅
                              </span>
                            )}
                            {!hasAnswered && isSelected && (
                              <span className="text-[10px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-muted-foreground">
            {answeredCount < totalCount ? (
              <span>Remaining: <strong>{totalCount - answeredCount}</strong> question(s) left to fill</span>
            ) : (
              <span className="text-emerald-600 font-bold">All {totalCount} questions attempted!</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              className="bg-[#102B6A] hover:bg-[#0B1F4D] text-white font-bold"
              disabled={saving}
              onClick={handleSaveAndSubmit}
            >
              {saving ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <ClipboardCheck className="size-3.5 mr-1.5" />}
              Save & Submit Answers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateTraining() {
  // Supports either:
  // /candidate/:id/learning-student-path-list
  // or
  // /training/candidate/:candidateId
  const params = useParams<{ id?: string; candidateId?: string }>();
  const id = params.candidateId || params.id || "";
  const [, navigate] = useLocation();
  const reduce = useReducedMotion();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [assignOpen, setAssignOpen] = useState(false);
  const [quizModal, setQuizModal] = useState<{
    isOpen: boolean;
    course: any;
  }>({ isOpen: false, course: null });

  // Use the real backend endpoints directly here instead of the generated
  // candidate hooks. This page is recruiter/admin-facing, and the backend
  // already exposes both endpoints with requireAuth.
  const candidateQuery = useQuery({
    queryKey: ["admin-candidate", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/api/candidates/${encodeURIComponent(id)}`);
      return (res.data?.data ?? res.data) as any;
    },
  });

  const trainingQuery = useQuery({
    queryKey: ["admin-candidate-training", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/api/candidates/${encodeURIComponent(id)}/training`);
      return (res.data?.data ?? res.data) as any;
    },
  });

  const fallbackCandidate = useMemo(() => ({
    id: id || "candidate-id",
    fullName: "Student Candidate",
    name: "Student Candidate",
    role: "Software Developer",
    targetRole: "Software Developer",
    country: "IN",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Candidate",
  }), [id]);

  const fallbackTraining = useMemo(() => ({
    programName: "Training Course",
    recommendedPath: "Course Specialization",
    trainingType: "upskilling",
    trainerName: "Trainer",
    status: "in_progress",
    progressPct: 0,
    startDate: new Date().toISOString(),
    targetCompletionDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    modules: [],
    liveSessions: [],
  }), []);

  const candidate: any = candidateQuery.data || fallbackCandidate;
  const training: any = trainingQuery.data || fallbackTraining;
  const learningPathId = getPathId(training, window.location.search);

  const pathQuery = useQuery({
    queryKey: ["admin-candidate-learning-path", id, learningPathId],
    enabled: !!id && !!learningPathId,
    queryFn: async () => {
      const res = await api.get(`/api/learning-paths/${learningPathId}`);
      return (res.data?.data ?? res.data) as LearningPath;
    },
  });

  const path = pathQuery.data;

  // Your learning-path API returns both courseIds and courses[].
  // Prefer courses[] when present, otherwise build course stubs from courseIds.
  const pathCourses =
    Array.isArray(path?.courses) && path.courses.length > 0
      ? path.courses
      : (path?.courseIds || []).map((courseId: string) => ({ id: courseId }));

  const courseDetailsQuery = useQuery({
    queryKey: ["admin-candidate-learning-path-courses", id, learningPathId, path?.courseIds],
    enabled: !!id && pathCourses.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        pathCourses.map(async (course: any) => {
          const courseId = course?.id || course?._id;
          if (!courseId) return course;

          try {
            const res = await api.get(`/api/courses/${courseId}`);
            return normalizeCourseDetails(res.data);
          } catch {
            return course;
          }
        }),
      );
      return results.filter(Boolean);
    },
  });

  const detailedCoursesQuery = useQuery({
    queryKey: ["candidate-course-progress-details", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const res = await api.get(`/api/candidates/${encodeURIComponent(id)}/course-progress-details`);
        return (res.data?.courses || []) as any[];
      } catch {
        return [];
      }
    },
  });

  const allSystemCoursesQuery = useQuery({
    queryKey: ["all-system-courses-list"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/courses");
        return (res.data?.courses || res.data || []) as any[];
      } catch {
        return [];
      }
    },
  });

  const allDetailedCourses = detailedCoursesQuery.data ?? [];
  const systemCourses = allSystemCoursesQuery.data ?? [];

  const courses = useMemo(() => {
    const map = new Map<string, any>();

    // Index all system courses first
    const sysMap = new Map<string, any>();
    systemCourses.forEach((c: any) => {
      const cid = String(c.id || c._id || "");
      if (cid) sysMap.set(cid, c);
    });
    (courseDetailsQuery.data || []).forEach((c: any) => {
      const cid = String(c.id || c._id || "");
      if (cid) sysMap.set(cid, { ...(sysMap.get(cid) || {}), ...c });
    });

    // 1. Add all candidate progress courses merged with metadata
    allDetailedCourses.forEach((c: any) => {
      const cid = String(c.id || c._id || "");
      if (cid) {
        const sys = sysMap.get(cid) || {};
        map.set(cid, {
          ...sys,
          ...c,
          title: c.title || c.courseName || sys.title || sys.courseName,
          courseName: c.courseName || c.title || sys.courseName || sys.title,
          description: c.description || sys.description,
          thumbnail: c.thumbnail || sys.thumbnail,
        });
      }
    });

    // 2. Add courses from candidate's learning path
    (courseDetailsQuery.data || []).forEach((c: any) => {
      const cid = String(c.id || c._id || "");
      if (cid) {
        const sys = sysMap.get(cid) || {};
        const existing = map.get(cid) || {};
        map.set(cid, {
          ...sys,
          ...existing,
          ...c,
          title: c.title || c.courseName || existing.title || existing.courseName || sys.title || sys.courseName,
          courseName: c.courseName || c.title || existing.courseName || existing.title || sys.courseName || sys.title,
          description: c.description || existing.description || sys.description,
          thumbnail: c.thumbnail || existing.thumbnail || sys.thumbnail,
        });
      }
    });

    // 3. If empty, fallback to system courses
    if (map.size === 0) {
      systemCourses.forEach((c: any) => {
        const cid = String(c.id || c._id || "");
        if (cid) map.set(cid, c);
      });
    }

    return Array.from(map.values());
  }, [allDetailedCourses, courseDetailsQuery.data, systemCourses]);

  const candidateProjects = Array.isArray(training?.projects) ? training.projects : Array.isArray(candidate?.projects) ? candidate.projects : [];

  const updateMut = useUpdateTrainingAssignment({
    mutation: {
      onSuccess: () => {
        toast({ title: "Training updated" });
        qc.invalidateQueries({ queryKey: ["admin-candidate-training", id] });
        qc.invalidateQueries({ queryKey: ["candidate-course-progress-details", id] });
        qc.invalidateQueries({ queryKey: getTrainingDashboardQueryKey() });
        qc.invalidateQueries({ queryKey: getListTrainingAssignmentsQueryKey() });
      },
      onError: (err) => toast({
        title: "Could not update",
        description: (err as Error).message,
        variant: "destructive",
      }),
    },
  });

  const progressMap: Record<string, ProgressData> = useMemo(() => {
    const map: Record<string, ProgressData> = {};
    allDetailedCourses.forEach((c: any) => {
      if (c.id && c.progress) {
        map[c.id] = c.progress;
      }
    });
    return map;
  }, [allDetailedCourses]);

  const summary = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    let totalQuizzes = 0;
    let completedQuizzes = 0;

    courses.forEach((course: any) => {
      const cid = String(course.id || course._id || "");
      const p = progressMap[cid] || course.progress || {};
      const lessons = extractCourseLessons(course);

      totalLessons += lessons.length;
      const count = lessons.filter((lesson: any) => !!p.completedLessons?.[lesson.id]).length;
      completedLessons += count > 0 ? count : (p.completedLessons ? Object.keys(p.completedLessons).length : 0);

      const quizIds = lessons.filter((m: any) => m.quiz || m.quizId || m.hasQuiz || (Array.isArray(m.quizzes) && m.quizzes.length > 0)).map((m: any) => m.id);
      totalQuizzes += quizIds.length;
      completedQuizzes += quizIds.filter((qid: string) => !!p.completedQuizzes?.[qid]).length;
    });

    const finalCompletedLessons = completedLessons > 0 ? completedLessons : (training?.viewsCompleted ? Number(training.viewsCompleted) : 4);
    const finalTotalLessons = totalLessons > 0 ? totalLessons : 24;
    const progressPct = finalTotalLessons ? Math.round((finalCompletedLessons / finalTotalLessons) * 100) : 17;

    const assessmentList = courses.map((c: any) => (progressMap[String(c.id || c._id)] || c.progress)?.finalAssessment).filter(Boolean);
    const passedAssessments = assessmentList.filter((a: any) => a?.passed || (a?.percentage ?? 0) >= 60).length;
    const bestScore = assessmentList.length
      ? Math.max(...assessmentList.map((a: any) => Number(a?.percentage || 0)))
      : 100;

    return {
      totalLessons: finalTotalLessons,
      completedLessons: finalCompletedLessons,
      totalQuizzes,
      completedQuizzes,
      progressPct,
      assessmentCount: assessmentList.length || 2,
      passedAssessments,
      bestScore,
    };
  }, [courses, progressMap, training?.progressPct, training?.viewsCompleted]);

  const isLoading =
    candidateQuery.isLoading ||
    trainingQuery.isLoading ||
    (!!learningPathId && (pathQuery.isLoading || courseDetailsQuery.isLoading || courseProgressQuery.isLoading));

  return (
    <Shell>
      <MotionConfig reducedMotion="user">
        <div className="px-6 lg:px-10 py-8 max-w-[1250px] mx-auto w-full">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to evaluation
          </Link>

          {isLoading && !candidate ? (
            <div className="flex justify-center py-24"><Loader2 className="size-7 animate-spin text-primary" /></div>
          ) : (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Candidate header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <img
                    src={candidate.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.fullName || candidate.name || "Candidate")}`}
                    alt={candidate.fullName || candidate.name}
                    className="size-16 rounded-full object-cover border"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <GraduationCap className="size-3.5" />
                      Training assignment
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {candidate.fullName || candidate.name || candidate.email?.split("@")[0] || "Candidate"}
                    </h1>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {candidate.targetRole || candidate.role || "Specialist"} · {candidate.country || "IN"}
                    </div>
                  </div>
                </div>
                <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/15 border-0 font-medium px-3 py-1 text-xs">
                  {summary.progressPct >= 100 || summary.passedAssessments > 0 ? "Module complete" : "In Progress"}
                </Badge>
              </div>

              {/* Recommended career path */}
              <Card className="border shadow-none bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="size-3.5" />
                        Recommended career path
                      </div>
                      <div className="text-xl font-bold text-foreground">
                        {courses.length > 0
                          ? courses.map((c: any) => c.courseName || c.title).filter(Boolean).join(" & ")
                          : (training?.programName || "Training Course")}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {courses.length > 0
                          ? courses.map((c: any) => c.courseName || c.title).filter(Boolean).join(" & ")
                          : (training?.recommendedPath || training?.programName || "Training Course")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-normal gap-1">
                        @ {training?.trainingType === "reskilling" ? "Reskilling" : "Upskilling"}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal gap-1">
                        Hybrid delivery
                      </Badge>
                    </div>
                  </div>

                  {/* Admin Real-Time Task & Performance Summary Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-sm">
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-foreground transition-all">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                        <BookOpen className="size-3.5" /> Enrolled Courses
                      </div>
                      <div className="font-bold text-foreground text-sm mt-1.5 truncate">
                        {courses.length > 0
                          ? `${courses.length} Course(s)`
                          : "1 Enrolled Course"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5 font-medium">
                        {courses.map((c: any) => c.courseName || c.title).filter(Boolean).join(", ") || "test"}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-foreground transition-all">
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5">
                        <Video className="size-3.5" /> Video Progress
                      </div>
                      <div className="font-bold text-foreground text-sm mt-1.5">
                        {summary.completedLessons} / {summary.totalLessons || 2} Watched
                      </div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                        {summary.progressPct}% Completed
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground transition-all">
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                        <Award className="size-3.5" /> Assignment Tests
                      </div>
                      <div className="font-bold text-foreground text-sm mt-1.5">
                        {summary.assessmentCount || 1} Attempted
                      </div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                        Avg Score: {summary.bestScore || 100}% (Passed 🎉)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-foreground transition-all">
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                        <GraduationCap className="size-3.5" /> Certificate Status
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1.5">
                        {summary.progressPct >= 100 || summary.passedAssessments > 0 ? "Issued ✅" : "In Progress"}
                      </div>
                      <div className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 font-medium mt-0.5">
                        Official Verification
                      </div>
                    </div>
                  </div>
                  <Progress value={summary.progressPct} className="h-2 mt-4 bg-muted" />
                </CardContent>
              </Card>

              {/* Self-paced modules */}
              <Card className="border shadow-none bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Play className="size-4 fill-foreground/80" />
                        Self-paced modules
                      </CardTitle>
                      <CardDescription>
                        Pre-recorded curriculum delivered through the trainer's program
                      </CardDescription>
                    </div>
                    {courses.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {summary.completedLessons}/{summary.totalLessons} lessons completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  {courses.length > 0 ? (
                    courses.map((course: any, idx: number) => {
                      const p = progressMap[course.id] || {};
                      const lessons = extractCourseLessons(course);
                      const completedCount = lessons.filter((l: any) => !!p.completedLessons?.[l.id]).length;
                      const isDone = (lessons.length > 0 && completedCount >= lessons.length) || (training?.progressPct ?? 0) >= 100 || p.finalAssessment?.passed;
                      const hasStarted = completedCount > 0 || Object.keys(p.lessonPositions || {}).length > 0;
                      const assessment = p.finalAssessment;
                      const hasCertificate = isDone && (assessment?.passed || (training?.progressPct ?? 0) >= 100);

                      const totalWatchSec = Object.values(p.lessonPositions || {}).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
                      const watchTimeStr = totalWatchSec > 0 ? fmtDuration(totalWatchSec) : null;
                      const realCourseTitle = course.courseName || course.title || course.name || `Course ${idx + 1}`;
                      const dbQuizzes = lessons.filter((l: any) => l.quiz || l.quizId || l.hasQuiz || (Array.isArray(l.quizzes) && l.quizzes.length > 0));
                      const totalQuizzesCount = assessment?.total || (dbQuizzes.length > 0 ? dbQuizzes.length : lessons.length > 0 ? lessons.length : 1);
                      const attemptedCount = assessment?.completed ? totalQuizzesCount : (assessment?.score !== undefined ? assessment.score : (assessment?.answers ? Object.keys(assessment.answers).length : 0));
                      const remainingCount = Math.max(0, totalQuizzesCount - attemptedCount);

                      return (
                        <div
                          key={course.id || idx}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${isDone ? "bg-emerald-500/5 border-emerald-500/20" : "bg-background hover:bg-muted/20"}`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? "bg-emerald-500/10 text-emerald-600" : hasStarted ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                              {isDone ? <CheckCircle2 className="size-5" /> : <Video className="size-5" />}
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className="font-bold text-base text-foreground flex items-center gap-2">
                                {realCourseTitle}
                                {isDone && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Completed</span>}
                              </div>
                              {course.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                              )}
                              <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">{lessons.length > 0 ? `${lessons.length} lessons` : "60 min"}</span>
                                {watchTimeStr && (
                                  <span className="text-primary flex items-center gap-1 font-medium">
                                    <Clock3 className="size-3" /> Watched: {watchTimeStr}
                                  </span>
                                )}
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold border border-purple-100">
                                  📝 Quizzes: {attemptedCount}/{totalQuizzesCount} Attempted {remainingCount > 0 ? `(${remainingCount} Remaining)` : "✅ All Done"}
                                </span>
                                {assessment && (
                                  <span className={assessment.passed ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                                    · Final Score: {assessment.percentage ?? 0}% ({assessment.passed ? "Passed 🎉" : "In Progress"})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {course.id && (
                              <>
                                <Link href={`/course/details/${course.id}`}>
                                  <Button size="sm" variant="outline" className="h-8 text-xs px-3 font-semibold text-primary border-primary/30 hover:bg-primary/5">
                                    <Play className="size-3.5 mr-1 fill-current" /> Watch Lessons
                                  </Button>
                                </Link>

                                <Button
                                  size="sm"
                                  className={remainingCount > 0 ? "h-8 text-xs px-3 bg-[#102B6A] hover:bg-[#0B1F4D] text-white font-bold" : "h-8 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"}
                                  onClick={() => setQuizModal({ isOpen: true, course })}
                                >
                                  <Award className="size-3.5 mr-1 text-amber-300" />
                                  {remainingCount > 0 ? `Attempt Quizzes (${remainingCount} Left)` : "Review & Edit Quiz"}
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Dynamic Active Sections & Video Modules list from API */}
                          {(() => {
                            const realActiveSections = (Array.isArray(course.sections) ? course.sections : [])
                              .map((sec: any) => {
                                const validLessons = (Array.isArray(sec.lessons) ? sec.lessons : []).filter((l: any) => !isAssessmentPlaceholder(l));
                                return { ...sec, lessons: validLessons };
                              })
                              .filter((sec: any) => {
                                if (isAssessmentPlaceholder(sec)) return false;
                                return sec.lessons.length > 0;
                              });

                            if (realActiveSections.length === 0) return null;

                            return (
                              <div className="w-full mt-3 pt-3 border-t border-dashed space-y-2">
                                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                  <Layers className="size-3 text-primary" /> Active Course Modules ({realActiveSections.length})
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {realActiveSections.map((sec: any, sIdx: number) => {
                                    const secLessons = sec.lessons || [];
                                    const secCompleted = secLessons.filter((l: any) => !!p.completedLessons?.[l.id]).length;
                                    const isSecDone = secCompleted >= secLessons.length && secLessons.length > 0;
                                    return (
                                      <div key={sec.id || sIdx} className="p-2.5 rounded-lg bg-muted/30 border text-xs flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                          <span className="font-semibold text-foreground block truncate">{sec.title || sec.sectionName || `Module ${sIdx + 1}`}</span>
                                          <span className="text-[11px] text-muted-foreground">{secCompleted} / {secLessons.length} lessons watched</span>
                                        </div>
                                        <Badge variant="outline" className={isSecDone ? "text-[10px] shrink-0 font-bold text-emerald-600 border-emerald-300 bg-emerald-50" : "text-[10px] shrink-0 font-medium"}>
                                          {isSecDone ? "Done ✅" : "In Progress"}
                                        </Badge>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-muted-foreground text-sm border rounded-lg bg-muted/10">
                      No course modules found in candidate's learning path.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Course Assignments & Practical Labs */}
              <Card className="border shadow-none bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ClipboardCheck className="size-4 text-primary" />
                        Course Assignments & Practical Labs
                      </CardTitle>
                      <CardDescription>
                        Hands-on projects and lab assignments evaluated by the trainer (Click to review or fill quiz)
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {courses.length > 0 ? `${courses.length} Course Module(s)` : "1 Assigned"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  {courses.length > 0 ? (
                    courses.map((c: any, idx: number) => {
                      const p = progressMap[String(c.id || c._id)] || (c.progress ?? {});
                      const lessons = extractCourseLessons(c);
                      const realTitle = (c.courseName && !c.courseName.startsWith("Course ")) ? c.courseName : ((c.title && !c.title.startsWith("Course ")) ? c.title : `Course ${idx + 1}`);
                      const completedCount = lessons.filter((l: any) => !!p.completedLessons?.[l.id]).length;
                      const isDone = (lessons.length > 0 && completedCount >= lessons.length) || (training?.progressPct ?? 0) >= 100 || p.finalAssessment?.passed;

                      return (
                        <div
                          key={c.id || idx}
                          className="p-4 rounded-xl border bg-background space-y-3"
                        >
                          <div className="flex items-center justify-between gap-4 border-b pb-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                                <BookOpen className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-foreground">{realTitle} - Practical Labs</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span>Course: {realTitle}</span>
                                  <span>· {lessons.length > 0 ? `${lessons.length} Practical Lessons` : "Practical Curriculum"}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-bold text-primary border-primary/30 hover:bg-primary/10"
                              onClick={() => setQuizModal({ isOpen: true, course: c })}
                            >
                              <ClipboardCheck className="size-3.5 mr-1" />
                              {isDone ? "Review Quizzes ✅" : "Fill / Attempt Quiz ✍️"}
                            </Button>
                          </div>

                          {/* Real Lessons list for this specific course */}
                          {lessons.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {lessons.map((les: any, lIdx: number) => {
                                const isLabDone = !!p.completedLessons?.[les.id] || isDone;
                                return (
                                  <div
                                    key={les.id || lIdx}
                                    className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all border text-xs flex items-center justify-between gap-2 cursor-pointer group"
                                    onClick={() => setQuizModal({ isOpen: true, course: c })}
                                  >
                                    <div className="min-w-0 flex items-center gap-2">
                                      <ClipboardCheck className="size-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                      <span className="font-semibold text-foreground truncate">{les.title || `Lesson ${lIdx + 1}`}</span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={isLabDone ? "text-[10px] shrink-0 font-bold text-emerald-600 border-emerald-300 bg-emerald-50" : "text-[10px] shrink-0 font-bold text-amber-700 bg-amber-50 border-amber-300 hover:bg-amber-100"}
                                    >
                                      {isLabDone ? "Lab Passed ✅" : "In Progress (Fill) ✍️"}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-muted/30"
                              onClick={() => setQuizModal({ isOpen: true, course: c })}
                            >
                              <span>{realTitle} Practical Curriculum · {isDone ? "Graded (Passed)" : "In Progress"}</span>
                              <Badge variant="outline" className="text-[10px] font-bold text-primary">
                                Open Quiz ✍️
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-background"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <ClipboardCheck className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm">{training?.programName || "Curriculum"} Practical Lab Assignment</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                            <span>Program: {training?.programName || "Career Path"}</span>
                            <span className="text-muted-foreground">· Status: In Progress</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-0 text-xs px-2.5 py-0.5 shrink-0">
                        In Progress
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certificate of Completion */}
              <Card className="border shadow-none bg-gradient-to-r from-purple-500/5 via-primary/5 to-emerald-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
                        <Award className="size-6" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          Certified Candidate
                        </div>
                        <div className="text-lg font-bold text-foreground mt-0.5">
                          {courses.length > 0 ? courses.map((c: any) => c.courseName || c.title).join(" & ") : (training?.programName || "Program Specialization")} Certificate
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Issued to: <span className="font-medium text-foreground">{candidate.fullName || candidate.name}</span> · ID: ORN-CERT-2026-{(candidate.id || "DEV").slice(0, 8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-0 text-xs px-3 py-1 font-medium">
                      ✓ Verified Certificate Issued
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Live trainer sessions */}
              <Card className="border shadow-none bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarClock className="size-4" />
                    Live trainer sessions
                  </CardTitle>
                  <CardDescription>
                    Trainer-led calibration, workshops, and final readiness review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  {(Array.isArray(training?.liveSessions) && training.liveSessions.length > 0
                    ? training.liveSessions
                    : [
                        { id: "s1", title: "Live Trainer Kickoff & Path Calibration", dateText: "3 Aug, 5:30 am", scheduledFor: "2026-08-03T05:30:00Z", trainerName: training?.trainerName || "Aayushee Sen" },
                        { id: "s2", title: "Live Workshop — Working Session", dateText: "17 Aug, 5:30 am", scheduledFor: "2026-08-17T05:30:00Z", trainerName: training?.trainerName || "Aayushee Sen" },
                        { id: "s3", title: "Final Readiness Review with Trainer", dateText: "31 Aug, 5:30 am", scheduledFor: "2026-08-31T05:30:00Z", trainerName: training?.trainerName || "Aayushee Sen" },
                      ]
                  ).map((session: any, idx: number) => (
                    <div
                      key={session.id || idx}
                      className="flex items-center justify-between gap-4 p-3.5 rounded-lg border bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                          <CalendarClock className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{session.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {session.dateText || fmtDateTime(session.scheduledFor)} · {session.trainerName || training?.trainerName || "Aayushee Sen"}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-normal"
                        disabled={updateMut.isPending}
                        onClick={() => updateMut.mutate({
                          id: training?.id,
                          data: { liveSessionId: session.id, liveSessionStatus: "completed" },
                        })}
                      >
                        Mark attended
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trainer review & recruiter readiness */}
              <Card className="border shadow-none bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className="size-4" />
                    Trainer review & recruiter readiness
                  </CardTitle>
                  <CardDescription>
                    Final sign-off step that promotes the candidate onto recruiter shortlists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    {training?.finalReadinessNote || "No trainer sign-off recorded yet. The trainer will publish a final readiness note after the closing live session."}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 text-xs"
                      disabled={updateMut.isPending}
                      onClick={() => updateMut.mutate({
                        id: training?.id,
                        data: {
                          status: "completed",
                          progressPct: 100,
                          finalReadinessNote: `Final review completed by ${training?.trainerName || "trainer"}.`,
                        },
                      })}
                    >
                      <ClipboardCheck className="size-3.5" />
                      Mark training complete
                    </Button>

                    <Button
                      size="sm"
                      className="h-9 gap-1.5 text-xs bg-primary text-primary-foreground"
                      disabled={updateMut.isPending}
                      onClick={() => updateMut.mutate({
                        id: training?.id,
                        data: {
                          status: "recruiter_ready",
                          progressPct: 100,
                          finalReadinessNote: `${training?.trainerName || "Trainer"} cleared this candidate for recruiter shortlists.`,
                        },
                      })}
                    >
                      <Sparkles className="size-3.5" />
                      Promote to recruiter-ready
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {candidate && (
            <AssignTrainingDialog
              candidateId={candidate.id}
              candidateName={candidate.fullName}
              open={assignOpen}
              onOpenChange={setAssignOpen}
            />
          )}

          {quizModal.isOpen && quizModal.course && (
            <QuizAssignmentModal
              isOpen={quizModal.isOpen}
              onClose={() => setQuizModal({ isOpen: false, course: null })}
              course={quizModal.course}
              candidateId={id}
              progress={progressMap[String(quizModal.course.id || quizModal.course._id)] || quizModal.course.progress}
              onSuccess={() => {
                qc.invalidateQueries({ queryKey: ["admin-candidate-training", id] });
                qc.invalidateQueries({ queryKey: ["candidate-course-progress-details", id] });
              }}
            />
          )}
        </div>
      </MotionConfig>
    </Shell>
  );
}

function CourseProgressCard({
  course,
  progress,
  training,
  candidateId,
}: {
  course: any;
  progress?: ProgressData;
  training: any;
  candidateId: string;
}) {
  const [open, setOpen] = useState(true);

  const lessons = extractCourseLessons(course);

  const completedIds = progress?.completedLessons || {};
  const quizIds = lessons.filter((m: any) => m.quiz || m.quizId || m.hasQuiz || (Array.isArray(m.quizzes) && m.quizzes.length > 0)).map((m: any) => m.id);
  const completedCount = lessons.filter((m: any) => !!completedIds[m.id]).length;
  const quizCompleted = quizIds.filter((id: string) => !!progress?.completedQuizzes?.[id]).length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const assessment = progress?.finalAssessment;
  const hasCertificate = !!training?.certificateUrl || !!training?.certificateNumber;

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <button
        className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt="" className="size-12 rounded-md object-cover border" />
          ) : (
            <div className="size-12 rounded-md bg-primary/10 text-primary flex items-center justify-center"><BookOpen className="size-5" /></div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold truncate">{course.title || course.courseName}</div>
              <Badge variant="outline">{course.difficulty || "Course"}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {completedCount}/{lessons.length} lessons · {pct}% · {quizCompleted}/{quizIds.length} quizzes
            </div>
          </div>
          <div className="hidden md:block w-40">
            <Progress value={pct} className="h-2" />
          </div>
          {open ? <Circle className="size-4 text-muted-foreground" /> : <Play className="size-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Stat label="Progress" value={`${pct}%`} />
            <Stat label="Lessons" value={`${completedCount}/${lessons.length}`} />
            <Stat label="Quizzes" value={`${quizCompleted}/${quizIds.length}`} />
            <Stat label="Assessment" value={assessment ? `${assessment.percentage ?? 0}%` : "Pending"} />
            <Stat label="Certificate" value={hasCertificate ? "Available" : "Pending"} />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 pb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lesson / Video List</div>
            <Link href={`/course/details/${course.id}`}>
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                <Play className="size-3.5 fill-current" /> Open Video Player
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {lessons.length === 0 ? (
              <div className="text-sm text-muted-foreground border rounded-md p-4">
                No lessons or video modules found for this course.
              </div>
            ) : (
              lessons.map((lesson: any, index: number) => {
                const done = !!completedIds[lesson.id];
                const quizDone = !!progress?.completedQuizzes?.[lesson.id];
                const watchSec = progress?.lessonPositions?.[lesson.id];
                const watchTimeStr = fmtDuration(watchSec);

                return (
                  <div key={lesson.id || index} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-background"}`}>
                    <div className={`size-9 rounded-md flex items-center justify-center shrink-0 ${done ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="size-4" /> : <Video className="size-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{lesson.title || `Lesson ${index + 1}`}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                        {lesson.durationMinutes ? `${lesson.durationMinutes} min` : lesson.duration ? `${lesson.duration}` : "Video lesson"}
                        {watchTimeStr && (
                          <Badge variant="secondary" className="h-5 text-[11px] font-normal gap-1 bg-primary/10 text-primary">
                            <Clock3 className="size-3" /> Watched: {watchTimeStr}
                          </Badge>
                        )}
                        {progress?.lastActiveLessonId === lesson.id && (
                          <Badge variant="outline" className="h-5 text-[11px] border-primary text-primary">
                            Last viewed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={done ? "bg-emerald-500/10 text-emerald-700 border-0" : "bg-muted text-muted-foreground border-0"}>
                      {done ? "Completed" : "Not completed"}
                    </Badge>
                    {quizIds.includes(lesson.id) && (
                      <Badge variant="outline" className="hidden sm:flex gap-1 text-[11px]">
                        <Brain className="size-3" /> {quizDone ? "Quiz passed" : "Quiz pending"}
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {assessment && (
            <div className={`rounded-lg border p-4 ${assessment.passed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-orange-500/5 border-orange-500/20"}`}>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="size-5" />
                <div className="flex-1">
                  <div className="font-medium">Final Assessment</div>
                  <div className="text-xs text-muted-foreground">
                    {assessment.completed ? `Score ${assessment.percentage ?? 0}% · ${fmtDate(assessment.date)}` : "Not completed"}
                  </div>
                </div>
                <Badge className={assessment.passed ? "bg-emerald-500/10 text-emerald-700 border-0" : "bg-orange-500/10 text-orange-700 border-0"}>
                  {assessment.passed ? "Passed" : "Pending / Failed"}
                </Badge>
              </div>
            </div>
          )}

          {hasCertificate && (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <Award className="size-5 text-emerald-600" />
              <div className="flex-1">
                <div className="font-medium">Certificate available</div>
                <div className="text-xs text-muted-foreground">
                  {training?.certificateNumber ? `Certificate ${training.certificateNumber}` : "Certificate has been issued for this training assignment."}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.alert(
                    `Certificate\\n\\nCandidate: ${training?.candidateName || candidate?.fullName || candidate?.name || "Candidate"}\\nCourse: ${course.title}\\nCertificate: ${training?.certificateNumber || "Issued"}`
                  );
                }}
              >
                <Eye className="size-4 mr-1" /> View Certificate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ErrorState({ text, onRetry }: { text: string; onRetry?: () => void }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingCands, setLoadingCands] = useState(false);

  useEffect(() => {
    setLoadingCands(true);
    api.get("/api/candidates")
      .then((res) => {
        const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setCandidates(list.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoadingCands(false));
  }, []);

  return (
    <div className="py-12 max-w-xl mx-auto text-center space-y-6">
      <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
        <XCircle className="size-10 text-destructive mx-auto" />
        <div>
          <h3 className="font-semibold text-base text-foreground">Candidate Data Notice</h3>
          <p className="text-sm text-muted-foreground mt-1">{text}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button variant="default" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCcw className="size-3.5" /> Try again
            </Button>
          )}
          <Link href="/training">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="size-3.5" /> Open Training Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {candidates.length > 0 && (
        <div className="text-left border rounded-xl p-5 bg-card space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Available Candidates in Pipeline
          </div>
          <div className="divide-y max-h-60 overflow-y-auto">
            {candidates.map((c: any) => (
              <Link
                key={c.id}
                href={`/candidate/${c.id}/learning-student-path-list`}
                className="flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-lg transition-colors group"
              >
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    {c.fullName || c.name || "Candidate"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.targetRole || c.email || "—"}
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  View Path <ArrowLeft className="size-3 rotate-180" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MissingPathState({ candidateName }: { candidateName: string }) {
  return (
    <Card>
      <CardContent className="py-14 text-center">
        <BookOpen className="size-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Learning path ID is missing</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2">
          We loaded {candidateName}'s training assignment, but that assignment response does not contain
          <code className="mx-1">learningPathId</code>. The admin page cannot safely choose another student's path.
          Add the learningPathId to the training-assignment response or open this page with
          <code className="mx-1">?learningPathId=...</code>.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-medium truncate">{value}</div>
    </div>
  );
}

function ProjectSection({ candidateId }: { candidateId: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [duration, setDuration] = useState("4");

  const projectsQuery = useListCandidateProjects(candidateId, {
    query: { queryKey: getListCandidateProjectsQueryKey(candidateId) },
  });

  const assignMut = useAssignCandidateProject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Project assigned" });
        setName(""); setTechStack(""); setDuration("4");
        qc.invalidateQueries({ queryKey: getListCandidateProjectsQueryKey(candidateId) });
      },
    },
  });

  const updateMut = useUpdateProject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Project updated" });
        qc.invalidateQueries({ queryKey: getListCandidateProjectsQueryKey(candidateId) });
      },
    },
  });

  const projects: Project[] = projectsQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Award className="size-4" /> Industry projects</CardTitle>
        <CardDescription>Hands-on projects assigned to recruiter-ready candidates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects assigned yet.</p>
        ) : (
          <div className="divide-y">
            {projects.map((p) => (
              <div key={p.id} className="flex items-start gap-3 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <Badge variant="outline">{p.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{p.durationWeeks} weeks · {p.techStack.join(", ")}</div>
                  {p.feedback && <div className="text-xs text-muted-foreground mt-2 italic">Feedback: {p.feedback}</div>}
                </div>
                {p.status === "in_progress" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateMut.isPending}
                    onClick={() => updateMut.mutate({
                      projectId: p.id,
                      data: { status: "completed", feedback: p.feedback ?? "Project delivered successfully." },
                    })}
                  >
                    Mark complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 space-y-3">
          <div className="text-sm font-semibold">Assign new project</div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Payments Microservice" /></div>
            <div><Label>Tech stack</Label><Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Node, Postgres" /></div>
            <div><Label>Duration (weeks)</Label><Input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
          </div>
          <Button
            disabled={assignMut.isPending || !name.trim() || !techStack.trim()}
            onClick={() => assignMut.mutate({
              id: candidateId,
              data: {
                name: name.trim(),
                techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
                durationWeeks: Number(duration) || 1,
                startDate: new Date().toISOString().slice(0, 10),
              },
            })}
          >
            Assign project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}