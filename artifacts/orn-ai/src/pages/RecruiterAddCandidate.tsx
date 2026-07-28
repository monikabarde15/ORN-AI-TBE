import { useRef, useState } from "react";
import { useLocation } from "wouter";
import countryList from "country-list-with-dial-code-and-flag";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useRegisterCandidate,
  useUploadCvFile,
  useRunEvaluation,
  ApiError,
} from "@workspace/api-client-react";
import {
  Loader2,
  Upload,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const CAREER_OPTIONS = [
  "Freelance",
  "Permanent",
  "Contract",
  "Fixed Term",
  "Contract-to-Hire",
];

const WORK_MODES = ["Remote", "Hybrid", "Onsite"];

const COUNTRIES = countryList.getAll().map((country) => ({
  code: country.countryCode,
  name: country.name,
  flag: country.flag,
}));

function TagInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  required?: boolean;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const item = input.trim();
    if (item && !value.includes(item) && value.length < 20) {
      onChange([...value, item]);
    }
    setInput("");
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && " *"}
      </Label>
      <div className="flex gap-2">
        <Input
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="gap-1.5">
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onChange(value.filter((entry) => entry !== item))}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add (up to 20).
      </p>
    </div>
  );
}

export default function RecruiterAddCandidate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [visaStatus, setVisaStatus] =
    useState<(typeof VISA_VALUES)[number]>("eu_citizen");
  const [euWorkEligible, setEuWorkEligible] = useState(true);
  const [currentRole, setCurrentRole] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [englishLevel, setEnglishLevel] = useState("B2");
  const [skills, setSkills] = useState<string[]>([]);
  const [interestedSkills, setInterestedSkills] = useState<string[]>([]);
  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);
  const [careerPreference, setCareerPreference] = useState<string[]>([]);
  const [preferredWorkMode, setPreferredWorkMode] = useState<string[]>([]);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [availability, setAvailability] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const register = useRegisterCandidate();
  const uploadCv = useUploadCvFile();
  const runEval = useRunEvaluation();

  const countryName = (code: string) =>
    COUNTRIES.find((item) => item.code === code)?.name ?? "";

  const toggle = (
    value: string,
    selected: string[],
    setter: (items: string[]) => void
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const missingFields = [
      !file && "Candidate Resume",
      !fullName.trim() && "Full Name",
      !email.trim() && "Email",
      !phone.trim() && "Phone",
      !currentLocation && "Current Location",
      !country && "Country of Residence",
      !city.trim() && "City",
      !currentRole.trim() && "Current Role",
      !preferredRole.trim() && "Preferred Role",
      !yearsExperience && "Years of Experience",
      !languagesKnown.length && "Languages Known",
      !careerPreference.length && "Career & Employment Preference",
      !preferredWorkMode.length && "Preferred Work Mode",
      !expectedSalary.trim() && "Expected Salary / Rate",
      !availability && "Availability",
      !password && "Password",
    ].filter(Boolean) as string[];

    if (missingFields.length) {
      toast({
        title: "Missing information",
        description: `Please complete: ${missingFields.join(", ")}.`,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (linkedinUrl && !/^https?:\/\//i.test(linkedinUrl)) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Include http:// or https:// in the LinkedIn URL.",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);

    try {
      const created = await register.mutateAsync({
        data: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          currentLocation,
          country,
          city: city.trim(),
          visaStatus,
          euWorkEligible,
          currentRole: currentRole.trim(),
          preferredRole: preferredRole.trim(),
          targetRole: preferredRole.trim(),
          yearsExperience: Number(yearsExperience),
          englishLevel: englishLevel as
            | "A1"
            | "A2"
            | "B1"
            | "B2"
            | "C1"
            | "C2",
          linkedinUrl: linkedinUrl.trim(),
          skills,
          interestedSkills,
          languagesKnown,
          careerPreference,
          preferredWorkMode,
          expectedSalary: expectedSalary.trim(),
          availability,
        } as any,
      });

      await uploadCv.mutateAsync({ id: created.id, data: { file } });
      await runEval.mutateAsync({ id: created.id });

      toast({
        title: "Candidate added",
        description: "CV parsed and evaluation generated.",
      });

      navigate(`/candidate/${created.id}/evaluation`);
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

  const fieldClass = "grid grid-cols-1 gap-4 md:grid-cols-2";

  return (
    <Shell>
      <div className="container mx-auto max-w-7xl px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Add candidate</h1>
          <p className="text-muted-foreground">
            Create the same complete candidate profile as the registration form,
            then run the AI evaluation.
          </p>
        </div>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>Candidate details</CardTitle>
            <CardDescription>
              Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Personal details */}
              <section className="space-y-4">
                <h2 className="font-semibold">Personal details</h2>
                <div className={fieldClass}>
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={linkedinUrl}
                      placeholder="https://linkedin.com/in/..."
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password *</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Location & eligibility */}
              <section className="space-y-4">
                <h2 className="font-semibold">Location & eligibility</h2>
                <div className={fieldClass}>
                  <div className="space-y-2">
                    <Label>Current Location *</Label>
                    <Input
                      list="current-location-countries"
                      value={locationSearch}
                      placeholder="Search current location..."
                      onChange={(e) => {
                        const next = e.target.value;
                        setLocationSearch(next);
                        const match = COUNTRIES.find(
                          (item) =>
                            item.name.toLowerCase() === next.toLowerCase() ||
                            item.code.toLowerCase() === next.toLowerCase()
                        );
                        if (match) setCurrentLocation(match.code);
                      }}
                      onBlur={() => {
                        if (currentLocation) {
                          setLocationSearch(countryName(currentLocation));
                        }
                      }}
                    />
                    <datalist id="current-location-countries">
                      {COUNTRIES.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.code}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label>Country of Residence *</Label>
                    <Input
                      list="residence-countries"
                      value={countrySearch}
                      placeholder="Search country of residence..."
                      onChange={(e) => {
                        const next = e.target.value;
                        setCountrySearch(next);
                        const match = COUNTRIES.find(
                          (item) =>
                            item.name.toLowerCase() === next.toLowerCase() ||
                            item.code.toLowerCase() === next.toLowerCase()
                        );
                        if (match) setCountry(match.code);
                      }}
                      onBlur={() => {
                        if (country) {
                          setCountrySearch(countryName(country));
                        }
                      }}
                    />
                    <datalist id="residence-countries">
                      {COUNTRIES.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.code}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Visa Status *</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {VISA_VALUES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setVisaStatus(value)}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left ${
                          visaStatus === value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/30"
                        }`}
                      >
                        <span
                          className={`size-4 rounded-full border-2 ${
                            visaStatus === value
                              ? "border-[5px] border-primary"
                              : "border-muted-foreground/30"
                          }`}
                        />
                        {VISA_LABELS[value]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
                  <div>
                    <Label className="text-base">EU Work Eligible</Label>
                    <p className="text-sm text-muted-foreground">
                      Can work in the EU without sponsorship.
                    </p>
                  </div>
                  <Switch
                    checked={euWorkEligible}
                    onCheckedChange={setEuWorkEligible}
                  />
                </div>
              </section>

              {/* Professional profile & career preferences */}
              <section className="space-y-5">
                <h2 className="font-semibold">
                  Professional profile & career preferences
                </h2>

                <div className={fieldClass}>
                  <div className="space-y-2">
                    <Label>Current Role *</Label>
                    <Input
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Role *</Label>
                    <Input
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience *</Label>
                    <Select
                      value={yearsExperience}
                      onValueChange={setYearsExperience}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          ["0", "0-1 Years"],
                          ["2", "1-3 Years"],
                          ["4", "3-5 Years"],
                          ["6", "5-8 Years"],
                          ["9", "8-10 Years"],
                          ["10", "10+ Years"],
                        ].map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>English Level *</Label>
                    <Select
                      value={englishLevel}
                      onValueChange={setEnglishLevel}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TagInput
                  label="Top Skills"
                  value={skills}
                  onChange={setSkills}
                  placeholder="e.g. AWS, TypeScript"
                />

                <TagInput
                  label="Interested Skills"
                  value={interestedSkills}
                  onChange={setInterestedSkills}
                  placeholder="e.g. Machine Learning"
                />

                <TagInput
                  label="Languages Known"
                  required
                  value={languagesKnown}
                  onChange={setLanguagesKnown}
                  placeholder="e.g. English, German"
                />

                <div className={fieldClass}>
                  <div className="space-y-2">
                    <Label>Career & Employment Preference *</Label>
                    {CAREER_OPTIONS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={careerPreference.includes(option)}
                          onCheckedChange={() =>
                            toggle(option, careerPreference, setCareerPreference)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Work Mode *</Label>
                    {WORK_MODES.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={preferredWorkMode.includes(option)}
                          onCheckedChange={() =>
                            toggle(option, preferredWorkMode, setPreferredWorkMode)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Salary / Rate Range *</Label>
                    <Input
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Availability *</Label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Immediate",
                          "1 Week",
                          "2 Weeks",
                          "3 Weeks",
                          "1 Month",
                          "2 Months",
                          "3 Months",
                        ].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Resume upload */}
              <section className="space-y-2">
                <Label>Candidate Resume *</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (!selected) return;
                    if (selected.size > 5 * 1024 * 1024) {
                      toast({
                        title: "File too large",
                        description: "Maximum CV size is 5MB.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setFile(selected);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed p-8 text-center hover:border-primary hover:bg-primary/5"
                >
                  {file ? (
                    <FileText className="mx-auto mb-2 size-8 text-primary" />
                  ) : (
                    <Upload className="mx-auto mb-2 size-8 text-muted-foreground" />
                  )}
                  <p className="font-medium">
                    {file?.name ?? "Upload Candidate Resume"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC or DOCX · Maximum 5MB
                  </p>
                </button>
              </section>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Create Candidate & Run AI Evaluation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}