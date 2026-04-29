import { useState } from "react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruiterSummary, getRecruiterSummaryQueryKey, useListCandidates, getListCandidatesQueryKey, useListRegions, getListRegionsQueryKey, useListRoles, getListRolesQueryKey } from "@workspace/api-client-react";
import { Search, Filter, Users, Star, TrendingUp, Clock, ChevronRight, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // We'll assume this exists or create a simple fallback

export default function RecruiterDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  // Simple debounce inline for the demo
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [filters, setFilters] = useState({
    country: "",
    role: "",
    minReadiness: "",
    englishLevel: ""
  });

  const { data: summary, isLoading: isLoadingSummary } = useRecruiterSummary({
    query: { queryKey: getRecruiterSummaryQueryKey() }
  });

  const { data: regions } = useListRegions({ query: { queryKey: getListRegionsQueryKey() } });
  const { data: roles } = useListRoles({ query: { queryKey: getListRolesQueryKey() } });

  const queryParams = {
    search: debouncedSearch || undefined,
    country: filters.country || undefined,
    role: filters.role || undefined,
    minReadiness: filters.minReadiness ? parseInt(filters.minReadiness) : undefined,
    englishLevel: filters.englishLevel || undefined,
  };

  const { data: candidates, isLoading: isLoadingCandidates } = useListCandidates(queryParams, {
    query: { queryKey: getListCandidatesQueryKey(queryParams) }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Simple timeout debounce
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const getTierColor = (score: number) => {
    if (score >= 90) return 'bg-purple-500/10 text-purple-600 border-purple-200';
    if (score >= 75) return 'bg-green-500/10 text-green-600 border-green-200';
    if (score >= 60) return 'bg-blue-500/10 text-blue-600 border-blue-200';
    return 'bg-orange-500/10 text-orange-600 border-orange-200';
  };

  const getTierLabel = (score: number) => {
    if (score >= 90) return 'Elite';
    if (score >= 75) return 'Ready';
    if (score >= 60) return 'Developing';
    return 'Emerging';
  };

  return (
    <Shell>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Talent Search</h1>
            <p className="text-muted-foreground mt-1">Source AI-evaluated tech talent across CEE.</p>
          </div>
          <Button className="gap-2">
            <Filter className="size-4" /> Save Search
          </Button>
        </div>

        {/* Summary Metrics */}
        {isLoadingSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <Card key={i} className="h-28 animate-pulse bg-muted/50" />)}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-muted shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pool</p>
                  <Users className="size-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">{summary.totalCandidates.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="border-muted shadow-sm bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">Ready Talent</p>
                  <Star className="size-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{summary.readyCandidates.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="border-muted shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Readiness</p>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">{summary.avgReadiness}/100</div>
              </CardContent>
            </Card>
            <Card className="border-muted shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">New This Week</p>
                  <Clock className="size-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">+{summary.newThisWeek}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Filters & Search */}
        <Card className="mb-8 border-muted shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, skills, or keywords..." 
                className="pl-9 bg-muted/20"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 md:w-auto w-full">
              <Select value={filters.role} onValueChange={(val) => setFilters(f => ({ ...f, role: val === "all" ? "" : val }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Any Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Role</SelectItem>
                  {roles?.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={filters.country} onValueChange={(val) => setFilters(f => ({ ...f, country: val === "all" ? "" : val }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Location</SelectItem>
                  {regions?.phase1.map(r => <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>)}
                  {regions?.phase2.map(r => <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filters.minReadiness} onValueChange={(val) => setFilters(f => ({ ...f, minReadiness: val === "0" ? "" : val }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Any Readiness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Readiness</SelectItem>
                  <SelectItem value="90">Elite (90+)</SelectItem>
                  <SelectItem value="75">Ready (75+)</SelectItem>
                  <SelectItem value="60">Developing (60+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidate List */}
        <div>
          {isLoadingCandidates ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => <Card key={i} className="h-24 animate-pulse bg-muted/30" />)}
            </div>
          ) : candidates?.length === 0 ? (
            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
              <Search className="size-10 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No candidates found</h3>
              <p className="text-muted-foreground">Adjust your filters to see more results.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates?.map((candidate) => {
                const overallScore = candidate.evaluation?.scores.overall || 0;
                const flag = regions ? [...regions.phase1, ...regions.phase2].find(r => r.code === candidate.country)?.flag : "";

                return (
                  <Link key={candidate.id} href={`/candidate/${candidate.id}/evaluation`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm border-muted">
                      <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="size-12 rounded-full bg-muted border overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground font-medium">
                            {candidate.avatarUrl ? (
                              <img src={candidate.avatarUrl} alt={candidate.fullName} className="w-full h-full object-cover" />
                            ) : (
                              candidate.fullName.charAt(0)
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                {candidate.fullName}
                              </h3>
                              <span className="text-sm" title={candidate.country}>{flag}</span>
                              {candidate.euWorkEligible && <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal bg-green-50 text-green-700 border-green-200">EU</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {candidate.targetRole} <span className="mx-1">•</span> {candidate.yearsExperience}y exp <span className="mx-1">•</span> English {candidate.englishLevel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          {candidate.evaluation ? (
                            <div className="hidden sm:flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{overallScore}</span>
                                <span className="text-xs text-muted-foreground">/100</span>
                              </div>
                              <Badge variant="outline" className={`text-[10px] h-5 px-1.5 uppercase font-bold border ${getTierColor(overallScore)}`}>
                                {getTierLabel(overallScore)}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground font-normal">Evaluating</Badge>
                          )}
                          <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                        
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}