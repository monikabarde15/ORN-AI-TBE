import { useState } from "react";
import { Link, useParams } from "wouter";
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
  useGetCandidate,
  useGetCandidateTraining,
  useUpdateTrainingAssignment,
  getGetCandidateTrainingQueryKey,
  getTrainingDashboardQueryKey,
  getListTrainingAssignmentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AssignTrainingDialog } from "@/components/training/AssignTrainingDialog";
import {
  Loader2,
  ArrowLeft,
  GraduationCap,
  CalendarClock,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardCheck,
  Award,
  Sparkles,
  RefreshCcw,
  Compass,
  Play,
  Users,
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

export default function CandidateTraining() {
  const { id } = useParams<{ id: string }>();
  const reduce = useReducedMotion();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [assignOpen, setAssignOpen] = useState(false);

  const candidateQuery = useGetCandidate(id ?? "");
  const trainingQuery = useGetCandidateTraining(id ?? "");

  const updateMut = useUpdateTrainingAssignment({
    mutation: {
      onSuccess: () => {
        toast({ title: "Progress updated" });
        qc.invalidateQueries({
          queryKey: getGetCandidateTrainingQueryKey(id ?? ""),
        });
        qc.invalidateQueries({ queryKey: getTrainingDashboardQueryKey() });
        qc.invalidateQueries({
          queryKey: getListTrainingAssignmentsQueryKey(),
        });
      },
      onError: (err) =>
        toast({
          title: "Could not update",
          description: (err as Error).message,
          variant: "destructive",
        }),
    },
  });

  const candidate = candidateQuery.data;
  const training = trainingQuery.data;
  const isLoading = candidateQuery.isLoading || trainingQuery.isLoading;

  return (
    <Shell>
      <MotionConfig reducedMotion="user">
        <div className="px-6 lg:px-10 py-8 max-w-[1200px] mx-auto w-full">
          <Link
            href={`/candidate/${id}/evaluation`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to evaluation
          </Link>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : candidateQuery.isError || trainingQuery.isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive mb-3">
                We couldn't load this candidate's training plan.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  candidateQuery.refetch();
                  trainingQuery.refetch();
                }}
                data-testid="button-retry-candidate-training"
              >
                Try again
              </Button>
            </div>
          ) : !candidate ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Candidate not found.
            </div>
          ) : !training ? (
            <NoAssignmentState
              candidateId={candidate.id}
              candidateName={candidate.fullName}
              candidateRole={candidate.targetRole}
              candidateAvatar={candidate.avatarUrl}
              candidateCountry={candidate.country}
              onAssign={() => setAssignOpen(true)}
            />
          ) : (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-start gap-4 flex-wrap">
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="size-16 rounded-full object-cover border"
                />
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <GraduationCap className="size-3.5" />
                    Training assignment
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    {candidate.fullName}
                  </h1>
                  <div className="text-sm text-muted-foreground mt-1">
                    {candidate.targetRole} · {candidate.country}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${STATUS_LABELS[training.status]?.tone ?? ""} border-0 font-medium`}
                  >
                    {STATUS_LABELS[training.status]?.label ?? training.status}
                  </Badge>
                </div>
              </div>

              {/* Program summary card */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[260px]">
                      <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                        <Sparkles className="size-3.5" />
                        Recommended career path
                      </div>
                      <div className="text-lg font-semibold mb-1">
                        {training.programName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {training.recommendedPath}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="outline" className="gap-1">
                        {training.trainingType === "reskilling" ? (
                          <>
                            <RefreshCcw className="size-3" />
                            Reskilling
                          </>
                        ) : (
                          <>
                            <Compass className="size-3" />
                            Upskilling
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Users className="size-3" />
                        Hybrid delivery
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-primary/20">
                    <Stat
                      label="Trainer"
                      value={training.trainerName}
                      isText
                    />
                    <Stat
                      label="Started"
                      value={fmtDate(training.startDate)}
                      isText
                    />
                    <Stat
                      label="Target completion"
                      value={fmtDate(training.targetCompletionDate)}
                      isText
                    />
                    <Stat label="Progress" value={`${training.progressPct}%`} />
                  </div>
                  <Progress value={training.progressPct} className="h-2 mt-4" />
                </CardContent>
              </Card>

              {/* Modules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Play className="size-4" />
                    Self-paced modules
                  </CardTitle>
                  <CardDescription>
                    Pre-recorded curriculum delivered through the trainer's
                    program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {training.modules.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <ModuleIcon status={m.status} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {m.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {m.durationMinutes} min
                          </div>
                        </div>
                        <ModuleActions
                          status={m.status}
                          onAdvance={(next) =>
                            updateMut.mutate({
                              id: training.id,
                              data: {
                                moduleId: m.id,
                                moduleStatus: next,
                              },
                            })
                          }
                          disabled={updateMut.isPending}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarClock className="size-4" />
                    Live trainer sessions
                  </CardTitle>
                  <CardDescription>
                    Trainer-led calibration, workshops, and final readiness
                    review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {training.liveSessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div
                          className={`size-9 rounded-md flex items-center justify-center shrink-0 ${
                            s.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : s.status === "cancelled"
                                ? "bg-muted text-muted-foreground"
                                : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          <CalendarClock className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {s.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {fmtDateTime(s.scheduledFor)} · {s.trainerName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updateMut.isPending}
                              onClick={() =>
                                updateMut.mutate({
                                  id: training.id,
                                  data: {
                                    liveSessionId: s.id,
                                    liveSessionStatus: "completed",
                                  },
                                })
                              }
                              data-testid={`button-complete-session-${s.id}`}
                            >
                              Mark attended
                            </Button>
                          )}
                          {s.status === "completed" && (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-0">
                              Attended
                            </Badge>
                          )}
                          {s.status === "cancelled" && (
                            <Badge variant="outline">Cancelled</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trainer review / recruiter readiness */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="size-4" />
                    Trainer review &amp; recruiter readiness
                  </CardTitle>
                  <CardDescription>
                    Final sign-off step that promotes the candidate onto
                    recruiter shortlists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {training.finalReadinessNote ? (
                    <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                        <CheckCircle2 className="size-3.5" />
                        Trainer sign-off
                      </div>
                      <p className="text-sm leading-relaxed">
                        {training.finalReadinessNote}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No trainer sign-off recorded yet. The trainer will publish
                      a final readiness note after the closing live session.
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {training.status !== "completed" &&
                      training.status !== "recruiter_ready" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updateMut.isPending}
                          onClick={() =>
                            updateMut.mutate({
                              id: training.id,
                              data: {
                                status: "completed",
                                progressPct: 100,
                                finalReadinessNote: `Final review completed by ${training.trainerName}.`,
                              },
                            })
                          }
                          data-testid="button-mark-completed"
                        >
                          <ClipboardCheck className="size-4" />
                          Mark training complete
                        </Button>
                      )}
                    {training.status !== "recruiter_ready" && (
                      <Button
                        size="sm"
                        disabled={updateMut.isPending}
                        onClick={() =>
                          updateMut.mutate({
                            id: training.id,
                            data: {
                              status: "recruiter_ready",
                              progressPct: 100,
                              finalReadinessNote: `${training.trainerName} cleared this candidate for recruiter shortlists.`,
                            },
                          })
                        }
                        data-testid="button-promote-recruiter-ready"
                      >
                        <Award className="size-4" />
                        Promote to recruiter-ready
                      </Button>
                    )}
                    {training.status === "recruiter_ready" && (
                      <Link href="/recruiter">
                        <Button size="sm" variant="outline">
                          View on recruiter board
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {candidate && (
          <AssignTrainingDialog
            candidateId={candidate.id}
            candidateName={candidate.fullName}
            open={assignOpen}
            onOpenChange={setAssignOpen}
          />
        )}
      </MotionConfig>
    </Shell>
  );
}

function NoAssignmentState({
  candidateId,
  candidateName,
  candidateRole,
  candidateAvatar,
  candidateCountry,
  onAssign,
}: {
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar: string;
  candidateCountry: string;
  onAssign: () => void;
}) {
  void candidateId;
  return (
    <Card>
      <CardContent className="pt-8 pb-8">
        <div className="flex items-start gap-4 mb-6">
          <img
            src={candidateAvatar}
            alt={candidateName}
            className="size-14 rounded-full object-cover border"
          />
          <div>
            <div className="text-sm text-muted-foreground mb-0.5">
              {candidateRole} · {candidateCountry}
            </div>
            <h2 className="text-xl font-semibold">{candidateName}</h2>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="mx-auto size-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <GraduationCap className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No training assigned yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Route this candidate into a hybrid upskilling or reskilling track.
            The recommendation engine will propose the best-matched program and
            trainer based on their evaluation profile.
          </p>
          <Button onClick={onAssign} data-testid="button-open-assign-dialog">
            <Sparkles className="size-4" />
            Assign training
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleIcon({ status }: { status: string }) {
  if (status === "completed")
    return (
      <div className="size-9 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
        <CheckCircle2 className="size-4" />
      </div>
    );
  if (status === "in_progress")
    return (
      <div className="size-9 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
        <CircleDot className="size-4" />
      </div>
    );
  if (status === "assessment_pending")
    return (
      <div className="size-9 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
        <ClipboardCheck className="size-4" />
      </div>
    );
  return (
    <div className="size-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
      <Circle className="size-4" />
    </div>
  );
}

function ModuleActions({
  status,
  onAdvance,
  disabled,
}: {
  status: string;
  onAdvance: (next: "in_progress" | "completed" | "assessment_pending") => void;
  disabled: boolean;
}) {
  if (status === "not_started") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAdvance("in_progress")}
      >
        Start
      </Button>
    );
  }
  if (status === "in_progress") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAdvance("completed")}
      >
        Complete
      </Button>
    );
  }
  if (status === "assessment_pending") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAdvance("completed")}
      >
        Pass assessment
      </Button>
    );
  }
  return (
    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-0">
      Done
    </Badge>
  );
}

function Stat({
  label,
  value,
  isText,
}: {
  label: string;
  value: string;
  isText?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-sm font-medium ${isText ? "" : "tabular-nums"}`}>
        {value}
      </div>
    </div>
  );
}
