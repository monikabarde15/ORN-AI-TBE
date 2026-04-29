import { useMemo, useState } from "react";
import { Link } from "wouter";
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
  useTrainingDashboard,
  useListTrainingAssignments,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
  not_started: { label: "Not started", tone: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  module_completed: { label: "Module complete", tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  live_session_pending: { label: "Live session due", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  assessment_pending: { label: "Assessment pending", tone: "bg-orange-500/10 text-orange-700 dark:text-orange-300" },
  completed: { label: "Completed", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  recruiter_ready: { label: "Recruiter-ready", tone: "bg-primary/10 text-primary" },
};

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

export default function TrainingDashboard() {
  const reduce = useReducedMotion();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const dashQuery = useTrainingDashboard();
  const listQuery = useListTrainingAssignments({
    ...(statusFilter !== "all"
      ? { status: statusFilter as "not_started" }
      : {}),
    ...(typeFilter !== "all"
      ? { trainingType: typeFilter as "upskilling" | "reskilling" }
      : {}),
  });

  const dash = dashQuery.data;
  const assignments = listQuery.data ?? [];

  const statusChartData = useMemo(() => {
    if (!dash) return [];
    return dash.statusBreakdown.map((b) => ({
      name: STATUS_LABELS[b.status]?.label ?? b.status,
      value: b.count,
    }));
  }, [dash]);

  const trainerChartData = useMemo(() => {
    if (!dash) return [];
    return dash.trainerAllocation.map((t) => ({
      name: t.trainerName.split(" ").slice(-1)[0] ?? t.trainerName,
      Active: t.activeAssignments,
      Completed: t.completedAssignments,
    }));
  }, [dash]);

  const motionInitial = reduce ? false : { opacity: 0, y: 8 };
  const motionAnimate = reduce ? undefined : { opacity: 1, y: 0 };

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
              recruiter-ready status.
            </p>
          </motion.div>

          {/* KPI cards */}
          {dashQuery.isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : dashQuery.isError ? (
            <Card className="p-8 text-center border-destructive/30 bg-destructive/5">
              <p className="text-sm font-medium text-destructive mb-3">
                We couldn't load the training dashboard.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dashQuery.refetch()}
                data-testid="button-retry-dashboard"
              >
                Try again
              </Button>
            </Card>
          ) : dash ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                  label="Recruiter-ready"
                  value={dash.recruiterReadyCount}
                  hint={`${dash.completedCount} completed · awaiting placement`}
                  highlight
                />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
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
              </div>

              {/* Upcoming live sessions */}
              {dash.upcomingLiveSessions.length > 0 && (
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

          {/* Assignments table */}
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-base">All training assignments</CardTitle>
                <CardDescription>
                  Filter by stage or transformation type
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
            <CardContent>
              {listQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : listQuery.isError ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-destructive mb-3">
                    Couldn't load assignments.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => listQuery.refetch()}
                    data-testid="button-retry-assignments"
                  >
                    Try again
                  </Button>
                </div>
              ) : assignments.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No assignments match the current filters.
                </div>
              ) : (
                <div className="divide-y">
                  {assignments.map((a) => (
                    <Link
                      key={a.id}
                      href={`/candidate/${a.candidateId}/training`}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover-elevate active-elevate-2 -mx-2 px-2 rounded-md transition-colors"
                      data-testid={`row-training-${a.id}`}
                    >
                      <img
                        src={a.candidateAvatarUrl}
                        alt={a.candidateName}
                        className="size-10 rounded-full object-cover border"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm truncate">
                            {a.candidateName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {a.candidateCountry}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {a.programName}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 min-w-[110px]">
                        {a.trainingType === "reskilling" ? (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <RefreshCcw className="size-3" />
                            Reskilling
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Compass className="size-3" />
                            Upskilling
                          </Badge>
                        )}
                      </div>
                      <div className="hidden lg:flex flex-col gap-1 min-w-[140px]">
                        <Progress value={a.progressPct} className="h-1.5" />
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {a.progressPct}% · target {fmtDate(a.targetCompletionDate)}
                        </span>
                      </div>
                      <div className="min-w-[140px] flex justify-end">
                        {statusBadge(a.status)}
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
            className={`size-6 rounded-md flex items-center justify-center ${
              highlight ? "bg-primary/15 text-primary" : "bg-muted"
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
