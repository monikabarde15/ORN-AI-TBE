import { Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { HeroSection } from "@/components/layout/HeroSection";
import { VideoSection } from "@/components/layout/VideoSection";
import { LearningSection } from "@/components/layout/LearningSection";
import { CourseGrid } from "@/components/layout/CourseGrid";
import { TalentInfrastructure } from "@/components/layout/TalentInfrastructure";
import { SolutionTimeline } from "@/components/layout/SolutionTimeline";


import { Button } from "@/components/ui/button";
import {
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
   <>
    <Shell>
      <HeroSection />
      <VideoSection />
      <LearningSection />
      <CourseGrid />
      <TalentInfrastructure />
      <SolutionTimeline />
      </Shell>
    </>
  );
}
