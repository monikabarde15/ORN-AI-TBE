import { Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Globe, ShieldCheck, Zap, Database, Presentation } from "lucide-react";
import { useListRegions, getListRegionsQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { data: regions, isLoading } = useListRegions({
    query: { queryKey: getListRegionsQueryKey() }
  });

  return (
    <Shell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Phase 1 Expansion Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
              Building Eastern & Central Europe's next-generation <span className="text-primary">AI-enabled talent infrastructure</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The unified platform for sourcing, evaluating, and upskilling tech & operations talent across CEE. Built for Tier-1 recruiters and EU enterprises.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  Join Talent Pool <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                  <Presentation className="mr-2 size-4" />
                  View Investor Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">One infrastructure.<br/>Four core modules.</h2>
            <p className="mt-4 text-muted-foreground text-lg">We digitize and score the entire candidate lifecycle, providing standardized, reliable data to European enterprises.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Database className="size-6 text-primary" />,
                title: "Candidate Intake",
                desc: "Standardized ingestion of profiles, CVs, and work eligibility across multiple jurisdictions.",
                link: "/register"
              },
              {
                icon: <Zap className="size-6 text-primary" />,
                title: "AI Scoring Engine",
                desc: "Multi-dimensional evaluation covering technical fit, English readiness, and EU job readiness.",
                link: "/candidate/mock/upload" // Mock link for demo purposes
              },
              {
                icon: <Globe className="size-6 text-primary" />,
                title: "Recruiter Access",
                desc: "Dense, scannable data views for Tier-1 recruiters to filter and match evaluated talent.",
                link: "/recruiter"
              },
              {
                icon: <ShieldCheck className="size-6 text-primary" />,
                title: "Admin Pipeline",
                desc: "Macro-level insights into regional talent pools, upskilling metrics, and platform velocity.",
                link: "/admin"
              }
            ].map((module, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-6 border shadow-sm flex flex-col h-full"
              >
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  {module.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">{module.desc}</p>
                <Link href={module.link} className="inline-flex items-center text-sm font-medium text-primary hover:underline mt-auto">
                  Explore Module <ChevronRight className="ml-1 size-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Regional Coverage</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Targeting high-potential engineering and operations hubs across Eastern, Central, and Southern Europe.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Phase 1 (Active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-muted-foreground/30"></div>
                  <span className="text-sm font-medium">Phase 2 (Planned)</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8 w-full">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="h-6 w-32 bg-muted rounded"></div>
                    <div className="space-y-2">
                      {Array(5).fill(0).map((_, j) => <div key={j} className="h-10 bg-muted rounded"></div>)}
                    </div>
                  </div>
                ))
              ) : regions ? (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="size-2 rounded-full bg-primary"></div>
                      Phase 1
                    </h3>
                    <ul className="space-y-2">
                      {regions.phase1.map(region => (
                        <li key={region.code} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{region.flag}</span>
                            <span className="font-medium">{region.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{region.code}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="size-2 rounded-full bg-muted-foreground/30"></div>
                      Phase 2
                    </h3>
                    <ul className="space-y-2">
                      {regions.phase2.map(region => (
                        <li key={region.code} className="flex items-center justify-between p-3 rounded-lg border border-dashed bg-muted/10 opacity-70">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{region.flag}</span>
                            <span className="font-medium">{region.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{region.code}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to scale your European pipeline?</h2>
          <p className="text-muted/80 text-lg max-w-2xl mx-auto mb-10">
            Join the infrastructural layer powering Tier-1 European tech recruiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                <Presentation className="mr-2 size-4" />
                Start Investor Demo
              </Button>
            </Link>
            <Link href="/recruiter">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base text-foreground border-border hover:bg-muted">
                Access Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}