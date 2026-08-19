// TrainingDashboard.tsx - Fixed infinite loop with proper memoization

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useListTrainingAssignments,
  customFetch,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  CalendarClock,
  ArrowRight,
  Award,
  RefreshCcw,
  Compass,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Play,
  Circle,
  ClipboardCheck,
  Download,
  Star,
  Trophy,
  Eye,
  Check,
  Printer,
  Share2,
  Crown,
  Brain,
  X,
  FileCheck,
  BarChart3,
  BadgeCheck,
  Video,
  PieChart as PieChartIcon,
  PlayCircle,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Types
interface FinalAssessment {
  date: string;
  score: number;
  total: number;
  passed: boolean;
  answers: Record<string, number>;
  completed: boolean;
  percentage: number;
}

interface CourseProgress {
  completedLessons: Record<string, boolean>;
  completedQuizzes: Record<string, boolean>;
  lessonPositions: Record<string, number>;
  lastActiveLessonId: string;
  lastContentMode: string;
  finalAssessment: FinalAssessment;
}

interface UserStat {
  id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  completedViews: number;
  totalLessons: number;
  totalScore: number;
  hasCertificate: boolean;
  certificateDate?: string;
  certificateId?: string;
  lastActive: string;
  // Optional fields returned by different versions of the course-progress API
  candidateId?: string;
  courseId?: string;
  candidateName?: string;
  candidateCountry?: string;
  programName?: string;
  trainerName?: string;
  status?: string;
  trainingType?: string;
  progressPct?: number;
  modules?: any[];
  liveSessions?: any[];
  progress?: CourseProgress;
}

const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
  not_started: { label: "Not started", tone: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  module_completed: { label: "Module complete", tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  live_session_pending: { label: "Live session due", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  assessment_pending: { label: "Assessment pending", tone: "bg-orange-500/10 text-orange-700 dark:text-orange-300" },
  completed: { label: "Completed", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  recruiter_ready: { label: "Recruiter-ready", tone: "bg-[#1652A0]/10 text-[#1652A0] dark:text-[#3B82F6]" },
};

const COLORS = ['#1652A0', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#1E3A5F'];

function statusBadge(s: string) {
  const m = STATUS_LABELS[s] ?? { label: s, tone: "bg-muted text-muted-foreground" };
  return <Badge className={`${m.tone} border-0 font-medium`}>{m.label}</Badge>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Certificate Modal
function CertificateModal({
  open,
  onOpenChange,
  candidateName,
  programName,
  completionDate,
  trainerName,
  certificateNumber,
  score,
  finalAssessment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  programName: string;
  completionDate: string;
  trainerName: string;
  certificateNumber: string;
  score?: number;
  finalAssessment?: FinalAssessment;
}) {
  const handlePrint = () => window.print();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            Certificate of Completion
          </DialogTitle>
          <DialogDescription>
            Official recognition of training completion
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 bg-gradient-to-br from-slate-50 to-white border rounded-xl shadow-lg">
          <div className="border-4 border-primary/20 rounded-lg p-8 relative">
            <div className="absolute top-4 left-4 text-primary/10">
              <Crown className="size-16" />
            </div>
            <div className="absolute bottom-4 right-4 text-primary/10">
              <Crown className="size-16" />
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="size-10 text-primary" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-primary mb-2">Certificate of Completion</h1>
              <p className="text-muted-foreground mb-6">This certificate is awarded to</p>

              <h2 className="text-4xl font-bold mb-4 text-foreground">{candidateName}</h2>

              <p className="text-muted-foreground mb-2">for successfully completing</p>

              <h3 className="text-2xl font-semibold mb-4">{programName}</h3>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Completion Date</div>
                  <div className="font-medium">{completionDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Trainer</div>
                  <div className="font-medium">{trainerName}</div>
                </div>
              </div>

              {finalAssessment && finalAssessment.completed && (
                <div className="mb-4 flex items-center justify-center gap-4">
                  <Badge variant="outline" className="gap-1 text-lg px-4 py-2">
                    <Brain className="size-4" />
                    Final Assessment: {finalAssessment.percentage}%
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-lg px-4 py-2 bg-emerald-50">
                    <Check className="size-4 text-emerald-600" />
                    Passed
                  </Badge>
                </div>
              )}

              {score !== undefined && score > 0 && (
                <div className="mb-4">
                  <Badge variant="outline" className="gap-1 text-lg px-4 py-2">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    Score: {score}%
                  </Badge>
                </div>
              )}

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  Certificate Number: {certificateNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Issued by ORN-AI Training Platform
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="size-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                  <Check className="size-8 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="size-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TrainingDashboard() {
  const [, navigate] = useLocation();
  const reduce = useReducedMotion();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<string | null>(null);
  const [selectedUserCert, setSelectedUserCert] = useState<{
    studentName: string;
    courseTitle: string;
    completionDate: string;
    certificateId: string;
  } | null>(null);

  const { toast } = useToast();

  // ✅ Single source of truth for the page's course-progress data.
  // The API response is normalized so the UI works with either:
  //   { success: true, data: [...] }
  // or a response where data is wrapped in users/items/results.
  const userStatsQuery = useQuery({
    queryKey: ["admin-course-progress"],
    queryFn: async () => {
      const res = await customFetch<{
        success: boolean;
        data?: UserStat[] | { users?: UserStat[]; items?: UserStat[]; results?: UserStat[] };
      }>("/api/admin/course-progress");

      const raw = res?.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.users)) return raw.users;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.results)) return raw.results;
      return [];
    },
    staleTime: 30_000,
  });

  // The entire page is driven by the course-progress API.
  const userStats = userStatsQuery.data ?? [];

  // Course-progress remains the source of truth for the dashboard summary.
  // Assignment metadata is loaded only to enrich the "View assignment" details.
  const assignmentsQuery = useListTrainingAssignments({
    ...(statusFilter !== "all"
      ? { status: statusFilter as "not_started" }
      : {}),
    ...(typeFilter !== "all"
      ? { trainingType: typeFilter as "upskilling" | "reskilling" }
      : {}),
  });

  const assignmentMetadata = assignmentsQuery.data ?? [];

  const progressAssignments = useMemo(() => {
    return userStats.map((stat: UserStat, index: number) => {
      const completedViews = Number(stat.completedViews ?? 0);
      const totalLessons = Number(stat.totalLessons ?? 0);
      const progressPct = Number(
        stat.progressPct ??
        (totalLessons > 0 ? Math.round((completedViews / totalLessons) * 100) : 0)
      );

      const metadata = assignmentMetadata.find((a: any) =>
        (stat.courseId && (a.id === stat.courseId || a.courseId === stat.courseId)) ||
        (stat.candidateId && a.candidateId === stat.candidateId &&
          (a.courseTitle === stat.courseTitle || a.programName === stat.programName)) ||
        (a.candidateId === stat.id &&
          (a.courseTitle === stat.courseTitle || a.programName === stat.programName))
      ) || {};

      return {
        ...metadata,
        id: stat.id || stat.courseId || metadata.id || `${stat.userEmail}-${stat.courseTitle}-${index}`,
        courseId: stat.courseId || metadata.courseId || metadata.id || (stat.id !== stat.candidateId ? stat.id : undefined),
        candidateId: stat.candidateId || metadata.candidateId || stat.id || stat.userEmail || `student-${index}`,
        candidateName: stat.candidateName || stat.userName || metadata.candidateName || stat.userEmail || "Student",
        candidateCountry: stat.candidateCountry || metadata.candidateCountry || "",
        candidateAvatarUrl: stat.candidateAvatarUrl || metadata.candidateAvatarUrl,
        programName: stat.programName || metadata.programName || stat.courseTitle || "Course",
        courseTitle: stat.courseTitle || metadata.courseTitle || stat.programName || "Course",
        trainerName: stat.trainerName || metadata.trainerName || "Trainer",
        trainingType: stat.trainingType || metadata.trainingType || "upskilling",
        status: stat.status || metadata.status || (progressPct >= 100 ? "completed" : progressPct > 0 ? "in_progress" : "not_started"),
        progressPct,
        modules: stat.modules?.length ? stat.modules : (metadata.modules || []),
        liveSessions: stat.liveSessions?.length ? stat.liveSessions : (metadata.liveSessions || []),
        certificateUrl: stat.hasCertificate ? true : metadata.certificateUrl,
        certificateNumber: stat.certificateId || metadata.certificateNumber,
        completedAt: stat.certificateDate || metadata.completedAt,
        progress: stat.progress,
        __completedViews: completedViews,
        __totalLessons: totalLessons || Number(metadata.modules?.length || 0),
        __totalScore: typeof stat.totalScore === "number" ? stat.totalScore : parseFloat(String(stat.totalScore || 0).replace("%", "")) || progressPct || 0,
        __hasCertificate: !!stat.hasCertificate || !!metadata.certificateUrl || !!metadata.certificateNumber,
        __lastActive: stat.lastActive,
        __userEmail: stat.userEmail,
      };
    });

    // Deduplicate by unique user/email so 1 user has 1 combined row
    const userMap = new Map<string, any>();
    rawItems.forEach((item: any) => {
      const userKey = item.__userEmail || item.candidateId || item.userId || item.id;
      if (!userMap.has(userKey)) {
        userMap.set(userKey, { ...item });
      } else {
        const existing = userMap.get(userKey);
        existing.__completedViews = (existing.__completedViews || 0) + (item.__completedViews || 0);
        existing.__totalLessons = (existing.__totalLessons || 0) + (item.__totalLessons || 0);
        existing.__totalScore = Math.max(existing.__totalScore || 0, item.__totalScore || 0);
        if (item.courseTitle && existing.courseTitle && !existing.courseTitle.includes(item.courseTitle)) {
          existing.courseTitle = `${existing.courseTitle} & ${item.courseTitle}`;
        }
        if (item.__hasCertificate) existing.__hasCertificate = true;
      }
    });

    return Array.from(userMap.values());
  }, [userStats, assignmentMetadata]);

  const filteredAssignments = useMemo(() => {
    return progressAssignments.filter((assignment: any) => {
      const statusMatch = statusFilter === "all" || assignment.status === statusFilter;
      const typeMatch = typeFilter === "all" || assignment.trainingType === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [progressAssignments, statusFilter, typeFilter]);

  const isCertificateEligible = useCallback((assignment: any, progress?: CourseProgress) => {
    if (!progress) return false;

    const allModulesComplete = assignment.modules?.length
      ? assignment.modules.every((m: any) => progress.completedLessons?.[m.id] || m.isCompleted)
      : Number(assignment.__completedViews ?? 0) >= Number(assignment.__totalLessons ?? 0);

    const allQuizzesComplete = assignment.modules?.length
      ? assignment.modules.every((m: any) => progress.completedQuizzes?.[m.id] || m.quizCompleted)
      : true;

    const assessmentPassed = progress.finalAssessment?.passed ?? false;
    const allSessionsComplete = assignment.liveSessions?.length
      ? assignment.liveSessions.every((s: any) => s.status === "completed")
      : true;

    return allModulesComplete && allQuizzesComplete && assessmentPassed && allSessionsComplete;
  }, []);

  const assignmentsWithProgress = useMemo(() => {
    return filteredAssignments.map((assignment: any) => {
      const progress = assignment.progress;
      const eligible = isCertificateEligible(assignment, progress);
      const totalModules = Number(assignment.modules?.length || assignment.__totalLessons || 0);
      const completedFromAPI = progress
        ? Object.keys(progress.completedLessons || {}).filter(key => progress.completedLessons[key]).length
        : Number(assignment.__completedViews ?? 0);

      return {
        ...assignment,
        progress,
        isCertificateEligible: eligible,
        hasCertificate: !!assignment.certificateUrl || !!assignment.certificateNumber || assignment.__hasCertificate,
        completedModulesCount: completedFromAPI,
        totalModulesCount: totalModules,
      };
    });
  }, [filteredAssignments, isCertificateEligible]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    progressAssignments.forEach((a: any) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status]?.label ?? status,
      value: count,
    }));
  }, [progressAssignments]);

  const trainerChartData = useMemo(() => {
    const map: Record<string, { name: string; Active: number; Completed: number }> = {};
    progressAssignments.forEach((a: any) => {
      const name = a.trainerName || "Trainer";
      if (!map[name]) map[name] = { name, Active: 0, Completed: 0 };
      if (a.status === "completed" || a.status === "recruiter_ready") map[name].Completed += 1;
      else map[name].Active += 1;
    });
    return Object.values(map);
  }, [progressAssignments]);

  const userStatsChartData = useMemo(() => {
    return userStats.map((stat: UserStat) => ({
      name: stat.userName || stat.userEmail || "Unknown",
      views: Number(stat.completedViews ?? 0),
      total: Number(stat.totalLessons ?? 0),
      score: Number(stat.totalScore ?? 0),
      hasCertificate: stat.hasCertificate,
      course: stat.courseTitle,
    }));
  }, [userStats]);

  const certificatePieData = useMemo(() => {
    const certified = userStats.filter((s: UserStat) => s.hasCertificate).length;
    return [
      { name: "Certified", value: certified },
      { name: "Pending", value: Math.max(0, userStats.length - certified) },
    ];
  }, [userStats]);

  const certificateEligibleCount = assignmentsWithProgress.filter((a: any) => a.isCertificateEligible).length;
  const certificateIssuedCount = assignmentsWithProgress.filter((a: any) => a.hasCertificate).length;
  const totalModules = progressAssignments.reduce((acc: number, a: any) => acc + Number(a.__totalLessons || a.modules?.length || 0), 0);
  const completedModules = progressAssignments.reduce((acc: number, a: any) => acc + Number(a.__completedViews || 0), 0);
  const overallCompletion = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const avgProgressPct = progressAssignments.length > 0
    ? Math.round(progressAssignments.reduce((sum: number, a: any) => sum + Number(a.progressPct || 0), 0) / progressAssignments.length)
    : 0;
  const completedCount = progressAssignments.filter((a: any) => a.status === "completed" || a.status === "recruiter_ready" || Number(a.progressPct) >= 100).length;
  const totalInTraining = progressAssignments.filter((a: any) => !["completed", "recruiter_ready"].includes(a.status)).length;
  const upskillingCount = progressAssignments.filter((a: any) => a.trainingType === "upskilling").length;
  const reskillingCount = progressAssignments.filter((a: any) => a.trainingType === "reskilling").length;
  const pendingLiveSessions = progressAssignments.reduce((sum: number, a: any) => sum + (a.liveSessions || []).filter((s: any) => s.status === "scheduled" || s.status === "pending").length, 0);
  const recruiterReadyCount = progressAssignments.filter((a: any) => a.status === "recruiter_ready").length;

  const upcomingLiveSessions = progressAssignments
    .flatMap((a: any) => (a.liveSessions || [])
      .filter((s: any) => s.status === "scheduled")
      .map((s: any) => ({
        assignmentId: a.id,
        scheduledFor: s.scheduledFor,
        sessionTitle: s.title || s.sessionTitle || "Live Session",
        candidateName: a.candidateName,
        trainerName: s.trainerName || a.trainerName || "Trainer",
      })))
    .slice(0, 10);

  const isLoading = userStatsQuery.isLoading;

  const dash = {
    totalInTraining,
    upskillingCount,
    reskillingCount,
    pendingLiveSessions,
    avgProgressPct,
    completedCount,
    recruiterReadyCount,
    upcomingLiveSessions,
  };

  const motionInitial = reduce ? false : { opacity: 0, y: 8 };
  const motionAnimate = reduce ? undefined : { opacity: 1, y: 0 };

  // ✅ Handle certificate generation with stable toast
  const handleGenerateCertificate = useCallback((candidateName: string) => {
    toast({
      title: "Certificate Generated!",
      description: `Certificate for ${candidateName} has been generated.`,
    });
  }, [toast]);

  // ✅ Handle select candidate
  const handleSelectCandidate = useCallback((candidateId: string) => {
    setSelectedCandidate(prev => prev === candidateId ? null : candidateId);
  }, []);

  return (
    <Shell>
      <MotionConfig reducedMotion="user">
        <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={motionInitial}
            animate={motionAnimate}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Sparkles className="size-3.5" />
              <span>Career Transformation Engine</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Training Assignments
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              ORN-AI's hybrid upskilling &amp; reskilling pipeline — tracking every
              candidate from CV assessment through live trainer review to
              recruiter-ready status with certificate management.
            </p>
          </motion.div>

          {/* KPI cards */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : userStatsQuery.isError ? (
            <Card className="p-8 text-center border-destructive/30 bg-destructive/5">
              <p className="text-sm font-medium text-destructive mb-3">
                We couldn't load course progress.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => userStatsQuery.refetch()}
                data-testid="button-retry-course-progress"
              >
                Try again
              </Button>
            </Card>
          ) : dash ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                <KpiCard
                  icon={<GraduationCap className="size-4" />}
                  label="In active training"
                  value={dash.totalInTraining}
                  hint={`${dash.upskillingCount} upskilling · ${dash.reskillingCount} reskilling`}
                />
                <KpiCard
                  icon={<CalendarClock className="size-4" />}
                  label="Pending live sessions"
                  value={dash.pendingLiveSessions}
                  hint="Trainer-led, scheduled"
                />
                <KpiCard
                  icon={<TrendingUp className="size-4" />}
                  label="Avg. progress"
                  value={`${dash.avgProgressPct}%`}
                  hint="Across all assignments"
                />
                <KpiCard
                  icon={<Award className="size-4" />}
                  label="Completed"
                  value={dash.completedCount}
                  hint="Training completed"
                />
                <KpiCard
                  icon={<Crown className="size-4" />}
                  label="Certificate Eligible"
                  value={certificateEligibleCount}
                  hint="Ready for certification"
                  highlight
                />
                <KpiCard
                  icon={<BadgeCheck className="size-4" />}
                  label="Certificates Issued"
                  value={certificateIssuedCount}
                  hint="Official certifications"
                />
              </div>

              {/* Overall Progress */}
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Overall Training Progress
                      </div>
                      <div className="text-2xl font-bold">{overallCompletion}%</div>
                      <div className="text-xs text-muted-foreground">
                        {completedModules} of {totalModules} modules completed
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-md">
                      <Progress value={overallCompletion} className="h-3" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Trophy className="size-3" />
                        {dash.recruiterReadyCount} recruiter-ready
                      </Badge>
                      <Badge variant="outline" className="gap-1 bg-emerald-50 border-emerald-300">
                        <BadgeCheck className="size-3 text-emerald-600" />
                        {certificateIssuedCount} certified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pipeline status</CardTitle>
                    <CardDescription>
                      Where candidates sit across the transformation flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={statusChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          interval={0}
                          angle={-12}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={!reduce}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Trainer allocation</CardTitle>
                    <CardDescription>
                      Active vs. completed assignments per trainer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={trainerChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                          }}
                        />
                        <Bar
                          dataKey="Active"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={!reduce}
                        />
                        <Bar
                          dataKey="Completed"
                          fill="hsl(var(--muted-foreground))"
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={!reduce}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Certificate Status Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Certificate Status</CardTitle>
                    <CardDescription>
                      Issued vs Pending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={certificatePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          isAnimationActive={!reduce}
                        >
                          {certificatePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* User Stats Section */}
              <Card className="mb-8 border shadow-sm bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="size-5 text-primary" />
                    Certificate & Views Tracker
                  </CardTitle>
                  <CardDescription>
                    Detailed user performance, video views, and generated certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userStatsQuery.isLoading ? (
                    <div className="flex justify-center p-12">
                      <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                  ) : userStatsQuery.isError ? (
                    <div className="text-red-500 text-sm">Failed to load user stats</div>
                  ) : !userStats || userStats.length === 0 ? (
                    <div className="text-muted-foreground text-center p-12">No course progress found</div>
                  ) : (
                    <>
                      {/* User Stats Charts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Video className="size-4 text-blue-500" />
                              Video Views by User
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={userStatsChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <PieChartIcon className="size-4 text-emerald-500" />
                              Certificate Distribution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={certificatePieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {certificatePieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* User Stats Table */}
                      <div className="rounded-md border bg-card overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>User</TableHead>
                              <TableHead>Course</TableHead>
                              <TableHead className="text-center">Views</TableHead>
                              <TableHead className="text-center">Score</TableHead>
                              <TableHead className="text-center">Certificate</TableHead>
                              <TableHead className="text-right">Last Active</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userStats.map((row: UserStat) => (
                              <TableRow key={row.id} className="group">
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{row.userName}</span>
                                    <span className="text-xs text-muted-foreground">{row.userEmail}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                    {Array.isArray(row.coursesList) && row.coursesList.length > 0 ? (
                                      row.coursesList.map((c: any, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 font-medium py-0.5">
                                          <BookOpen className="size-3 mr-1 text-purple-500 shrink-0" />
                                          {c.title || c.courseName || `Course ${i + 1}`}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Badge variant="secondary" className="text-xs font-medium py-0.5">
                                        <BookOpen className="size-3 mr-1 shrink-0" />
                                        {row.courseTitle || "Course"}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
                                    <PlayCircle className="size-3 text-blue-500" />
                                    {row.completedViews} / {row.totalLessons}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary" className="font-bold">
                                    {row.totalScore}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {row.hasCertificate ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1">
                                        <CheckCircle2 className="size-3" />
                                        Generated
                                      </Badge>
                                      <button
                                        onClick={() => setSelectedUserCert({
                                          studentName: row.userName || row.userEmail || "Student",
                                          courseTitle: row.courseTitle,
                                          completionDate: row.certificateDate || new Date(row.lastActive).toLocaleDateString(),
                                          certificateId: row.certificateId || `CERT-${Date.now()}`,
                                        })}
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer border border-blue-200 px-2 py-0.5 rounded-md hover:bg-blue-50 transition-colors"
                                      >
                                        <Eye className="size-3" /> View
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Pending</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(row.lastActive).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming live sessions */}
              {dash.upcomingLiveSessions?.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarClock className="size-4 text-amber-600" />
                      Next live sessions
                    </CardTitle>
                    <CardDescription>
                      Trainer-led milestones in the next 14 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {dash.upcomingLiveSessions.map((s) => (
                        <div
                          key={`${s.assignmentId}-${s.scheduledFor}`}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {s.sessionTitle}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.candidateName} · with {s.trainerName}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground tabular-nums whitespace-nowrap pl-4">
                            {fmtDateTime(s.scheduledFor)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}

          {/* Course Progress API - primary page data */}
          <Card className="mb-8 border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="size-5 text-primary" />
                    Course Progress
                  </CardTitle>
                  <CardDescription>
                    Live student course progress from the admin course-progress API
                  </CardDescription>
                </div>
                <Badge variant="outline">{userStats.length} record{userStats.length === 1 ? "" : "s"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {userStatsQuery.isLoading ? (
                <div className="flex items-center justify-center py-14">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading course progress...</span>
                </div>
              ) : userStatsQuery.isError ? (
                <div className="py-12 text-center text-sm text-destructive">
                  Failed to load course progress data.
                </div>
              ) : userStats.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No course progress data found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>User</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-center">Course Progress</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-center">Certificate</TableHead>
                        <TableHead className="text-right">Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userStats.map((row: UserStat) => {
                        const completed = Number(row.completedViews ?? 0);
                        const total = Number(row.totalLessons ?? 0);
                        const pct = Number(
                          row.progressPct ??
                          (total > 0 ? Math.round((completed / total) * 100) : 0)
                        );

                        return (
                          <TableRow key={row.id || `${row.userEmail}-${row.courseTitle}`}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{row.userName || row.userEmail || "Student"}</span>
                                {row.userEmail && (
                                  <span className="text-xs text-muted-foreground">{row.userEmail}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <BookOpen className="size-4 shrink-0 text-primary" />
                                <span className="truncate max-w-[260px]">{row.courseTitle || "Course"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[220px]">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Progress value={Math.min(100, Math.max(0, pct))} className="h-2" />
                                </div>
                                <Badge variant="outline" className="whitespace-nowrap">
                                  <PlayCircle className="size-3 mr-1 text-blue-500" />
                                  {completed} / {total}
                                </Badge>
                                <span className="text-xs font-semibold min-w-[38px] text-right">{pct}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-bold">
                                {(() => {
                                  const raw = row.score ?? row.totalScore;
                                  const num = typeof raw === "number" ? raw : parseFloat(String(raw || 0).replace("%", "")) || pct || 0;
                                  return `${isNaN(num) ? 0 : Math.round(num)}%`;
                                })()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {row.hasCertificate ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                  <CheckCircle2 className="size-3 mr-1" />
                                  Generated
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                              {row.lastActive ? new Date(row.lastActive).toLocaleDateString() : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All training assignments */}
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-base">All training assignments</CardTitle>
                <CardDescription>
                  Course progress for each candidate — views, completion, score, certificate and last active. Click a row to see full module details.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="upskilling">Upskilling</SelectItem>
                    <SelectItem value="reskilling">Reskilling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {userStatsQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : assignmentsWithProgress.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No assignments match the current filters.
                </div>
              ) : (
                <div className="min-w-[1100px]">
                  <div className="grid grid-cols-[minmax(220px,1.3fr)_minmax(180px,1fr)_120px_100px_210px_130px_32px] items-center gap-4 px-4 py-3 bg-muted/50 border-y text-xs font-semibold text-muted-foreground">
                    <div>User</div>
                    <div>Course / Progress</div>
                    <div className="text-center">Views</div>
                    <div className="text-center">Score</div>
                    <div className="text-center">Certificate</div>
                    <div className="text-right">Last Active</div>
                    <div />
                  </div>
                  <div>
                    {assignmentsWithProgress.map((a) => (
                      <TrainingRow
                        key={a.id}
                        assignment={a}
                        onSelect={() => handleSelectCandidate(a.candidateId)}
                        isExpanded={selectedCandidate === a.candidateId}
                        onViewCertificate={() => setShowCertificate(a.id)}
                        onViewProgress={() => navigate(`/candidate/${a.candidateId}/learning-student-path-list`)}
                        onGenerateCertificate={handleGenerateCertificate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificate Modal for Assignment */}
          {(() => {
            const selected = assignmentsWithProgress.find(a => a.id === showCertificate);
            if (!selected || !showCertificate) return null;

            return (
              <CertificateModal
                open={true}
                onOpenChange={() => setShowCertificate(null)}
                candidateName={selected.candidateName}
                programName={selected.programName}
                completionDate={selected.completedAt ?
                  fmtDate(selected.completedAt) :
                  fmtDate(new Date().toISOString())
                }
                trainerName={selected.trainerName}
                certificateNumber={`ORN-${Date.now()}-${selected.candidateId.slice(0, 6)}`}
                score={selected.progress?.finalAssessment?.percentage}
                finalAssessment={selected.progress?.finalAssessment}
              />
            );
          })()}

          {/* Certificate Modal for UserStats */}
          {selectedUserCert && (
            <Dialog open={!!selectedUserCert} onOpenChange={() => setSelectedUserCert(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Certificate of Completion</DialogTitle>
                  <DialogDescription>
                    Certificate for {selectedUserCert.studentName}
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 text-center border rounded-lg bg-gradient-to-br from-slate-50 to-white">
                  <Award className="size-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Certificate of Completion</h2>
                  <p className="text-muted-foreground mt-2">This certifies that</p>
                  <h3 className="text-xl font-semibold mt-2">{selectedUserCert.studentName}</h3>
                  <p className="text-muted-foreground mt-2">has successfully completed</p>
                  <h4 className="text-lg font-medium mt-1">{selectedUserCert.courseTitle}</h4>
                  <p className="text-sm text-muted-foreground mt-4">Completed on: {selectedUserCert.completionDate}</p>
                  <p className="text-xs text-muted-foreground mt-2">Certificate ID: {selectedUserCert.certificateId}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedUserCert(null)}>
                    Close
                  </Button>
                  <Button>
                    <Printer className="size-4 mr-2" />
                    Print
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Helper footer card */}
          <Card className="mt-6 bg-muted/30 border-dashed">
            <CardContent className="py-5 flex items-center gap-4">
              <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-0.5">
                  Assign training from a candidate's profile
                </div>
                <div className="text-xs text-muted-foreground">
                  Open any candidate evaluation. If readiness is below
                  recruiter-ready, you'll see the recommended program with the
                  matched trainer and a one-click assignment flow.
                </div>
              </div>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Open admin pipeline
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MotionConfig>
    </Shell>
  );
}

// Training Row Component
function TrainingRow({
  assignment,
  onSelect,
  isExpanded,
  onViewCertificate,
  onViewProgress,
  onGenerateCertificate,
}: {
  assignment: any;
  onSelect: () => void;
  isExpanded: boolean;
  onViewCertificate: () => void;
  onViewProgress: () => void;
  onGenerateCertificate?: (candidateName: string) => void;
}) {
  const progress = assignment.progress;
  const completedViews = Number(assignment.__completedViews ?? assignment.completedViews ?? 0);
  const totalLessons = Number(assignment.__totalLessons ?? assignment.totalLessons ?? 0);
  const displayProgress = Number(
    assignment.progressPct ??
    (totalLessons > 0 ? Math.round((completedViews / totalLessons) * 100) : 0)
  );

  const isComplete =
    assignment.status === "completed" ||
    assignment.status === "recruiter_ready" ||
    displayProgress >= 100;
  const hasCertificate =
    assignment.hasCertificate ||
    assignment.__hasCertificate ||
    false;
  const isEligible = assignment.isCertificateEligible || false;
  const rawScore = progress?.finalAssessment?.percentage ?? assignment.__totalScore ?? assignment.totalScore ?? assignment.score;
  const parsedScore = typeof rawScore === "number" ? rawScore : parseFloat(String(rawScore || 0).replace("%", "")) || displayProgress || 0;
  const finalScore = isNaN(parsedScore) ? 0 : Math.round(parsedScore);
  const assessmentPassed = Boolean(progress?.finalAssessment?.passed);
  const lastActive = assignment.__lastActive || assignment.lastActive;
  const candidateId = assignment.candidateId;
  const courseId = assignment.courseId;

  return (
    <div className="border-b last:border-b-0">
      {/* EXACT COURSE-PROGRESS ROW */}
      <div
        className="grid grid-cols-[minmax(220px,1.3fr)_minmax(180px,1fr)_120px_100px_210px_130px_32px] items-center gap-4 px-4 py-4 hover:bg-muted/30 cursor-pointer"
        onClick={onSelect}
        data-testid={`row-training-${assignment.id}`}
      >
        {/* User */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {assignment.candidateAvatarUrl ? (
              <img
                src={assignment.candidateAvatarUrl}
                alt={assignment.candidateName || "Candidate"}
                className="size-9 rounded-full object-cover border shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="size-9 rounded-full bg-primary/10 text-primary border flex items-center justify-center font-semibold shrink-0">
                {(assignment.candidateName || "S").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-medium truncate">
                {assignment.candidateName || "Student"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {assignment.__userEmail || assignment.candidateEmail || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Course + progress bar */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium truncate">
              {assignment.courseTitle || assignment.programName || "Course"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress
              value={Math.min(100, Math.max(0, displayProgress))}
              className="h-1.5 flex-1"
            />
            <span className="text-xs font-semibold w-10 text-right">
              {displayProgress}%
            </span>
          </div>
        </div>

        {/* Views */}
        <div className="text-center">
          <Badge variant="outline" className="gap-1 whitespace-nowrap">
            <PlayCircle className="size-3 text-blue-500" />
            {completedViews} / {totalLessons}
          </Badge>
        </div>

        {/* Score */}
        <div className="text-center">
          <Badge variant="secondary" className="font-bold">
            {finalScore}%
          </Badge>
        </div>

        {/* Certificate */}
        <div className="flex items-center justify-center gap-2">
          {hasCertificate ? (
            <>
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 gap-1">
                <CheckCircle2 className="size-3" />
                Generated
              </Badge>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCertificate();
                }}
              >
                <Eye className="size-3 mr-1" />
                View
              </Button>
            </>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>

        {/* Last active */}
        <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
          {lastActive ? fmtDate(lastActive) : "—"}
        </div>

        {isExpanded ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </div>

      {/* Expanded: candidate-specific course details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="px-4 pb-5 pt-1 bg-muted/10"
        >
          <div className="ml-12 rounded-lg border bg-background p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MiniStat label="Course progress" value={`${displayProgress}%`} />
              <MiniStat label="Views" value={`${completedViews}/${totalLessons}`} />
              <MiniStat label="Score" value={`${finalScore}%`} />
              <MiniStat label="Certificate" value={hasCertificate ? "Generated" : "Pending"} />
              <MiniStat label="Last active" value={lastActive ? fmtDate(lastActive) : "—"} />
            </div>

            <div className="flex flex-wrap gap-2">
              {courseId && candidateId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProgress();
                  }}
                >
                  <BarChart3 className="size-4 mr-2" />
                  View Complete Course Progress
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              )}

              {hasCertificate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCertificate();
                  }}
                >
                  <Award className="size-4 mr-2" />
                  View Certificate
                </Button>
              )}

              {isEligible && !hasCertificate && onGenerateCertificate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateCertificate(assignment.candidateName);
                  }}
                >
                  <Award className="size-4 mr-2" />
                  Generate Certificate
                </Button>
              )}
            </div>

            {/* Module / video completion */}
            <div>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                <PlayCircle className="size-4" />
                Course modules / videos
              </div>

              {assignment.modules?.length ? (
                <div className="divide-y border rounded-lg overflow-hidden">
                  {assignment.modules.map((module: any, index: number) => {
                    const moduleId = module.id || module._id || String(index);
                    const lessonDone = Boolean(
                      progress?.completedLessons?.[moduleId] ||
                      module.isCompleted ||
                      module.status === "completed" ||
                      module.completed
                    );
                    const quizDone = Boolean(
                      progress?.completedQuizzes?.[moduleId] ||
                      module.quizCompleted
                    );

                    return (
                      <div
                        key={moduleId}
                        className="flex items-center gap-3 p-3"
                      >
                        <div
                          className={`size-8 rounded-md flex items-center justify-center shrink-0 ${lessonDone
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {lessonDone ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <Circle className="size-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {module.title || module.name || `Module ${index + 1}`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                            {module.durationMinutes != null && (
                              <span>
                                <Clock className="inline size-3 mr-1" />
                                {module.durationMinutes} min
                              </span>
                            )}
                            {quizDone && (
                              <span className="text-emerald-600">
                                <CheckCircle2 className="inline size-3 mr-1" />
                                Quiz completed
                              </span>
                            )}
                          </div>
                        </div>

                        <Badge
                          className={
                            lessonDone
                              ? "bg-emerald-500/10 text-emerald-700 border-0"
                              : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {lessonDone ? "Completed" : "Not completed"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  No module-level data returned for this course.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-1 truncate">{value}</div>
    </div>
  );
}

// Live Session Card
function LiveSessionCard({ session }: { session: any }) {
  const isCompleted = session.status === "completed";
  const isScheduled = session.status === "scheduled";

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{session.title}</div>
        <div className="text-xs text-muted-foreground">
          {fmtDateTime(session.scheduledFor)} · {session.trainerName}
        </div>
      </div>
      {isCompleted ? (
        <Badge className="bg-emerald-500/10 text-emerald-700 border-0">
          <CheckCircle2 className="size-3 mr-1" />
          Attended
        </Badge>
      ) : isScheduled ? (
        <Badge className="bg-amber-500/10 text-amber-700 border-0">
          <CalendarClock className="size-3 mr-1" />
          Upcoming
        </Badge>
      ) : (
        <Badge variant="outline">Cancelled</Badge>
      )}
    </div>
  );
}

// KPI Card Component
function KpiCard({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/40 bg-primary/5" : ""}>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
          <span
            className={`size-6 rounded-md flex items-center justify-center ${highlight ? "bg-primary/15 text-primary" : "bg-muted"
              }`}
          >
            {icon}
          </span>
          {label}
        </div>
        <div className="text-2xl font-bold tabular-nums mb-1">{value}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}