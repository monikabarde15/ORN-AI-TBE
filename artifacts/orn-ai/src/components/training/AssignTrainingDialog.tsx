import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  useListTrainingCatalog,
  useRecommendTrainingForCandidate,
  useCreateTrainingAssignment,
  getTrainingDashboardQueryKey,
  getListTrainingAssignmentsQueryKey,
  getGetCandidateTrainingQueryKey,
  getRecommendTrainingForCandidateQueryKey,
  getListTrainingCatalogQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles, RefreshCcw, Compass } from "lucide-react";

interface Props {
  candidateId: string;
  candidateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function dateInputValue(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function AssignTrainingDialog({
  candidateId,
  candidateName,
  open,
  onOpenChange,
}: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const recQuery = useRecommendTrainingForCandidate(candidateId, {
    query: {
      enabled: open && !!candidateId,
      queryKey: getRecommendTrainingForCandidateQueryKey(candidateId),
    },
  });
  const catalogQuery = useListTrainingCatalog({
    query: {
      enabled: open,
      queryKey: getListTrainingCatalogQueryKey(),
    },
  });

  const rec = recQuery.data;
  const catalog = catalogQuery.data;

  const [programId, setProgramId] = useState<string>("");
  const [trainerId, setTrainerId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");

  // Initialize form when recommendation arrives
  useEffect(() => {
    if (rec && open) {
      setProgramId(rec.program.id);
      setTrainerId(rec.suggestedTrainer.id);
      setStartDate(dateInputValue(rec.suggestedStartDate));
      setTargetDate(dateInputValue(rec.suggestedTargetCompletionDate));
    }
  }, [rec, open]);

  // When user changes program, recompute target completion date
  const selectedProgram = useMemo(
    () => catalog?.programs.find((p) => p.id === programId),
    [catalog, programId],
  );
  useEffect(() => {
    if (selectedProgram && startDate) {
      const s = new Date(startDate);
      const t = new Date(s);
      t.setDate(t.getDate() + selectedProgram.durationWeeks * 7);
      setTargetDate(dateInputValue(t.toISOString()));
    }
  }, [selectedProgram, startDate]);

  const createMut = useCreateTrainingAssignment({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Training assigned",
          description: `${candidateName} has been routed into the program.`,
        });
        qc.invalidateQueries({ queryKey: getTrainingDashboardQueryKey() });
        qc.invalidateQueries({ queryKey: getListTrainingAssignmentsQueryKey() });
        qc.invalidateQueries({
          queryKey: getGetCandidateTrainingQueryKey(candidateId),
        });
        onOpenChange(false);
      },
      onError: (err) => {
        toast({
          title: "Could not assign training",
          description: (err as Error).message,
          variant: "destructive",
        });
      },
    },
  });

  const onSubmit = () => {
    if (!programId || !trainerId || !startDate || !targetDate) return;
    createMut.mutate({
      data: {
        candidateId,
        programId,
        trainerId,
        startDate: new Date(startDate).toISOString(),
        targetCompletionDate: new Date(targetDate).toISOString(),
      },
    });
  };

  const loading = recQuery.isLoading || catalogQuery.isLoading;
  const fetchError = recQuery.isError || catalogQuery.isError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign career-transformation track</DialogTitle>
          <DialogDescription>
            Route {candidateName} into a hybrid upskilling or reskilling program
            with a matched trainer.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="py-10 text-center">
            <p className="text-sm text-destructive mb-3">
              We couldn't load the training catalog or recommendation.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                recQuery.refetch();
                catalogQuery.refetch();
              }}
              data-testid="button-retry-assign-dialog"
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rec && (
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                  <Sparkles className="size-3.5" />
                  AI recommendation
                  <Badge
                    variant="outline"
                    className="ml-auto gap-1 text-[10px] border-primary/30"
                  >
                    {rec.trainingType === "reskilling" ? (
                      <>
                        <RefreshCcw className="size-2.5" /> Reskilling
                      </>
                    ) : (
                      <>
                        <Compass className="size-2.5" /> Upskilling
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-sm font-semibold mb-1">
                  {rec.program.name}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {rec.recommendedPath} · suggested trainer: {rec.suggestedTrainer.name}
                </div>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {rec.rationale}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Program</Label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {catalog?.programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-muted-foreground">
                          {p.trainingType}
                        </span>
                        <span>{p.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProgram && (
                <div className="text-xs text-muted-foreground">
                  {selectedProgram.durationWeeks} weeks · {selectedProgram.moduleTemplates.length}{" "}
                  modules · hybrid (recorded + live)
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Trainer</Label>
              <Select value={trainerId} onValueChange={setTrainerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {catalog?.trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <span className="flex flex-col items-start">
                        <span>{t.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {t.specialism}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Target completion</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMut.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              loading ||
              createMut.isPending ||
              !programId ||
              !trainerId ||
              !startDate ||
              !targetDate
            }
            data-testid="button-assign-training-confirm"
          >
            {createMut.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Assigning…
              </>
            ) : (
              "Assign training"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
