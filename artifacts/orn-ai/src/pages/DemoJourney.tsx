import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRunDemoJourney } from "@workspace/api-client-react";
import { Play, Loader2, CheckCircle2, ArrowRight, Server, BrainCircuit, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoJourney() {
  const [isStarted, setIsStarted] = useState(false);
  const runDemoMutation = useRunDemoJourney();

  const handleStartDemo = () => {
    setIsStarted(true);
    runDemoMutation.mutate(undefined);
  };

  const getStepIcon = (index: number) => {
    switch(index) {
      case 0: return <Server className="size-6" />;
      case 1: return <Server className="size-6" />;
      case 2: return <BrainCircuit className="size-6" />;
      case 3: return <Search className="size-6" />;
      default: return <CheckCircle2 className="size-6" />;
    }
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[80vh] flex flex-col">
        {!isStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Badge variant="outline" className="mb-6 px-3 py-1 text-sm bg-primary/5 text-primary border-primary/20">Investor Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Experience the Pipeline
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12">
              Watch a simulated candidate flow through the ORN-AI infrastructure — from initial registration to AI scoring and recruiter matching.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" onClick={handleStartDemo}>
              <Play className="mr-2 size-5 fill-current" /> Start Live Demo
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Simulated Talent Ingestion</h2>
              <p className="text-muted-foreground">Running end-to-end data flow visualization.</p>
            </div>

            <div className="space-y-6">
              {runDemoMutation.isPending && (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Initializing simulation sequence...</p>
                  </div>
                </div>
              )}

              {runDemoMutation.isSuccess && runDemoMutation.data && (
                <>
                  <div className="grid gap-4">
                    {runDemoMutation.data.steps.map((step, index) => {
                      const isActive = step.status === 'active';
                      const isDone = step.status === 'done';
                      
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.4 }}
                          key={index}
                        >
                          <Card className={`border-l-4 transition-all duration-500 ${
                            isActive ? 'border-l-primary bg-primary/5 shadow-md scale-[1.02]' : 
                            isDone ? 'border-l-green-500 bg-muted/20 opacity-70' : 
                            'border-l-muted bg-background opacity-40'
                          }`}>
                            <CardContent className="p-6 flex items-center gap-6">
                              <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-primary text-primary-foreground animate-pulse' :
                                isDone ? 'bg-green-500 text-white' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {isDone ? <CheckCircle2 className="size-6" /> : getStepIcon(index)}
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-semibold text-lg ${isActive ? 'text-primary' : ''}`}>
                                  {step.label}
                                </h3>
                                <p className="text-muted-foreground text-sm mt-1">{step.detail}</p>
                              </div>
                              <div className="shrink-0 font-mono text-xs text-muted-foreground">
                                {isDone ? '200 OK' : isActive ? 'PROCESSING...' : 'PENDING'}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    className="mt-12 p-8 bg-muted/30 border rounded-2xl text-center"
                  >
                    <div className="size-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Simulation Complete</h3>
                    <p className="text-muted-foreground mb-8">
                      Candidate <span className="font-semibold text-foreground">{runDemoMutation.data.candidate.fullName}</span> has been successfully processed, scored, and added to the searchable talent pool.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Link href={`/candidate/${runDemoMutation.data.candidate.id}/evaluation`}>
                        <Button variant="outline" className="gap-2">
                          View AI Profile
                        </Button>
                      </Link>
                      <Link href="/recruiter">
                        <Button className="gap-2">
                          View in Recruiter CRM <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}