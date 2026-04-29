import { useParams, Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetCandidate,
  getGetCandidateQueryKey,
  useGetEvaluation,
  getGetEvaluationQueryKey,
} from "@workspace/api-client-react";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Target,
  MapPin,
  CheckCircle2,
  FileText,
  Cpu,
  Languages,
  Globe2,
  GraduationCap,
  ArrowRight,
  AlertTriangle,
  Briefcase,
  Linkedin,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// ----- Score → color helpers -----
function scoreColor(score: number): {
  text: string;
  bg: string;
  ring: string;
  bar: string;
  label: string;
} {
  if (score >= 80)
    return {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "stroke-emerald-500",
      bar: "bg-emerald-500",
      label: "Excellent",
    };
  if (score >= 65)
    return {
      text: "text-primary",
      bg: "bg-primary/10",
      ring: "stroke-primary",
      bar: "bg-primary",
      label: "Strong",
    };
  if (score >= 50)
    return {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      ring: "stroke-amber-500",
      bar: "bg-amber-500",
      label: "Developing",
    };
  return {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    ring: "stroke-rose-500",
    bar: "bg-rose-500",
    label: "Needs work",
  };
}

// For Upskilling Priority: high score = high priority (i.e. more gap). Invert color logic.
function priorityColor(score: number): ReturnType<typeof scoreColor> {
  if (score >= 70)
    return {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      ring: "stroke-rose-500",
      bar: "bg-rose-500",
      label: "High priority",
    };
  if (score >= 45)
    return {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      ring: "stroke-amber-500",
      bar: "bg-amber-500",
      label: "Moderate",
    };
  return {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "stroke-emerald-500",
    bar: "bg-emerald-500",
    label: "Low priority",
  };
}

// ----- Final readiness label -----
function readinessLabel(overall: number): {
  label: "Recruiter Ready" | "Needs Upskilling" | "Not Ready Yet";
  description: string;
  className: string;
  iconClass: string;
  icon: typeof CheckCircle2;
} {
  if (overall >= 75)
    return {
      label: "Recruiter Ready",
      description:
        "Profile meets the bar for Tier-1 European recruiter shortlists. Ready for direct outreach.",
      className:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      iconClass: "bg-emerald-500 text-white",
      icon: CheckCircle2,
    };
  if (overall >= 55)
    return {
      label: "Needs Upskilling",
      description:
        "Strong foundation, but targeted upskilling will close the remaining gaps to recruiter-ready.",
      className:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      iconClass: "bg-amber-500 text-white",
      icon: GraduationCap,
    };
  return {
    label: "Not Ready Yet",
    description:
      "Significant gaps across multiple dimensions. A structured 12-week pathway is recommended before recruiter exposure.",
    className:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    iconClass: "bg-rose-500 text-white",
    icon: AlertTriangle,
  };
}

// ----- Score card metadata -----
type ScoreId = "cv" | "tech" | "english" | "europe" | "upskill";

interface ScoreCardConfig {
  id: ScoreId;
  label: string;
  blurb: string;
  icon: typeof FileText;
}

const SCORE_CARDS: ScoreCardConfig[] = [
  {
    id: "cv",
    label: "CV Quality",
    blurb: "Structure, clarity, quantified outcomes",
    icon: FileText,
  },
  {
    id: "tech",
    label: "Technical Skill Match",
    blurb: "Stack alignment with target role",
    icon: Cpu,
  },
  {
    id: "english",
    label: "English Readiness",
    blurb: "CEFR-aligned working proficiency",
    icon: Languages,
  },
  {
    id: "europe",
    label: "Europe Job Readiness",
    blurb: "Visa, eligibility & EU-market fit",
    icon: Globe2,
  },
  {
    id: "upskill",
    label: "Upskilling Priority",
    blurb: "How urgent further training is",
    icon: GraduationCap,
  },
];

// ----- Circular score gauge -----
function ScoreRing({
  score,
  size = 56,
  stroke = 5,
  ringClass,
}: {
  score: number;
  size?: number;
  stroke?: number;
  ringClass: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-muted/40 fill-none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          className={ringClass}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums">
        {score}
      </div>
    </div>
  );
}

export default function CandidateEvaluation() {
  const { id } = useParams<{ id: string }>();

  const { data: candidate, isLoading: isLoadingCandidate } = useGetCandidate(id || "", {
    query: { enabled: !!id, queryKey: getGetCandidateQueryKey(id || "") },
  });

  const { data: evaluation, isLoading: isLoadingEvaluation } = useGetEvaluation(id || "", {
    query: { enabled: !!id, queryKey: getGetEvaluationQueryKey(id || "") },
  });

  if (!id || isLoadingCandidate || isLoadingEvaluation) {
    return (
      <Shell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  if (!evaluation || !candidate) {
    return (
      <Shell>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <AlertCircle className="size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Evaluation Not Found</h2>
          <p className="text-muted-foreground">
            The AI evaluation has not been completed or encountered an error.
          </p>
        </div>
      </Shell>
    );
  }

  const scores = {
    cv: evaluation.scores.cvQuality,
    tech: evaluation.scores.technicalSkillMatch,
    english: evaluation.scores.englishReadiness,
    europe: evaluation.scores.europeJobReadiness,
    upskill: evaluation.scores.upskillingNeeds,
  };

  const overall = evaluation.scores.overall;
  const readiness = readinessLabel(overall);
  const ReadinessIcon = readiness.icon;

  const radarData = [
    { subject: "CV Quality", value: scores.cv },
    { subject: "Technical", value: scores.tech },
    { subject: "English", value: scores.english },
    { subject: "EU Ready", value: scores.europe },
    { subject: "Trained", value: 100 - scores.upskill },
  ];

  const overallRingCircumference = 2 * Math.PI * 52;
  const overallRingOffset = overallRingCircumference - (overall / 100) * overallRingCircumference;

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* ============ HEADER ============ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 p-6 md:p-8 items-start">
              {/* Identity */}
              <div className="flex items-start gap-5">
                <div className="size-20 md:size-24 rounded-2xl bg-muted border overflow-hidden shrink-0">
                  {candidate.avatarUrl ? (
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                      {candidate.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-1">
                    AI Readiness Evaluation
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {candidate.fullName}
                  </h1>
                  <p className="text-muted-foreground text-base flex items-center gap-2 mt-1">
                    <Briefcase className="size-4" />
                    {candidate.targetRole}
                    <span className="text-muted-foreground/50">•</span>
                    {candidate.yearsExperience} yrs exp
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="font-normal gap-1">
                      <MapPin className="size-3" /> {candidate.country}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      Visa: {candidate.visaStatus.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      English {candidate.englishLevel}
                    </Badge>
                    {candidate.euWorkEligible && (
                      <Badge className="font-normal bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30">
                        EU Work Eligible
                      </Badge>
                    )}
                    {candidate.linkedinUrl && (
                      <a
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2.5 py-0.5 rounded-md border bg-background"
                      >
                        <Linkedin className="size-3" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Overall score gauge */}
              <div className="flex items-center gap-5 lg:border-l lg:pl-6 border-t lg:border-t-0 pt-6 lg:pt-0">
                <div className="relative size-28 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      strokeWidth="10"
                      className="stroke-muted/40 fill-none"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={overallRingCircumference}
                      initial={{ strokeDashoffset: overallRingCircumference }}
                      animate={{ strokeDashoffset: overallRingOffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold tabular-nums leading-none">{overall}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      / 100
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    Overall Score
                  </div>
                  <div className="text-2xl font-bold leading-tight">{scoreColor(overall).label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Weighted across 5 dimensions
                  </div>
                </div>
              </div>
            </div>

            {/* Final readiness label banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`px-6 md:px-8 py-5 border-t flex flex-col md:flex-row items-start md:items-center gap-4 ${readiness.className}`}
            >
              <div
                className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${readiness.iconClass}`}
              >
                <ReadinessIcon className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Final Verdict
                </div>
                <div className="text-2xl font-bold tracking-tight">{readiness.label}</div>
                <div className="text-sm opacity-90 mt-0.5 max-w-2xl">{readiness.description}</div>
              </div>
              {readiness.label === "Recruiter Ready" ? (
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Link href={`/candidate/${candidate.id}/training`}>
                    <Button variant="outline" className="gap-2 w-full">
                      Training plan
                    </Button>
                  </Link>
                  <Link href="/recruiter">
                    <Button variant="secondary" className="gap-2">
                      Open in Recruiter Dashboard <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href={`/candidate/${candidate.id}/training`}>
                  <Button variant="secondary" className="gap-2 shrink-0">
                    Route to training <ArrowRight className="size-4" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* ============ 5 SCORE CARDS ============ */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Score Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Five dimensions, each scored 0–100 by the ORN-AI engine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SCORE_CARDS.map((card, i) => {
              const value = scores[card.id];
              const colors = card.id === "upskill" ? priorityColor(value) : scoreColor(value);
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                  className="bg-background rounded-xl border shadow-sm p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center ${colors.bg}`}
                    >
                      <Icon className={`size-4 ${colors.text}`} />
                    </div>
                    <ScoreRing score={value} ringClass={colors.ring} />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    0{i + 1}
                  </div>
                  <div className="text-sm font-bold leading-tight mb-1">{card.label}</div>
                  <div className="text-xs text-muted-foreground mb-3 flex-1">{card.blurb}</div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div className="text-2xl font-bold tabular-nums leading-none">
                      {value}
                      <span className="text-xs text-muted-foreground font-normal ml-0.5">/100</span>
                    </div>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text}`}>
                      {colors.label}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.9, delay: i * 0.06 + 0.2, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ============ ANALYSIS GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar */}
          <Card className="lg:col-span-1 border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="size-4 text-primary" /> Dimension Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Visual fingerprint across all 5 axes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Candidate"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> AI-Generated Insights
              </CardTitle>
              <CardDescription className="text-xs">
                Market positioning, comp band, and time-to-ready
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {evaluation.insights.map((insight, i) => {
                const tone =
                  insight.severity === "strength"
                    ? { dot: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" }
                    : insight.severity === "opportunity"
                      ? { dot: "bg-blue-500", chip: "bg-blue-500/10 text-blue-700 dark:text-blue-400" }
                      : { dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-400" };
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    key={i}
                    className="flex gap-3 p-4 rounded-xl border bg-muted/20"
                  >
                    <div className={`size-2 rounded-full mt-2 shrink-0 ${tone.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.chip}`}
                        >
                          {insight.severity}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {insight.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* ============ STRENGTHS / GAPS / UPSKILLING ============ */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" /> Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {evaluation.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="size-4 text-amber-500" /> Identified Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluation.gaps.length > 0 ? (
                <ul className="space-y-2.5">
                  {evaluation.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">{gap}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No significant gaps identified.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Recommended Upskilling
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluation.recommendedUpskilling.length > 0 ? (
                <ul className="space-y-2.5">
                  {evaluation.recommendedUpskilling.map((skill, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm font-medium">
                      <div className="size-6 rounded-md bg-background border flex items-center justify-center text-[11px] font-bold shrink-0 text-primary">
                        {i + 1}
                      </div>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Candidate is ready. No immediate upskilling required.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============ FOOTER METADATA ============ */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t pt-6">
          <div>
            Evaluated{" "}
            {new Date(evaluation.evaluatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}{" "}
            · Engine v1.0 (deterministic demo)
          </div>
          <Link href="/recruiter">
            <Button variant="ghost" size="sm" className="gap-2">
              Browse other candidates <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
