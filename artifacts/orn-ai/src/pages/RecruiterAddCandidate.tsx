import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useRegisterCandidate,
  useUploadCvFile,
  useRunEvaluation,
  ApiError,
} from "@workspace/api-client-react";
import { Loader2, Upload, FileText, ArrowRight } from "lucide-react";

export default function RecruiterAddCandidate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Romania");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const register = useRegisterCandidate();
  const uploadCv = useUploadCvFile();
  const runEval = useRunEvaluation();

  function pickFile() {
    fileInputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum CV size is 5MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast({ title: "CV required", description: "Attach a PDF, DOC or DOCX file.", variant: "destructive" });
      return;
    }
    if (!fullName || !email) {
      toast({ title: "Missing info", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const created = await register.mutateAsync({
        data: {
          fullName,
          email,
          phone: "",
          country,
          targetRole: "fullstack",
          yearsExperience: 0,
          visaStatus: "eu_citizen",
          englishLevel: "B2",
          euWorkEligible: true,
          linkedinUrl: "",
          skills: [],
        },
      });
      const candidateId = created.id;
      await uploadCv.mutateAsync({ id: candidateId, data: { file } });
      await runEval.mutateAsync({ id: candidateId });
      toast({ title: "Candidate added", description: "CV parsed and evaluation generated." });
      navigate(`/candidate/${candidateId}/evaluation`);
    } catch (err) {
      const message = err instanceof ApiError && typeof err.data === "object" && err.data && "message" in err.data
        ? String((err.data as { message?: string }).message)
        : err instanceof Error
          ? err.message
          : "Could not add candidate";
      toast({ title: "Failed", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Add candidate</h1>
          <p className="text-muted-foreground">Upload a CV — we extract skills, experience and contact details automatically.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate details</CardTitle>
            <CardDescription>
              We will create a candidate profile, parse the CV, then run an evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    data-testid="input-add-candidate-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-add-candidate-email"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    data-testid="input-add-candidate-country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>CV file</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onFile}
                  className="hidden"
                  data-testid="input-add-candidate-cv"
                />
                <button
                  type="button"
                  onClick={pickFile}
                  className="w-full flex items-center justify-between gap-3 border-2 border-dashed border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  data-testid="button-add-candidate-pick-cv"
                >
                  <div className="flex items-center gap-3">
                    {file ? <FileText className="size-5 text-primary" /> : <Upload className="size-5 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium">{file ? file.name : "Choose CV file"}</p>
                      <p className="text-xs text-muted-foreground">PDF, DOC or DOCX, up to 5MB</p>
                    </div>
                  </div>
                  {file && <Badge variant="secondary">{(file.size / 1024).toFixed(0)} KB</Badge>}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={busy}
                data-testid="button-add-candidate-submit"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                Create candidate & evaluate
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
