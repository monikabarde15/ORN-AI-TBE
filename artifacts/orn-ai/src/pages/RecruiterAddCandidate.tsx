// artifacts\orn-ai\src\pages\RecruiterAddCandidate.tsx
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
  useListRegions,
  getListRegionsQueryKey,
  ApiError,
} from "@workspace/api-client-react";
import { Loader2, Upload, FileText, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ----- Constants -----
const VISA_VALUES = [
  "eu_citizen",
  "work_permit",
  "blue_card",
  "requires_sponsorship",
  "student_visa",
] as const;


const VISA_LABELS: Record<(typeof VISA_VALUES)[number], string> = {
  eu_citizen: "EU Citizen",
  work_permit: "Work Permit",
  blue_card: "EU Blue Card",
  requires_sponsorship: "Requires Sponsorship",
  student_visa: "Student Visa",
};
export default function RecruiterAddCandidate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [country, setCountry] = useState("");
  const [visaStatus, setVisaStatus] = useState("eu_citizen");
  const [currentRole, setCurrentRole] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: regions } = useListRegions({
    query: {
      queryKey: getListRegionsQueryKey(),
    },
  });
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
      toast({
        title: "CV required",
        description: "Attach a PDF, DOC or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (
    !fullName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim() ||
    !currentLocation ||
    !country ||
    !visaStatus ||
    !currentRole.trim() ||
    !preferredRole.trim()
  ) {
    toast({
      title: "Missing information",
      description: "Please fill in all required candidate details.",
      variant: "destructive",
    });
    return;
  }
if (password !== confirmPassword) {
  toast({
    title: "Password mismatch",
    description: "Password and Confirm Password must be the same.",
    variant: "destructive",
  });
  return;
}

if (password.length < 8) {
  toast({
    title: "Weak password",
    description: "Password must be at least 8 characters long.",
    variant: "destructive",
  });
  return;
}
    /* ---------- Normalize Inputs ---------- */

    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCurrentRole = currentRole.trim();
    const normalizedPreferredRole = preferredRole.trim();

    /* ---------- API Payload ---------- */

    const candidatePayload = {
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: "",
      password,

      currentLocation,
      country,

      visaStatus,

      currentRole: normalizedCurrentRole,

      preferredRole: normalizedPreferredRole,
        "role": "candidate",


      // Preferred Role becomes Target Role
      targetRole: normalizedPreferredRole,

      yearsExperience: 0,

      englishLevel: "B2",
      euWorkEligible: true,

      linkedinUrl: "",
      skills: [],
    };

    setBusy(true);

    console.log("candidatePayload=",candidatePayload);
    try {
      const created = await register.mutateAsync({
        data: candidatePayload,
      });

      const candidateId = created.id;

      await uploadCv.mutateAsync({
        id: candidateId,
        data: { file },
      });

      await runEval.mutateAsync({
        id: candidateId,
      });

      toast({
        title: "Candidate added",
        description: "CV parsed and evaluation generated.",
      });

      navigate(`/candidate/${candidateId}/evaluation`);
    } catch (err) {
      const message =
        err instanceof ApiError &&
          typeof err.data === "object" &&
          err.data &&
          "message" in err.data
          ? String((err.data as { message?: string }).message)
          : err instanceof Error
            ? err.message
            : "Could not add candidate";

      toast({
        title: "Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }


  const phase1 = Array.isArray((regions as any)?.phase1)
    ? (regions as any).phase1
    : [];

  const phase2 = Array.isArray((regions as any)?.phase2)
    ? (regions as any).phase2
    : [];

  

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <form onSubmit={onSubmit} className="space-y-6">

              {/* ================= Contact Information ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    data-testid="input-add-candidate-name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-add-candidate-email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {/* ================= Location ================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Current Location *</Label>

                  <Select
                    value={currentLocation}
                    onValueChange={setCurrentLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current location" />
                    </SelectTrigger>

                    <SelectContent className="max-h-[320px]">

                      {phase1.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                            Phase 1 — Active
                          </div>

                          {phase1.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.name}
                            </SelectItem>
                          ))}

                          {phase2.length > 0 && (
                            <div className="px-2 py-1.5 mt-1 border-t text-xs font-semibold uppercase text-muted-foreground">
                              Phase 2 — Coming Soon
                            </div>
                          )}

                          {phase2.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.name}
                            </SelectItem>
                          ))}
                        </>
                      )}

                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country of Residence *</Label>

                  <Select
                    value={country}
                    onValueChange={setCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>

                    <SelectContent className="max-h-[320px]">

                      {phase1.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                            Phase 1 — Active
                          </div>

                          {phase1.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.name}
                            </SelectItem>
                          ))}

                          {phase2.length > 0 && (
                            <div className="px-2 py-1.5 mt-1 border-t text-xs font-semibold uppercase text-muted-foreground">
                              Phase 2 — Coming Soon
                            </div>
                          )}

                          {phase2.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.name}
                            </SelectItem>
                          ))}
                        </>
                      )}

                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* ================= Visa ================= */}

              <div className="space-y-2">

                <Label>Visa Status *</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">

                  {VISA_VALUES.map((value) => {

                    const selected = visaStatus === value;

                    return (

                      <button
                        key={value}
                        type="button"
                        onClick={() => setVisaStatus(value)}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                          }`}
                      >

                        <div
                          className={`size-4 rounded-full border-2 flex items-center justify-center ${selected
                              ? "border-primary"
                              : "border-muted-foreground/30"
                            }`}
                        >
                          {selected && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>

                        <span className="text-sm">
                          {VISA_LABELS[value]}
                        </span>

                      </button>

                    );

                  })}

                </div>

              </div>

              {/* ================= Roles ================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="currentRole">
                    Current Role *
                  </Label>

                  <Input
                    id="currentRole"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredRole">
                    Preferred Role *
                  </Label>

                  <Input
                    id="preferredRole"
                    value={preferredRole}
                    onChange={(e) => setPreferredRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Tech Lead, AI Engineer"
                  />
                </div>

              </div>

              {/* ================= Resume Upload ================= */}

              <div className="space-y-2">

                <Label>Candidate Resume *</Label>

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
                  className="w-full rounded-xl border-2 border-dashed border-border p-8 hover:border-primary hover:bg-primary/5 transition-all text-left"
                  data-testid="button-add-candidate-pick-cv"
                >

                  <div className="flex flex-col items-center justify-center gap-3">

                    {file
                      ? <FileText className="size-8 text-primary" />
                      : <Upload className="size-8 text-muted-foreground" />
                    }

                    <div className="text-center">

                      <p className="font-medium">
                        {file ? file.name : "Upload Candidate Resume"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        PDF, DOC or DOCX • Maximum 5MB
                      </p>

                    </div>

                    {file && (
                      <Badge variant="secondary">
                        {(file.size / 1024).toFixed(0)} KB
                      </Badge>
                    )}

                  </div>

                </button>

              </div>

              {/* ================= Submit ================= */}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={busy}
                data-testid="button-add-candidate-submit"
              >
                {busy
                  ? <Loader2 className="size-4 animate-spin" />
                  : <ArrowRight className="size-4" />
                }

                Create Candidate & Run AI Evaluation

              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
