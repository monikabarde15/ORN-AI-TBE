import { Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Presentation,
  UserPlus,
  LayoutDashboard,
  SearchX,
  FileWarning,
  Hourglass,
  ClipboardCheck,
  Brain,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useListRegions, getListRegionsQueryKey, useRecruiterSummary, getRecruiterSummaryQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";

const PROBLEMS = [
  {
    icon: SearchX,
    title: "Hidden talent, noisy signals",
    desc: "Strong CEE engineers stay invisible behind unstructured CVs, inconsistent titles, and language barriers — recruiters waste cycles on lookalikes.",
  },
  {
    icon: FileWarning,
    title: "No standardized readiness signal",
    desc: "Every employer re-runs the same interview gauntlet because there is no trusted, comparable score for technical, English, and EU-job readiness.",
  },
  {
    icon: Hourglass,
    title: "Slow, expensive sourcing cycles",
    desc: "Tier-1 recruiters spend weeks shortlisting per role across 8 countries — and still ship offers to candidates who weren't actually ready.",
  },
];

const SOLUTION_STEPS = [
  {
    icon: ClipboardCheck,
    label: "Assess",
    desc: "Standardized intake of profiles, CVs, work eligibility, and language across every CEE jurisdiction.",
  },
  {
    icon: Brain,
    label: "Score",
    desc: "AI evaluation across 5 dimensions: CV quality, technical skills, English, EU job readiness, upskilling needs.",
  },
  {
    icon: GraduationCap,
    label: "Upskill",
    desc: "Targeted upskilling pathways close the exact gaps that block each candidate from a Tier-1 offer.",
  },
  {
    icon: Sparkles,
    label: "Prepare",
    desc: "Recruiter-ready, scored, and matched — delivered into your CRM with a single source of truth.",
  },
];

export default function Landing() {
  const { data: regions } = useListRegions({
    query: { queryKey: getListRegionsQueryKey() },
  });
  const { data: summary } = useRecruiterSummary({
    query: { queryKey: getRecruiterSummaryQueryKey() },
  });

  return (
    <Shell>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[linear-gradient(to_right,_rgba(0,0,0,0.04)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(0,0,0,0.04)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,_black,_transparent)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Phase 1 live across 8 CEE countries
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-primary">AI-enabled talent infrastructure</span>
              <br />
              for Eastern & Central Europe.
            </h1>

            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ORN-AI assesses, scores, upskills, and prepares CEE tech & operations talent — delivering recruiter-ready candidates to Tier-1 European employers.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-7 text-base font-semibold gap-2">
                  <UserPlus className="size-4" /> Register as Candidate
                </Button>
              </Link>
              <Link href="/recruiter">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-7 text-base font-semibold gap-2">
                  <LayoutDashboard className="size-4" /> View Recruiter Dashboard
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 px-7 text-base font-semibold gap-2 text-primary hover:text-primary hover:bg-primary/10">
                  <Presentation className="size-4" /> View Investor Demo
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Live metrics strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border rounded-2xl border bg-background/60 backdrop-blur shadow-sm">
              {[
                { value: summary?.totalCandidates ?? "—", label: "Candidates assessed" },
                { value: summary?.readyCandidates ?? "—", label: "Recruiter-ready" },
                { value: `${summary?.avgReadiness ?? "—"}`, label: "Avg readiness score" },
                { value: "8", label: "Active CEE markets" },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-5 text-center">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="py-24 border-t bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">The Problem</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Employers struggle to identify recruiter-ready talent.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              CEE has Europe's deepest under-tapped engineering pool — but no shared infrastructure to surface, score, and qualify it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className="bg-background rounded-xl p-7 border shadow-sm h-full"
              >
                <div className="size-11 rounded-lg bg-destructive/10 flex items-center justify-center mb-5">
                  <p.icon className="size-5 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SOLUTION ============ */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">The Solution</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              ORN-AI assesses, scores, upskills, and prepares.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              One infrastructure layer that turns raw CEE talent into a standardized, comparable, recruiter-ready feed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            {/* connecting line on lg+ */}
            <div className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />
            {SOLUTION_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-background rounded-xl p-6 border shadow-sm flex flex-col"
              >
                <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground/60">
                  0{i + 1}
                </div>
                <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-md shadow-primary/20">
                  <step.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Outcomes row */}
          <div className="mt-16 max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
            {[
              "5-dimension AI scoring",
              "Standardized readiness tiers",
              "Live recruiter pipeline",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-5 py-4 rounded-lg border bg-muted/30">
                <CheckCircle2 className="size-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REGIONS ============ */}
      <section className="py-24 border-t bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Coverage</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for CEE today, Southern Europe next.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Phase 1 is live across 8 high-potential markets. Phase 2 brings 4 Mediterranean economies online.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Phase 1 */}
            <div className="bg-background rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-2.5 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-semibold">Phase 1 — Active</h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">8 markets</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {(regions?.phase1 ?? Array.from({ length: 8 }).map((_, i) => ({ code: `--${i}`, name: "Loading…", flag: "" }))).map((r) => (
                  <div
                    key={r.code}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border bg-background hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="size-7 rounded-md border bg-muted/40 flex items-center justify-center text-[11px] font-mono font-bold tracking-wider text-foreground/70">
                        {r.flag}
                      </span>
                      <span className="font-medium text-sm truncate">{r.name}</span>
                    </div>
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-background rounded-2xl border border-dashed shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-2.5 rounded-full bg-muted-foreground/40" />
                  <h3 className="font-semibold">Phase 2 — Expansion</h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">4 markets · planned</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {(regions?.phase2 ?? Array.from({ length: 4 }).map((_, i) => ({ code: `--p2-${i}`, name: "Loading…", flag: "" }))).map((r) => (
                  <div
                    key={r.code}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-dashed bg-muted/10 opacity-90"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="size-7 rounded-md border border-dashed bg-background flex items-center justify-center text-[11px] font-mono font-bold tracking-wider text-muted-foreground">
                        {r.flag}
                      </span>
                      <span className="font-medium text-sm truncate text-muted-foreground">{r.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 border-t bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,_rgba(255,255,255,0.06),_transparent)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            Scale your European talent pipeline.
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you're a candidate, a Tier-1 recruiter, or evaluating ORN-AI as an investor — start here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-7 text-base font-semibold gap-2">
                <UserPlus className="size-4" /> Register as Candidate
              </Button>
            </Link>
            <Link href="/recruiter">
              <Button size="lg" variant="outline" className="h-12 px-7 text-base font-semibold gap-2 bg-transparent text-background border-background/30 hover:bg-background/10 hover:text-background">
                <LayoutDashboard className="size-4" /> View Recruiter Dashboard
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="h-12 px-7 text-base font-semibold gap-2 text-background hover:bg-background/10 hover:text-background">
                <Presentation className="size-4" /> View Investor Demo
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
