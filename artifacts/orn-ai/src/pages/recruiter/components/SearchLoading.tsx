import { Loader2, Sparkles } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="rounded-3xl border bg-background shadow-lg p-12 mt-8">

      <div className="flex flex-col items-center">

        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">

          <Loader2 className="h-10 w-10 animate-spin text-primary" />

        </div>

        <div className="mt-8 flex items-center gap-2 text-primary font-semibold">

          <Sparkles className="h-5 w-5" />

          AI is searching candidates...

        </div>

        <h2 className="mt-4 text-2xl font-bold">

          Finding Best Matches

        </h2>

        <p className="mt-2 text-center text-muted-foreground max-w-xl">

          Please wait while AI analyzes candidate profiles,
          compares skills, experience, technologies and
          readiness score.

        </p>

        <div className="mt-10 w-full max-w-xl">

          <div className="h-2 rounded-full bg-muted overflow-hidden">

            <div className="h-full w-1/2 bg-primary animate-pulse rounded-full" />

          </div>

        </div>

      </div>

    </div>
  );
}