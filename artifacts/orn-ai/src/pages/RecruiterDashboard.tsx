// artifacts\orn-ai\src\pages\RecruiterDashboard.tsx
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AIHeroSearch from "./recruiter/components/AIHeroSearch";
import SearchLoading from "./recruiter/components/SearchLoading";
import CandidateFilters from "./recruiter/components/CandidateFilters";
import { History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useRecruiterSummary,
  getRecruiterSummaryQueryKey,
  useListCandidates,
  getListCandidatesQueryKey,
  useListRegions,
  getListRegionsQueryKey,
  useListRoles,
  getListRolesQueryKey,
  useShortlistCandidate,
  useMarkClientReady,
  getDownloadMaskedCvUrl,
  type Candidate,
} from "@workspace/api-client-react";
import api from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Users,
  Star,
  TrendingUp,
  Clock,
  Loader2,
  X,
  ArrowUpDown,
  CheckCircle2,
  GraduationCap,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  Briefcase,
  Languages,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Sparkles,
  FileText,
  ArrowRight,
  Target,
  Cpu,
  Globe2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCandidateStatuses,
  STATUS_META,
  type CandidateStatus,
} from "@/hooks/use-candidate-status";

// ============================================================
// Helpers
// ============================================================
function getReadinessLabel(score: number) {
  if (score >= 75)
    return {
      label: "Recruiter Ready",
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    };
  if (score >= 55)
    return {
      label: "Needs Upskilling",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    };
  return {
    label: "Not Ready Yet",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
  };
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 65) return "text-primary";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-primary";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

// Debounce hook
function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ============================================================
// Sort
// ============================================================
type SortField = "name" | "score" | "experience" | "status" | "country";
type SortDir = "asc" | "desc";

// ============================================================
// Filter / status types
// ============================================================
type StatusFilter = CandidateStatus | "all" | "none";

// ============================================================
// MAIN
// ============================================================
export default function RecruiterDashboard() {
  const [, setLocation] = useLocation();
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiCandidates, setAiCandidates] = useState<Candidate[]>([]);

const handleAISearch = async () => {
  try {
    setSearching(true);

    const res = await api.post("/api/recruiter/ai-search", {
      query: searchTerm,
    });

    console.log("AI RESPONSE =", res.data);
    console.log("AI LENGTH =", res.data.data.length);

    setAiCandidates(res.data.data);
    setSearched(true);
  } finally {
    setSearching(false);
  }
};

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    country: "",
    role: "",
    minReadiness: "",
    englishLevel: "",
    statusFilter: "all" as StatusFilter,
  });

  const [experience, setExperience] = useState<[number, number]>([0, 20]);
  const debouncedExperience = useDebounce(experience, 250);

  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: "score",
    dir: "desc",
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { statuses, setStatus } = useCandidateStatuses();
  const qc = useQueryClient();

  const shortlistMut = useShortlistCandidate({
    mutation: {
      onSuccess: (_d, vars) => {
        qc.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
        qc.invalidateQueries({ queryKey: getRecruiterSummaryQueryKey() });
        const cand = candidates?.find((c) => c.id === vars.id);
        toast.success(
          `${cand?.fullName ?? "Candidate"} ${vars.data.shortlisted ? "shortlisted" : "removed from shortlist"}`,
        );
      },
      onError: (err) =>
        toast.error("Could not update shortlist", {
          description: (err as Error).message,
        }),
    },
  });

  const clientReadyMut = useMarkClientReady({
    mutation: {
      onSuccess: (_d, vars) => {
        qc.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
        qc.invalidateQueries({ queryKey: getRecruiterSummaryQueryKey() });
        const cand = candidates?.find((c) => c.id === vars.id);
        toast.success(
          `${cand?.fullName ?? "Candidate"} ${vars.data.clientReady ? "marked client-ready" : "unmarked client-ready"}`,
        );
      },
      onError: (err) =>
        toast.error("Could not update client-ready flag", {
          description: (err as Error).message,
        }),
    },
  });

  const { data: summary, isLoading: isLoadingSummary } = useRecruiterSummary({
    query: { queryKey: getRecruiterSummaryQueryKey() },
  });

  const { data: regions } = useListRegions({
    query: { queryKey: getListRegionsQueryKey() },
  });
  const { data: roles } = useListRoles({
    query: { queryKey: getListRolesQueryKey() },
  });

  const queryParams = {
  country: filters.country || undefined,
  role: filters.role || undefined,
  minReadiness: filters.minReadiness
    ? parseInt(filters.minReadiness)
    : undefined,
  englishLevel: filters.englishLevel || undefined,
  experienceMin:
    debouncedExperience[0] > 0
      ? debouncedExperience[0]
      : undefined,
  experienceMax:
    debouncedExperience[1] < 20
      ? debouncedExperience[1]
      : undefined,
};

  const { data: candidates, isLoading: isLoadingCandidates } = useListCandidates(
    queryParams,
    { query: { queryKey: getListCandidatesQueryKey(queryParams) } },
  );
console.log("NORMAL DATA =", candidates);
  // Apply status filter + sort client-side
const displaySource = useMemo(() => {
  console.log("searched =", searched);
  console.log("aiCandidates =", aiCandidates.length);
  console.log("normalCandidates =", candidates?.length);

  if (searched && aiCandidates.length > 0) {
    return aiCandidates;
  }

  return candidates ?? [];
}, [searched, aiCandidates, candidates]);
  
const filteredCandidates = useMemo(() => {
  let data = [...displaySource];

  if (filters.country) {
    data = data.filter((c) => c.country === filters.country);
  }

  if (filters.role) {
    data = data.filter(
      (c) =>
        (c.targetRole ?? c.currentRole ?? "")
          .toLowerCase()
          .includes(filters.role.toLowerCase())
    );
  }

  if (filters.englishLevel) {
    data = data.filter(
      (c) => c.englishLevel === filters.englishLevel
    );
  }

  if (filters.minReadiness) {
    data = data.filter(
      (c) =>
        (c.evaluation?.scores?.overall ?? 0) >=
        Number(filters.minReadiness)
    );
  }

  if (experience[0] > 0) {
    data = data.filter(
      (c) => c.yearsExperience >= experience[0]
    );
  }

  // Highest experience first
  data.sort(
    (a, b) => b.yearsExperience - a.yearsExperience
  );

  return data;
}, [displaySource, filters, experience]);

  const selectedCandidate = useMemo(
  () =>
    filteredCandidates.find((c) => c.id === selectedId) ??
    displaySource.find((c) => c.id === selectedId) ??
    null,
  [filteredCandidates, displaySource, selectedId]
);
  const allCountries = useMemo(
    () => (regions ? [...regions.phase1, ...regions.phase2] : []),
    [regions],
  );

  // ---- Status counters for chips ----
  const statusCounts = useMemo(() => {
    const counts = { shortlisted: 0, needs_training: 0, not_suitable: 0, none: 0 };
    candidates?.forEach((c) => {
      const s = statuses[c.id];
      if (s) counts[s]++;
      else counts.none++;
    });
    return counts;
  }, [candidates, statuses]);

  const handleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: field === "score" || field === "experience" ? "desc" : "asc" },
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      country: "",
      role: "",
      minReadiness: "",
      englishLevel: "",
      statusFilter: "all",
    });
    setExperience([0, 20]);
  };
console.log("filteredCandidates===",filteredCandidates);
  const hasActiveFilters =
    !!searchTerm ||
    !!filters.country ||
    !!filters.role ||
    !!filters.minReadiness ||
    !!filters.englishLevel ||
    filters.statusFilter !== "all" ||
    experience[0] !== 0 ||
    experience[1] !== 20;

  // ---- Status actions ----
  const handleStatusChange = (
    id: string,
    next: CandidateStatus | null,
    name?: string,
  ) => {
    setStatus(id, next);
    if (next === "shortlisted") {
      toast.success(`${name ?? "Candidate"} recommended for client`, {
        description: "Added to your shortlist queue.",
      });
    } else if (next === "needs_training") {
      toast.success(`${name ?? "Candidate"} sent to upskilling track`, {
        description: "12-week pathway will be assigned by the academy team.",
      });
    } else if (next === "not_suitable") {
      toast(`${name ?? "Candidate"} marked as not suitable`, {
        description: "Removed from active recruiter views.",
      });
    } else {
      toast(`${name ?? "Candidate"} status cleared`);
    }
  };

  // ============================================================
  return (
    <Shell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ====== Header ====== */}
        <AIHeroSearch
          value={searchTerm}
          loading={loading}
          onChange={setSearchTerm}
          onSearch={handleAISearch}
        />
          {/* {loading && <SearchLoading />} */}
          {searching && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 w-[500px]">
                <SearchLoading />
              </div>
            </div>
          )}
        <br/>
      

        {/* ====== Status pipeline chips ====== */}
        {/* {searched && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Pipeline:
          </span>
          <PipelineChip
            label="All"
            count={candidates?.length ?? 0}
            active={filters.statusFilter === "all"}
            onClick={() => setFilters((f) => ({ ...f, statusFilter: "all" }))}
          />
          <PipelineChip
            label="Shortlisted"
            count={statusCounts.shortlisted}
            active={filters.statusFilter === "shortlisted"}
            onClick={() => setFilters((f) => ({ ...f, statusFilter: "shortlisted" }))}
            dotClass="bg-emerald-500"
          />
          <PipelineChip
            label="Needs Training"
            count={statusCounts.needs_training}
            active={filters.statusFilter === "needs_training"}
            onClick={() => setFilters((f) => ({ ...f, statusFilter: "needs_training" }))}
            dotClass="bg-amber-500"
          />
          <PipelineChip
            label="Not Suitable"
            count={statusCounts.not_suitable}
            active={filters.statusFilter === "not_suitable"}
            onClick={() => setFilters((f) => ({ ...f, statusFilter: "not_suitable" }))}
            dotClass="bg-rose-500"
          />
          <PipelineChip
            label="Unreviewed"
            count={statusCounts.none}
            active={filters.statusFilter === "none"}
            onClick={() => setFilters((f) => ({ ...f, statusFilter: "none" }))}
            dotClass="bg-muted-foreground/40"
          />
        </div>
        )} */}


        {/* ====== Filters ====== */}
         {searched && (
        <Card className="mb-6 border shadow-sm">
         
            <CandidateFilters
              filters={filters}
              experience={experience}
              roles={roles || []}
              regions={allCountries}
              onChange={(key, value) =>
                setFilters((prev) => ({
                  ...prev,
                  [key]: value,
                }))
              }
              onExperienceChange={setExperience}
            />
          
        </Card>
        )}

        {/* ====== Table ====== */}
        {searched && (
        <Card className="border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
            <div className="text-sm">
              <span className="font-semibold">{filteredCandidates.length}</span>
              <span className="text-muted-foreground"> candidate{filteredCandidates.length !== 1 ? "s" : ""}</span>
              {candidates && filteredCandidates.length !== candidates.length && (
                <span className="text-muted-foreground"> of {displaySource.length}</span>
              )}
            </div>
            {isLoadingCandidates && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>

         {!searched ? (
          <div className="py-20 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">
              Search Candidates
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
                Enter your requirement and click Search to view candidates.
              </p>

              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/recruiter-history")}
                  className="gap-2"
                >
                  <History className="h-4 w-4" />
                  View History
                </Button>
              </div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="py-20 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">
              No candidates found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try another search.
            </p>
          </div>
        ) : (

            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableHead>Candidate ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Readiness</TableHead>
                        <TableHead>Salary Expectation</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((c) => (
                      <TableRow key={c.id}>
                       <TableCell className="font-medium">
                          {c.id.slice(0, 8).toUpperCase()}
                        </TableCell>

                        <TableCell>
                          {c.targetRole || c.currentRole || "-"}
                        </TableCell>

                        <TableCell>
                          {c.yearsExperience} Years
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              (c.evaluation?.scores?.overall ?? 0) >= 80
                                ? "bg-green-100 text-green-700 border-green-300"
                                : (c.evaluation?.scores?.overall ?? 0) >= 60
                                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            }
                          >
                            {c.evaluation?.scores?.overall ?? 0}/100
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {c.expectedSalary || "-"}
                        </TableCell>

                        <TableCell>
                          {c.availability || "-"}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => setSelectedId(c.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
            </div>
          )}
        </Card>
        )}
      </div>

      {/* ====== Detail sheet ====== */}
      <CandidateDetailSheet
        candidate={selectedCandidate}
        currentStatus={selectedCandidate ? statuses[selectedCandidate.id] : undefined}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
        countryFlag={
          selectedCandidate
            ? allCountries.find((r) => r.code === selectedCandidate.country)?.flag ?? ""
            : ""
        }
      />
    </Shell>
  );
}

// ============================================================
// Sub-components
// ============================================================

function SummaryStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  accent?: boolean;
}) {
  return (
    <Card
      className={`border shadow-sm ${accent ? "bg-primary/5 border-primary/20" : ""}`}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-primary" : "text-muted-foreground"}`}
          >
            {label}
          </p>
          <Icon className={`size-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className={`text-2xl font-bold tabular-nums ${accent ? "text-primary" : ""}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineChip({
  label,
  count,
  active,
  onClick,
  dotClass,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground border-border hover:border-foreground/40"
      }`}
    >
      {dotClass && <span className={`size-1.5 rounded-full ${dotClass}`} />}
      <span>{label}</span>
      <span
        className={`tabular-nums px-1.5 py-0 rounded text-[10px] ${
          active ? "bg-background/20" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function SortHeader({
  field,
  sort,
  onSort,
  children,
}: {
  field: SortField;
  sort: { field: SortField; dir: SortDir };
  onSort: (f: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = sort.field === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {isActive ? (
        <ChevronDown
          className={`size-3 transition-transform ${sort.dir === "asc" ? "rotate-180" : ""}`}
        />
      ) : (
        <ArrowUpDown className="size-3 opacity-40" />
      )}
    </button>
  );
}

// ============================================================
// Detail Sheet
// ============================================================
function CandidateDetailSheet({
  candidate,
  currentStatus,
  onClose,
  onStatusChange,
  countryFlag,
}: {
  candidate: Candidate | null;
  currentStatus?: CandidateStatus;
  onClose: () => void;
  onStatusChange: (id: string, next: CandidateStatus | null, name?: string) => void;
  countryFlag: string;
}) {
  const [, setLocation] = useLocation();

  if (!candidate) {
    return (
      <Sheet open={false} onOpenChange={(o) => !o && onClose()}>
        <SheetContent />
      </Sheet>
    );
  }

  const score = candidate.evaluation?.scores.overall ?? 0;
  const readiness = getReadinessLabel(score);
  const skills = candidate.skills ?? [];
  const evalScores = candidate.evaluation?.scores;

  return (
    <Sheet open={!!candidate} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto p-0"
      >
        {/* Hero header */}
        <div className="bg-gradient-to-br from-primary/8 via-background to-background p-6 border-b">
          <SheetHeader className="space-y-0 mb-4">
            <SheetTitle className="sr-only">{candidate.fullName}</SheetTitle>
            <SheetDescription className="sr-only">
              Candidate detail view for {candidate.fullName}
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-start gap-4 mb-4">
            <div className="size-16 rounded-xl bg-muted border overflow-hidden shrink-0">
              {candidate.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                  {candidate.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-0.5">
                Candidate Detail
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{candidate.fullName}</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Briefcase className="size-3.5" />
               {candidate.targetRole ||
 candidate.currentRole ||
 candidate.preferredRole}
                <span className="text-muted-foreground/50">•</span>
                {candidate.yearsExperience} yrs
              </p>
            </div>
          </div>

          {/* Status + score row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Current Status
              </div>
              {currentStatus ? (
                <Badge
                  variant="outline"
                  className={`gap-1.5 font-semibold text-xs ${STATUS_META[currentStatus].className}`}
                >
                  <span className={`size-1.5 rounded-full ${STATUS_META[currentStatus].dotClass}`} />
                  {STATUS_META[currentStatus].label}
                </Badge>
              ) : (
                <span className="text-sm font-medium text-muted-foreground italic">
                  Unreviewed
                </span>
              )}
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Overall Readiness
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold tabular-nums ${scoreColor(score)}`}>{score}</span>
                <span className="text-[10px] text-muted-foreground">/100</span>
                <span
                  className={`ml-auto text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${readiness.className}`}
                >
                  {readiness.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ----- Action buttons ----- */}
        <div className="px-6 py-5 border-b bg-muted/10">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recruiter Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentStatus === "shortlisted" ? "default" : "outline"}
              className={`gap-2 ${currentStatus === "shortlisted" ? "" : "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-700"}`}
              onClick={() => onStatusChange(candidate.id, "shortlisted", candidate.fullName)}
            >
              <CheckCircle2 className="size-4" /> Recommend for Client
            </Button>
            <Button
              variant={currentStatus === "needs_training" ? "default" : "outline"}
              className={`gap-2 ${currentStatus === "needs_training" ? "" : "border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-700"}`}
              onClick={() => onStatusChange(candidate.id, "needs_training", candidate.fullName)}
            >
              <GraduationCap className="size-4" /> Send to Upskilling
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
              onClick={() => onStatusChange(candidate.id, "not_suitable", candidate.fullName)}
            >
              <XCircle className="size-4" /> Mark not suitable
            </Button>
            {currentStatus && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange(candidate.id, null, candidate.fullName)}
              >
                <X className="size-4" /> Clear status
              </Button>
            )}
            <Button
            variant="outline"
            size="sm"
            className="gap-2 col-span-2"
            onClick={() =>
                setLocation(`/candidate/${candidate.id}/masked-cv`)
            }
        >
            <FileText className="size-4" />
            View Masked CV
        </Button>
          </div>
        </div>

        {/* ----- Body ----- */}
        <div className="px-6 py-6 space-y-6">
          {/* Contact */}
          <DetailSection title="Contact & Eligibility">
            <DetailRow icon={Mail} label="Email">
              <a href={`mailto:${candidate.email}`} className="hover:text-primary truncate">
                {candidate.email}
              </a>
            </DetailRow>
            <DetailRow icon={Phone} label="Phone">{candidate.phone}</DetailRow>
            {candidate.linkedinUrl && (
              <DetailRow icon={Linkedin} label="LinkedIn">
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary truncate inline-flex items-center gap-1"
                >
                  Profile <ExternalLink className="size-3" />
                </a>
              </DetailRow>
            )}
            <DetailRow icon={MapPin} label="Country">
              <span className="mr-1.5">{countryFlag}</span>
              {candidate.country}
            </DetailRow>
            <DetailRow icon={Globe2} label="Visa">
             <span className="capitalize">
  {candidate.visaStatus?.replace(/_/g, " ") || "-"}
</span>
              {candidate.euWorkEligible && (
                <Badge className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/15">
                  EU Work Eligible
                </Badge>
              )}
            </DetailRow>
            <DetailRow icon={Languages} label="English">{candidate.englishLevel}</DetailRow>
            <DetailRow icon={Calendar} label="Joined">
              {new Date(candidate.createdAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </DetailRow>
          </DetailSection>

          {/* Skills */}
          {skills.length > 0 && (
            <DetailSection title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Score breakdown */}
          {evalScores && (
            <DetailSection title="AI Score Breakdown">
              <div className="space-y-2.5">
                <ScoreBar label="CV Quality" icon={FileText} value={evalScores.cvQuality} />
                <ScoreBar label="Technical Skill Match" icon={Cpu} value={evalScores.technicalSkillMatch} />
                <ScoreBar label="English Readiness" icon={Languages} value={evalScores.englishReadiness} />
                <ScoreBar label="Europe Job Readiness" icon={Globe2} value={evalScores.europeJobReadiness} />
                <ScoreBar
                  label="Upskilling Priority"
                  icon={GraduationCap}
                  value={evalScores.upskillingNeeds}
                  invertColor
                />
              </div>
            </DetailSection>
          )}

          {/* CV */}
          {candidate.cv && (
            <DetailSection title="CV on File">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                <div className="size-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{candidate.cv.fileName}</div>
                  {candidate.cv.fileSize && (
                    <div className="text-xs text-muted-foreground">
                      {(candidate.cv.fileSize / 1024).toFixed(0)} KB
                    </div>
                  )}
                </div>
              </div>
            </DetailSection>
          )}

          {/* CTA to full eval */}
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => setLocation(`/candidate/${candidate.id}/evaluation`)}
          >
            <Target className="size-4" /> Open Full AI Evaluation
            <ArrowRight className="size-4 ml-auto" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-20 shrink-0 text-xs">{label}</span>
      <span className="flex-1 min-w-0 flex items-center">{children}</span>
    </div>
  );
}

function ScoreBar({
  label,
  icon: Icon,
  value,
  invertColor,
}: {
  label: string;
  icon: typeof FileText;
  value: number;
  invertColor?: boolean;
}) {
  // For upskilling priority: high = bad, so invert color logic
  const colorScore = invertColor ? 100 - value : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Icon className="size-3 text-muted-foreground" />
          <span>{label}</span>
        </div>
        <span className={`text-xs font-bold tabular-nums ${scoreColor(colorScore)}`}>
          {value}
          <span className="text-muted-foreground font-normal">/100</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreBg(colorScore)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

