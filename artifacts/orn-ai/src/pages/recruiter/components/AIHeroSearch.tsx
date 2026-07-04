// src/pages/recruiter/components/AIHeroSearch.tsx

import { Sparkles, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIHeroSearchProps } from "../types";
import AISearchSuggestions from "./AISearchSuggestions";

export default function AIHeroSearch({
  value,
  loading,
  onChange,
  onSearch,
}: AIHeroSearchProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-background shadow-xl">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10" />

      <div className="relative z-10 p-10">

        <div className="mx-auto max-w-5xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-primary font-semibold">

            <Sparkles className="h-4 w-4" />

            AI Talent Search

          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">

            Find Perfect Candidates
            <br />

            using AI

          </h1>

          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">

            Search candidates using natural language.

            AI will match the best candidates based on skills,
            experience, technologies and readiness score.

          </p>

          {/* Search */}

          <div className="mt-10 flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Find React Developers with AWS & 5+ Years Experience..."
                className="h-16 rounded-2xl pl-14 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
              />

            </div>

            <Button
              size="lg"
              disabled={loading}
              onClick={onSearch}
              className="h-16 rounded-2xl px-10 text-lg bg-blue-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />

                  Search with AI
                </>
              )}
            </Button>

          </div>
          <AISearchSuggestions
            onSelect={(value) => onChange(value)}
            />

        </div>

      </div>
      
    </div>
  );
}