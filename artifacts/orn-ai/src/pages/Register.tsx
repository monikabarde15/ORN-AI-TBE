import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  useListRegions,
  getListRegionsQueryKey,
  useListRoles,
  getListRolesQueryKey,
  useUploadCvFile,
  useRunEvaluation,
  ApiError,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Globe2,
  Wrench,
  Languages,
  FileUp,
  X,
  FileText,
  Sparkles,
  PartyPopper,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ----- Constants -----
const VISA_VALUES = [
  "eu_citizen",
  "work_permit",
  "blue_card",
  "requires_sponsorship",
  "student_visa",
] as const;
const ENGLISH_VALUES = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const ENGLISH_DESCRIPTIONS: Record<(typeof ENGLISH_VALUES)[number], string> = {
  A1: "Beginner — basic phrases",
  A2: "Elementary — everyday topics",
  B1: "Intermediate — workplace conversations",
  B2: "Upper-intermediate — fluent in technical settings",
  C1: "Advanced — near-native, complex discussions",
  C2: "Proficient — fully native-equivalent",
};

const VISA_LABELS: Record<(typeof VISA_VALUES)[number], string> = {
  eu_citizen: "EU Citizen",
  work_permit: "Work Permit",
  blue_card: "EU Blue Card",
  requires_sponsorship: "Requires Sponsorship",
  student_visa: "Student Visa",
};

// ----- Schema -----
const formSchema = z.object({
  // Step 1
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Phone number is required"),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .or(z.literal("")),
  // Step 2
  country: z.string().min(1, "Please select a country"),
  visaStatus: z.enum(VISA_VALUES),
  euWorkEligible: z.boolean(),
  // Step 3
  targetRole: z.string().min(1, "Please select a target role"),
  yearsExperience: z.number().min(0).max(50),
  skills: z.array(z.string().min(1)).max(20, "Maximum 20 skills"),
  // Step 4
  englishLevel: z.enum(ENGLISH_VALUES),
  // Step 5 (account credentials)
  password: z.string().min(8, "Password must be at least 8 characters"),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy terms to continue" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

// ----- Steps -----
const STEPS = [
  { id: 1, title: "Personal Details", icon: User, fields: ["fullName", "email", "phone", "linkedinUrl"] as const },
  { id: 2, title: "Location & Eligibility", icon: Globe2, fields: ["country", "visaStatus", "euWorkEligible"] as const },
  { id: 3, title: "Skills & Target Role", icon: Wrench, fields: ["targetRole", "yearsExperience", "skills"] as const },
  { id: 4, title: "Language Readiness", icon: Languages, fields: ["englishLevel"] as const },
  { id: 5, title: "Upload CV", icon: FileUp, fields: ["password", "gdprConsent"] as const },
] as const;

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [createdCandidateId, setCreatedCandidateId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: regions } = useListRegions({
    query: { queryKey: getListRegionsQueryKey() },
  });
  const { data: roles } = useListRoles({
    query: { queryKey: getListRolesQueryKey() },
  });

  const auth = useAuth();
  const uploadCvMutation = useUploadCvFile();
  const evaluateMutation = useRunEvaluation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      country: "",
      visaStatus: "eu_citizen",
      euWorkEligible: true,
      targetRole: "",
      yearsExperience: 3,
      skills: [],
      englishLevel: "B2",
      password: "",
      gdprConsent: false as unknown as true,
    },
  });

console.log("regions data =>", regions);

const phase1 = Array.isArray((regions as any)?.phase1)
  ? (regions as any).phase1
  : [];

const phase2 = Array.isArray((regions as any)?.phase2)
  ? (regions as any).phase2
  : [];

const allCountries = [...phase1, ...phase2];

  // ----- Skills helpers -----
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    const current = form.getValues("skills");
    if (current.includes(value)) {
      setSkillInput("");
      return;
    }
    if (current.length >= 20) {
      toast.error("Max 20 skills");
      return;
    }
    form.setValue("skills", [...current, value], { shouldValidate: true });
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    form.setValue(
      "skills",
      form.getValues("skills").filter((x) => x !== s),
      { shouldValidate: true },
    );
  };

  // ----- Step navigation -----
  const goNext = async () => {
    const fields = STEPS[step - 1].fields;
    if (fields.length > 0) {
      const valid = await form.trigger(fields as unknown as (keyof FormValues)[]);
      if (!valid) return;
    }
    if (step < 5) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ----- File upload helpers -----
  const handleFileSelected = (selected: File) => {
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
  };

  // ----- Final submit -----
  const [authPending, setAuthPending] = useState(false);
  const handleFinalSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Some earlier fields are invalid. Please review.");
      return;
    }
    const values = form.getValues();
    setAuthPending(true);
    try {
      const session = await auth.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: "candidate",
        gdprConsent: true,
        candidateProfile: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          country: values.country,
          targetRole: values.targetRole,
          yearsExperience: values.yearsExperience,
          visaStatus: values.visaStatus,
          englishLevel: values.englishLevel,
          euWorkEligible: values.euWorkEligible,
          linkedinUrl: values.linkedinUrl,
          skills: values.skills,
        },
      });
      // Backend creates a candidate row from the embedded profile or via the
      // auth route; for richer profile fields we still create one explicitly.
      const candidateId = session.user.candidateId;
      if (!candidateId) {
        throw new Error("Account created without a candidate profile");
      }
      setCreatedCandidateId(candidateId);

      if (file) {
        await uploadCvMutation.mutateAsync({
          id: candidateId,
          data: { file },
        });
      }

      await evaluateMutation.mutateAsync({ id: candidateId });
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof ApiError && typeof err.data === "object" && err.data && "message" in err.data
        ? String((err.data as { message?: string }).message)
        : err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setAuthPending(false);
    }
  };

  const isSubmitting =
    authPending || uploadCvMutation.isPending || evaluateMutation.isPending;

  // ===========================================================
  // SUCCESS SCREEN
  // ===========================================================
  if (submitted && createdCandidateId) {
    const values = form.getValues();
    return (
      <Shell>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-background border rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-br from-primary/10 via-background to-background p-10 text-center border-b">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
              >
                <PartyPopper className="size-10" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                Welcome to ORN-AI, {values.fullName.split(" ")[0]}.
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Your profile has been registered, scored, and added to the recruiter-ready talent pool.
              </p>
            </div>

            <div className="p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Profile</div>
                    <div className="font-medium text-sm">Created</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">CV</div>
                    <div className="font-medium text-sm truncate">{file ? file.name : "Skipped"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">AI Evaluation</div>
                    <div className="font-medium text-sm">Complete</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Visibility</div>
                    <div className="font-medium text-sm">Live to recruiters</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-5 mt-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Your registration summary
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{values.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{allCountries.find((c) => c.code === values.country)?.name ?? values.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="size-4 text-muted-foreground" />
                    <span>
                      {values.targetRole} · {values.yearsExperience} yrs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="size-4 text-muted-foreground" />
                    <span>English {values.englishLevel}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => setLocation(`/candidate/${createdCandidateId}/evaluation`)}
                >
                  <Sparkles className="size-4" /> View My AI Evaluation
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Shell>
    );
  }

  // ===========================================================
  // MULTI-STEP FORM
  // ===========================================================
  const currentStep = STEPS[step - 1];
  const progress = (step / STEPS.length) * 100;

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Join the ORN-AI Talent Pool
          </h1>
          <p className="text-muted-foreground text-lg">
            Five quick steps to be evaluated and matched with Tier-1 European employers.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">
              Step <span className="text-primary font-bold">{step}</span> of {STEPS.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </div>
          </div>

          {/* Bar */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Step pills */}
          <div className="hidden md:grid grid-cols-5 gap-2 mt-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => isDone && setStep(s.id)}
                  disabled={!isDone && !isActive}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                    isActive
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : isDone
                        ? "bg-background border-border text-foreground hover:border-primary/30 cursor-pointer"
                        : "bg-muted/30 border-transparent text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isDone
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="size-3.5" /> : s.id}
                  </span>
                  <span className="truncate hidden lg:inline">{s.title}</span>
                  <Icon className="size-3.5 lg:hidden" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <currentStep.icon className="size-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {step}
                </div>
                <h2 className="text-xl font-bold">{currentStep.title}</h2>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ===== STEP 1: PERSONAL DETAILS ===== */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground -mt-2">
                          Tell us how to reach you. We never share contact details without your consent.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Anna Kowalski" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="anna@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+48 600 000 000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                                </FormControl>
                                <FormDescription>Optional but strongly recommended.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* ===== STEP 2: LOCATION & ELIGIBILITY ===== */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground -mt-2">
                          Helps recruiters match you with roles you're legally allowed to take.
                        </p>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country of Residence *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {regions?.phase1.length ? (
                                    <>
                                      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Phase 1 — Active
                                      </div>
                                      {regions.phase1.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                          <span className="font-mono text-xs text-muted-foreground mr-2">{c.flag}</span>
                                          {c.name}
                                        </SelectItem>
                                      ))}
                                      {regions.phase2.length > 0 && (
                                        <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-t">
                                          Phase 2 — Coming Soon
                                        </div>
                                      )}
                                      {regions.phase2.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                          <span className="font-mono text-xs text-muted-foreground mr-2">{c.flag}</span>
                                          {c.name}
                                        </SelectItem>
                                      ))}
                                    </>
                                  ) : (
                                    allCountries.map((c) => (
                                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visaStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Visa Status *</FormLabel>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {VISA_VALUES.map((val) => {
                                  const isSelected = field.value === val;
                                  return (
                                    <button
                                      type="button"
                                      key={val}
                                      onClick={() => field.onChange(val)}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                                        isSelected
                                          ? "border-primary bg-primary/5 shadow-sm"
                                          : "border-border bg-background hover:border-primary/30"
                                      }`}
                                    >
                                      <div
                                        className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                          isSelected ? "border-primary" : "border-muted-foreground/30"
                                        }`}
                                      >
                                        {isSelected && <div className="size-2 rounded-full bg-primary" />}
                                      </div>
                                      <span className="text-sm font-medium">{VISA_LABELS[val]}</span>
                                    </button>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="euWorkEligible"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">EU Work Eligible</FormLabel>
                                <FormDescription>
                                  Are you currently allowed to work anywhere in the EU without sponsorship?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* ===== STEP 3: SKILLS & TARGET ROLE ===== */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground -mt-2">
                          What you do, how long you've done it, and your strongest skills.
                        </p>
                        <FormField
                          control={form.control}
                          name="targetRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Role *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roles?.map((r) => (
                                    <SelectItem key={r} value={r}>
                                      {r}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearsExperience"
                          render={({ field: { value, onChange } }) => (
                            <FormItem>
                              <div className="flex justify-between items-center pb-2">
                                <FormLabel>Years of Experience *</FormLabel>
                                <span className="font-mono text-sm font-semibold text-primary">
                                  {value} {value === 1 ? "year" : "years"}
                                </span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={20}
                                  step={1}
                                  value={[value]}
                                  onValueChange={(vals) => onChange(vals[0])}
                                  className="w-full"
                                />
                              </FormControl>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                                <span>0</span>
                                <span>5</span>
                                <span>10</span>
                                <span>15</span>
                                <span>20+</span>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Top Skills</FormLabel>
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="e.g. AWS, TypeScript, Kubernetes"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        addSkill();
                                      }
                                    }}
                                  />
                                  <Button type="button" variant="outline" onClick={addSkill}>
                                    Add
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                                  {field.value.length === 0 ? (
                                    <span className="text-xs text-muted-foreground italic">
                                      No skills added yet — we'll auto-suggest based on your role.
                                    </span>
                                  ) : (
                                    field.value.map((s) => (
                                      <Badge
                                        key={s}
                                        variant="secondary"
                                        className="gap-1.5 pl-3 pr-1.5 py-1 text-sm"
                                      >
                                        {s}
                                        <button
                                          type="button"
                                          onClick={() => removeSkill(s)}
                                          className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                                        >
                                          <X className="size-3" />
                                        </button>
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </div>
                              <FormDescription>
                                Press Enter or comma to add. Up to 20 skills.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* ===== STEP 4: LANGUAGE READINESS ===== */}
                    {step === 4 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground -mt-2">
                          Self-assessed CEFR level. Used to filter roles requiring strong English.
                        </p>
                        <FormField
                          control={form.control}
                          name="englishLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>English Proficiency (CEFR) *</FormLabel>
                              <div className="grid grid-cols-1 gap-2">
                                {ENGLISH_VALUES.map((val) => {
                                  const isSelected = field.value === val;
                                  return (
                                    <button
                                      type="button"
                                      key={val}
                                      onClick={() => field.onChange(val)}
                                      className={`flex items-center gap-4 px-4 py-3.5 rounded-lg border text-left transition-all ${
                                        isSelected
                                          ? "border-primary bg-primary/5 shadow-sm"
                                          : "border-border bg-background hover:border-primary/30"
                                      }`}
                                    >
                                      <div
                                        className={`size-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {val}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{ENGLISH_DESCRIPTIONS[val]}</div>
                                      </div>
                                      {isSelected && (
                                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* ===== STEP 5: UPLOAD CV ===== */}
                    {step === 5 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground -mt-2">
                          Upload your latest CV — our AI will use it to score your profile across 5 dimensions. Optional, but highly recommended.
                        </p>

                        <AnimatePresence mode="wait">
                          {!file ? (
                            <motion.div
                              key="dropzone"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => fileInputRef.current?.click()}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              className={`p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed rounded-xl ${
                                isDragging
                                  ? "border-primary bg-primary/5 scale-[1.01]"
                                  : "border-border bg-muted/10 hover:bg-muted/30 hover:border-primary/40"
                              }`}
                            >
                              <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                              />
                              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <FileUp className="size-7" />
                              </div>
                              <h3 className="text-lg font-semibold mb-1">
                                {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                PDF, DOC, or DOCX · up to 10MB
                              </p>
                              <Button type="button" variant="outline" className="pointer-events-none">
                                Select File
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="file"
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-5 bg-muted/20 rounded-xl border flex items-center gap-4"
                            >
                              <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <FileText className="size-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB · ready for AI ingestion
                                </div>
                              </div>
                              <CheckCircle2 className="size-5 text-primary shrink-0" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFile(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                              >
                                <X className="size-4" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="rounded-lg border bg-primary/5 p-4 text-sm">
                          <div className="flex items-start gap-3">
                            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium">What happens next</div>
                              <div className="text-muted-foreground text-xs mt-1">
                                When you submit, ORN-AI will create your account, ingest your CV, and run the 5-dimension AI evaluation. You'll see your scores immediately.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 pt-2 border-t">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    data-testid="input-register-password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Used to sign in later and review your evaluation.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gdprConsent"
                            render={({ field }) => (
                              <FormItem className="flex items-start gap-3 rounded-lg border p-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value as unknown as boolean}
                                    onCheckedChange={(v) => field.onChange(v === true)}
                                    data-testid="checkbox-register-gdpr"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-tight">
                                  <FormLabel className="text-sm font-medium">
                                    I consent to ORN-AI processing my profile and CV
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Required under GDPR. You can revoke consent and request deletion at any time.
                                  </FormDescription>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </Form>
          </div>

          {/* Footer / Nav */}
          <div className="px-8 py-5 border-t bg-muted/20 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 1 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>

            {step < 5 ? (
              <Button type="button" onClick={goNext} className="gap-2" size="lg">
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {authPending && "Registering..."}
                    {uploadCvMutation.isPending && "Uploading CV..."}
                    {evaluateMutation.isPending && "Running AI evaluation..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Submit & Run AI Evaluation
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By submitting you agree to ORN-AI processing your profile to generate AI evaluation scores. No real data is shared with third parties in this demo.
        </p>
      </div>
    </Shell>
  );
}
