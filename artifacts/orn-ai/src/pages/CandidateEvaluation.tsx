import { useParams } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCandidate, getGetCandidateQueryKey, useGetEvaluation, getGetEvaluationQueryKey } from "@workspace/api-client-react";
import { Loader2, AlertCircle, Sparkles, TrendingUp, Target, MapPin, CheckCircle2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { motion } from "framer-motion";

export default function CandidateEvaluation() {
  const { id } = useParams<{ id: string }>();

  const { data: candidate, isLoading: isLoadingCandidate } = useGetCandidate(id || "", {
    query: { enabled: !!id, queryKey: getGetCandidateQueryKey(id || "") }
  });

  const { data: evaluation, isLoading: isLoadingEvaluation } = useGetEvaluation(id || "", {
    query: { enabled: !!id, queryKey: getGetEvaluationQueryKey(id || "") }
  });

  if (!id || isLoadingCandidate || isLoadingEvaluation) {
    return (
      <Shell>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  if (!evaluation || !candidate) {
    return (
      <Shell>
        <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
          <AlertCircle className="size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Evaluation Not Found</h2>
          <p className="text-muted-foreground">The AI evaluation has not been completed or encountered an error.</p>
        </div>
      </Shell>
    );
  }

  const radarData = [
    { subject: 'CV Quality', A: evaluation.scores.cvQuality, fullMark: 100 },
    { subject: 'Tech Match', A: evaluation.scores.technicalSkillMatch, fullMark: 100 },
    { subject: 'EU Readiness', A: evaluation.scores.europeJobReadiness, fullMark: 100 },
    { subject: 'Upskilling', A: 100 - evaluation.scores.upskillingNeeds, fullMark: 100 }, // Inverted for radar (higher is better)
    { subject: 'English', A: evaluation.scores.englishReadiness, fullMark: 100 },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'ready': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'developing': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'emerging': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--primary))";
    if (score >= 60) return "hsl(var(--primary) / 0.7)";
    return "hsl(var(--muted-foreground))";
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="size-20 md:size-24 rounded-2xl bg-muted border overflow-hidden shrink-0">
              {candidate.avatarUrl ? (
                <img src={candidate.avatarUrl} alt={candidate.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                  {candidate.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">{candidate.fullName}</h1>
                <Badge variant="outline" className={`uppercase tracking-wider font-bold text-xs ${getTierColor(evaluation.readinessTier)}`}>
                  {evaluation.readinessTier}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg mb-3 flex items-center gap-2">
                {candidate.targetRole} <span className="text-muted-foreground/50">•</span> {candidate.yearsExperience} yrs exp.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal"><MapPin className="size-3 mr-1" /> {candidate.country}</Badge>
                <Badge variant="secondary" className="font-normal">Visa: {candidate.visaStatus.replace(/_/g, ' ')}</Badge>
                <Badge variant="secondary" className="font-normal">English: {candidate.englishLevel}</Badge>
                {candidate.euWorkEligible && <Badge variant="secondary" className="font-normal bg-green-500/10 text-green-700">EU Work Eligible</Badge>}
              </div>
            </div>
          </div>
          
          <div className="bg-background border rounded-xl p-5 flex items-center gap-6 min-w-[240px]">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Overall Score</div>
              <div className="text-4xl font-bold text-foreground">
                {evaluation.scores.overall}<span className="text-xl text-muted-foreground font-normal">/100</span>
              </div>
            </div>
            <div className="h-16 w-16 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  className="text-muted/30"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-primary"
                  strokeDasharray={`${evaluation.scores.overall}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-muted shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="size-5 text-primary" /> Dimension Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Candidate" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4 mt-2">
                  {[
                    { label: "Technical Fit", score: evaluation.scores.technicalSkillMatch },
                    { label: "CV Quality", score: evaluation.scores.cvQuality },
                    { label: "EU Readiness", score: evaluation.scores.europeJobReadiness },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">{item.score}/100</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" /> Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {evaluation.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Deep Dive */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-muted shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">AI Generated Insights</CardTitle>
                <CardDescription>Detailed analysis of candidate profile and readiness.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {evaluation.insights.map((insight, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4 p-4 rounded-xl border bg-muted/20"
                  >
                    <div className="shrink-0 mt-1">
                      {insight.severity === 'strength' && <div className="size-2.5 rounded-full bg-green-500 mt-1"></div>}
                      {insight.severity === 'opportunity' && <div className="size-2.5 rounded-full bg-blue-500 mt-1"></div>}
                      {insight.severity === 'gap' && <div className="size-2.5 rounded-full bg-orange-500 mt-1"></div>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1">{insight.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{insight.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-muted shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="size-5 text-orange-500" /> Identified Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evaluation.gaps.length > 0 ? (
                    <ul className="space-y-3">
                      {evaluation.gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                          <span className="text-muted-foreground">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No significant gaps identified.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-muted shadow-sm bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" /> Recommended Upskilling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evaluation.recommendedUpskilling.length > 0 ? (
                    <ul className="space-y-3">
                      {evaluation.recommendedUpskilling.map((skill, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-medium">
                          <div className="size-6 rounded-md bg-background border flex items-center justify-center text-xs shrink-0 text-muted-foreground">
                            {i+1}
                          </div>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Candidate is ready. No immediate upskilling required.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}