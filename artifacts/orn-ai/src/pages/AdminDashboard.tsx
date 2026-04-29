import { useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAdminPipeline,
  getAdminPipelineQueryKey,
  useAdminActivity,
  getAdminActivityQueryKey,
} from "@workspace/api-client-react";
import {
  AreaChart,
  Area,
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
  ArrowUpRight,
  Activity,
  Users,
  GraduationCap,
  TrendingUp,
  Globe2,
  Wrench,
  Target,
  Sparkles,
  Zap,
  Flame,
  Trophy,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

// ============================================================
// HELPERS
// ============================================================

function fmtNumber(n: number | undefined): string {
  if (n === undefined) return "—";
  return n.toLocaleString();
}

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}k`;
  return `€${n}`;
}

const READINESS_COLORS: Record<string, string> = {
  elite: "hsl(265 85% 60%)",
  ready: "hsl(160 70% 45%)",
  developing: "hsl(35 90% 55%)",
  emerging: "hsl(0 75% 60%)",
};

const READINESS_LABELS: Record<string, string> = {
  elite: "Elite",
  ready: "Recruiter Ready",
  developing: "Developing",
  emerging: "Emerging",
};

// ============================================================
// MAIN
// ============================================================

export default function AdminDashboard() {
  const prefersReducedMotion = useReducedMotion();

  const { data: pipeline, isLoading: isLoadingPipeline } = useAdminPipeline({
    query: { queryKey: getAdminPipelineQueryKey() },
  });

  const { data: activities, isLoading: isLoadingActivity } = useAdminActivity({
    query: { queryKey: getAdminActivityQueryKey() },
  });

  // ---- Derived metrics ----
  const derived = useMemo(() => {
    if (!pipeline) return null;

    const recruiterReady =
      pipeline.byReadiness.find((r) => r.tier === "ready")?.count ?? 0;
    const elite = pipeline.byReadiness.find((r) => r.tier === "elite")?.count ?? 0;
    const developing =
      pipeline.byReadiness.find((r) => r.tier === "developing")?.count ?? 0;
    const emerging =
      pipeline.byReadiness.find((r) => r.tier === "emerging")?.count ?? 0;

    const totalReady = recruiterReady + elite;
    const needsUpskilling = developing + emerging;

    // Training conversion: 'developing' tier is the immediate conversion pool
    // (mid-tier candidates that focused training can move into recruiter-ready).
    // Assumptions (transparent on UI): 65% completion rate, €4,200 avg placement fee.
    const CONVERSION_RATE = 0.65;
    const AVG_PLACEMENT_FEE = 4200;
    const conversionPool = developing;
    const conversionOpportunity = Math.round(
      conversionPool * CONVERSION_RATE * AVG_PLACEMENT_FEE,
    );
    const projectedConversions = Math.round(conversionPool * CONVERSION_RATE);

    // Top countries — sort defensively (don't trust API ordering)
    const topCountries = [...pipeline.byCountry]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top skills — sort defensively, take 8
    const topSkills = [...pipeline.bySkill]
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Monthly chart — use API data verbatim (source of truth)
    const monthly = pipeline.monthlyGrowth;
    const evalSeriesDistinct = monthly.some(
      (m) => m.evaluations !== m.registrations,
    );

    // Donut denominator — use evaluated subset (sum of readiness tiers),
    // not totalCandidates which may include un-evaluated profiles.
    const evaluatedTotal = pipeline.byReadiness.reduce(
      (sum, r) => sum + r.count,
      0,
    );

    // Readiness pie
    const readinessPie = pipeline.byReadiness.map((r) => ({
      name: READINESS_LABELS[r.tier] ?? r.tier,
      value: r.count,
      tier: r.tier,
    }));

    // Pipeline conversion %
    const evaluationRate =
      pipeline.totalCandidates > 0
        ? Math.round((pipeline.evaluated / pipeline.totalCandidates) * 100)
        : 0;
    const readyRate =
      pipeline.totalCandidates > 0
        ? Math.round((totalReady / pipeline.totalCandidates) * 100)
        : 0;

    return {
      totalReady,
      needsUpskilling,
      developing,
      emerging,
      elite,
      recruiterReady,
      conversionPool,
      projectedConversions,
      conversionOpportunity,
      topCountries,
      topSkills,
      readinessPie,
      monthly,
      evalSeriesDistinct,
      evaluatedTotal,
      evaluationRate,
      readyRate,
    };
  }, [pipeline]);

  return (
    <Shell>
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-1">
              Investor Briefing · Q2 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-muted-foreground mt-1.5 text-base max-w-2xl">
              Live macro view of the ORN-AI talent infrastructure across Central & Eastern Europe.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live data
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5">
              {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}
            </Badge>
          </div>
        </div>

        {/* ============ HERO METRIC CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <HeroMetric
            label="Total Candidates"
            value={fmtNumber(pipeline?.totalCandidates)}
            sub={
              derived
                ? `${derived.evaluationRate}% AI-evaluated`
                : ""
            }
            icon={Users}
            tone="neutral"
            loading={isLoadingPipeline}
            delay={0}
          />
          <HeroMetric
            label="Recruiter-Ready"
            value={fmtNumber(derived?.totalReady)}
            sub={
              derived
                ? `${derived.readyRate}% of pool · ${derived.elite} elite`
                : ""
            }
            icon={Trophy}
            tone="success"
            loading={isLoadingPipeline}
            delay={0.05}
          />
          <HeroMetric
            label="Needs Upskilling"
            value={fmtNumber(derived?.needsUpskilling)}
            sub={
              derived
                ? `${derived.developing} ready to convert`
                : ""
            }
            icon={GraduationCap}
            tone="warning"
            loading={isLoadingPipeline}
            delay={0.1}
          />
          <HeroMetric
            label="Conversion Opportunity"
            value={derived ? fmtCurrency(derived.conversionOpportunity) : "—"}
            sub={
              derived
                ? `~${derived.projectedConversions} projected placements`
                : ""
            }
            icon={Flame}
            tone="opportunity"
            loading={isLoadingPipeline}
            delay={0.15}
          />
        </div>

        {/* ============ MONTHLY ONBOARDING PIPELINE ============ */}
        <Card className="border shadow-sm mb-6 overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Monthly Onboarding Pipeline
              </CardTitle>
              <CardDescription>
                {derived?.evalSeriesDistinct
                  ? "Registrations vs AI evaluations — last 12 months"
                  : `Registrations — last 12 months · ${derived?.evaluationRate ?? 100}% AI-evaluated`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <LegendDot color="hsl(var(--primary))" label="Registrations" />
              {derived?.evalSeriesDistinct && (
                <LegendDot color="hsl(var(--chart-2))" label="Evaluations" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {isLoadingPipeline ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={derived?.monthly ?? []}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: 8,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      name="Registrations"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorReg)"
                      isAnimationActive={!prefersReducedMotion}
                      animationDuration={600}
                    />
                    {derived?.evalSeriesDistinct && (
                      <Area
                        type="monotone"
                        dataKey="evaluations"
                        name="Evaluations"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEval)"
                        isAnimationActive={!prefersReducedMotion}
                        animationDuration={600}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ============ TOP COUNTRIES + READINESS DISTRIBUTION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Countries */}
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe2 className="size-4 text-primary" /> Top Countries
              </CardTitle>
              <CardDescription>Pipeline volume by country of residence</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPipeline || !derived ? (
                <ChartSkeleton height={260} />
              ) : (
                <div className="space-y-3">
                  {derived.topCountries.map((country, i) => {
                    const max = derived.topCountries[0]?.count || 1;
                    const pct = (country.count / max) * 100;
                    return (
                      <motion.div
                        key={country.country}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.2 }}
                        className="group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{country.flag}</span>
                            <span className="text-sm font-medium">{country.country}</span>
                            {i === 0 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 h-4 bg-primary/10 text-primary border-primary/30"
                              >
                                #1
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold tabular-nums text-sm">{country.count}</span>
                            <span className="text-xs text-muted-foreground">
                              candidates
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 + 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Readiness Distribution */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="size-4 text-primary" /> Readiness Distribution
              </CardTitle>
              <CardDescription>Pool segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPipeline || !derived ? (
                <ChartSkeleton height={220} />
              ) : (
                <>
                  {/* Donut visual built from divs (always renders, no chart-lib quirks) */}
                  <DonutGauge
                    segments={derived.readinessPie.map((p) => ({
                      value: p.value,
                      color: READINESS_COLORS[p.tier] ?? "hsl(var(--muted))",
                      label: p.name,
                    }))}
                    centerNumber={derived.evaluatedTotal}
                    centerLabel="evaluated"
                  />
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4 text-xs">
                    {derived.readinessPie.map((entry) => {
                      const total = derived.readinessPie.reduce(
                        (sum, p) => sum + p.value,
                        0,
                      );
                      const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                      return (
                        <div
                          key={entry.tier}
                          className="flex items-center gap-1.5 min-w-0"
                        >
                          <div
                            className="size-2.5 rounded-sm shrink-0"
                            style={{ backgroundColor: READINESS_COLORS[entry.tier] }}
                          />
                          <span className="text-muted-foreground truncate">
                            {entry.name}
                          </span>
                          <span className="ml-auto flex items-baseline gap-1">
                            <span className="font-semibold tabular-nums">
                              {entry.value}
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                              {pct}%
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============ TOP SKILLS + TRAINING CONVERSION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Skills */}
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="size-4 text-primary" /> Top Skills in Pool
              </CardTitle>
              <CardDescription>Most common skills across registered talent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                {isLoadingPipeline || !derived ? (
                  <ChartSkeleton height={260} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={derived.topSkills}
                      layout="vertical"
                      margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="skill"
                        type="category"
                        stroke="hsl(var(--foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: 8,
                        }}
                        formatter={(value) => [`${value} candidates`, "Count"]}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[0, 6, 6, 0]}
                        barSize={18}
                        isAnimationActive={!prefersReducedMotion}
                        animationDuration={600}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Conversion Opportunity */}
          <Card className="border shadow-sm bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="size-4 text-primary" /> Training Conversion
              </CardTitle>
              <CardDescription>Revenue opportunity from upskilling</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPipeline || !derived ? (
                <ChartSkeleton height={220} />
              ) : (
                <div className="space-y-4">
                  {/* Big number */}
                  <div className="text-center py-3 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-1">
                      Projected ARR Add
                    </div>
                    <div className="text-3xl font-bold text-primary tabular-nums">
                      {fmtCurrency(derived.conversionOpportunity)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      assumes 65% completion · €4.2k / placement
                    </div>
                  </div>

                  {/* Funnel */}
                  <FunnelStage
                    label="In conversion pool"
                    value={derived.conversionPool}
                    pct={100}
                    note="Developing tier"
                  />
                  <FunnelStage
                    label="Projected to convert"
                    value={derived.projectedConversions}
                    pct={65}
                    note="At 65% completion rate"
                    accent
                  />
                  <FunnelStage
                    label="Add to ready pool"
                    value={derived.totalReady + derived.projectedConversions}
                    pct={
                      derived.totalReady + derived.projectedConversions > 0
                        ? Math.round(
                            ((derived.totalReady + derived.projectedConversions) /
                              (pipeline?.totalCandidates || 1)) *
                              100,
                          )
                        : 0
                    }
                    note={`vs ${derived.totalReady} today`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============ ACTIVITY FEED ============ */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Live Platform Activity
              </CardTitle>
              <CardDescription>Real-time stream across registration, AI, training, placements</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Streaming
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-14 bg-muted/30 animate-pulse rounded-lg" />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-2">
                {activities?.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-colors"
                  >
                    <ActivityIcon kind={activity.kind} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-semibold text-sm truncate">
                          {activity.candidateName}
                        </span>
                        <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                          {new Date(activity.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activity.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      </MotionConfig>
    </Shell>
  );
}

// ============================================================
// DONUT GAUGE — pure CSS conic-gradient, no chart library
// ============================================================
function DonutGauge({
  segments,
  centerNumber,
  centerLabel,
}: {
  segments: { value: number; color: string; label: string }[];
  centerNumber: number;
  centerLabel: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  // Build a conic-gradient string with sequential color stops at exact %.
  let cursor = 0;
  const stops: string[] = [];
  segments.forEach((seg) => {
    const start = (cursor / total) * 100;
    cursor += seg.value;
    const end = (cursor / total) * 100;
    stops.push(`${seg.color} ${start}% ${end}%`);
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="flex items-center justify-center py-2">
      <motion.div
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative size-[180px] rounded-full"
        style={{ background: gradient }}
      >
        {/* Inner cutout to make it a donut */}
        <div className="absolute inset-[18%] rounded-full bg-card flex flex-col items-center justify-center shadow-inner">
          <div className="text-3xl font-bold tabular-nums leading-none">
            {centerNumber}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-1">
            {centerLabel}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function HeroMetric({
  label,
  value,
  sub,
  icon: Icon,
  tone,
  loading,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Users;
  tone: "neutral" | "success" | "warning" | "opportunity";
  loading: boolean;
  delay: number;
}) {
  const toneStyles = {
    neutral: {
      iconBg: "bg-muted text-muted-foreground",
      ring: "border",
      eyebrow: "text-muted-foreground",
      value: "text-foreground",
    },
    success: {
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      ring: "border-emerald-500/20 bg-emerald-500/[0.03]",
      eyebrow: "text-emerald-700 dark:text-emerald-400",
      value: "text-foreground",
    },
    warning: {
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      ring: "border-amber-500/20 bg-amber-500/[0.03]",
      eyebrow: "text-amber-700 dark:text-amber-400",
      value: "text-foreground",
    },
    opportunity: {
      iconBg: "bg-primary/15 text-primary",
      ring: "border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background",
      eyebrow: "text-primary",
      value: "text-primary",
    },
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <Card className={`shadow-sm overflow-hidden ${toneStyles.ring}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`size-10 rounded-lg flex items-center justify-center ${toneStyles.iconBg}`}
            >
              <Icon className="size-5" />
            </div>
          </div>
          <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 ${toneStyles.eyebrow}`}>
            {label}
          </div>
          <div className={`text-3xl font-bold tabular-nums ${toneStyles.value} mb-1`}>
            {loading ? <span className="inline-block h-8 w-20 bg-muted animate-pulse rounded" /> : value}
          </div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="w-full bg-muted/20 animate-pulse rounded-md flex items-center justify-center"
      style={{ height }}
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground/50" />
    </div>
  );
}

function FunnelStage({
  label,
  value,
  pct,
  note,
  accent,
}: {
  label: string;
  value: number;
  pct: number;
  note: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <div className="text-xs font-medium">{label}</div>
          <div className="text-[10px] text-muted-foreground">{note}</div>
        </div>
        <div className={`text-lg font-bold tabular-nums ${accent ? "text-primary" : ""}`}>
          {value}
        </div>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${accent ? "bg-primary" : "bg-foreground/40"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ActivityIcon({ kind }: { kind: string }) {
  const map: Record<string, { icon: typeof Users; bg: string; color: string }> = {
    registration: {
      icon: Users,
      bg: "bg-blue-500/10",
      color: "text-blue-600 dark:text-blue-400",
    },
    evaluation: {
      icon: Sparkles,
      bg: "bg-purple-500/10",
      color: "text-purple-600 dark:text-purple-400",
    },
    upskilling: {
      icon: GraduationCap,
      bg: "bg-amber-500/10",
      color: "text-amber-600 dark:text-amber-400",
    },
    placement: {
      icon: ArrowUpRight,
      bg: "bg-emerald-500/10",
      color: "text-emerald-600 dark:text-emerald-400",
    },
  };
  const config = map[kind] ?? {
    icon: Activity,
    bg: "bg-muted",
    color: "text-muted-foreground",
  };
  const Icon = config.icon;
  return (
    <div
      className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}
    >
      <Icon className={`size-4 ${config.color}`} />
    </div>
  );
}
