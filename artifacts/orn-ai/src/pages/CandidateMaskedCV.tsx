import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";

import jsPDF from "jspdf";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Download,
  FileText,
  Loader2,
  Lock,
  Printer,
  ShieldCheck,
} from "lucide-react";

type CandidateApiResponse = {
  data?: Candidate;
} & Partial<Candidate>;

type Candidate = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;

  currentRole?: string;
  preferredRole?: string;
  targetRole?: string;

  yearsExperience?: number;
  country?: string;
  candidateCode?:string,

  englishLevel?: string;
  expectedSalary?: string;
  availability?: string;

  skills?: string[];

  domain?: string;
  lastRole?: string;
  visaStatus?: string;
  euWorkEligible?: boolean;

  evaluation?: {
    scores?: {
      overall?: number;
    };
    summary?: string;

    strengths?: string[];

    recommendedUpskilling?: string[];

    insights?: {
      title: string;
      detail: string;
      severity: string;
    }[];
  };
};
export default function CandidateMaskedCV() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function fetchCandidate() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get<CandidateApiResponse>(`/api/candidates/${id}`);
        const json = res.data;
        const candidateData = json.data ?? json;

        if (active) {
          setCandidate(candidateData as Candidate);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load candidate details",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchCandidate();

    return () => {
      active = false;
    };
  }, [id]);

  const score = candidate?.evaluation?.scores?.overall ?? 0;
  const role =
    candidate?.targetRole ??
    candidate?.currentRole ??
    candidate?.preferredRole ??
    "Not available";

  const maskedFields = [
  {
    label: "ORN-AI Job Ready Resource ID",
    value: candidate?.candidateCode || "N/A",
    masked: false,
  },
  { label: "Full Name", value: "Hidden", masked: true },
  { label: "Email", value: "Hidden", masked: true },
  { label: "Phone Number", value: "Hidden", masked: true },
  { label: "Full Address", value: "Hidden", masked: true },
  { label: "LinkedIn URL", value: "Hidden", masked: true },
  { label: "GitHub URL", value: "Hidden", masked: true },
  // { label: "Employer History", value: "Hidden", masked: true },
];

const careerPrefs = useMemo(() => {
  const pref = candidate?.careerPreference;

  if (!pref) return [];

  if (Array.isArray(pref)) {
    return pref.map((x) => String(x).trim().toLowerCase());
  }

  if (typeof pref === "string") {
    return pref
      .split(",")
      .map((x) => x.trim().toLowerCase());
  }

  return [];
}, [candidate?.careerPreference]);

const isEmploymentActive = (type: string) =>
  careerPrefs.includes(type.toLowerCase());
 const professionalFields = [
  {
    label: "Country",
    value: candidate?.country ?? "N/A",
  },
//   {
//     label: "Current Role",
//     value: candidate?.currentRole ?? "N/A",
//   },
  {
    label: "Preferred Location",
    value: candidate?.careerPreference ?? "N/A",
  },
 {
    label: "Work Mode",
    value: candidate?.preferredWorkMode ?? "N/A",
  },
//   {
//     label: "Target Role",
//     value: candidate?.targetRole ?? "N/A",
//   },
  {
    label: "Experience",
    value: `${candidate?.yearsExperience ?? 0} Years`,
  },
  {
    label: "Key Skills",
    value: candidate?.skills?.join(", ") ?? "N/A",
  },
  {
    label: "English Level",
    value: candidate?.englishLevel ?? "N/A",
  },
  {
    // Client requirement: Notice Period
    label: "Notice Period",
    value: candidate?.availability ?? "Immediate",
  },
  {
    label: "Readiness Score",
    value: `${candidate?.evaluation?.scores?.overall ?? 0}/100`,
  },
  {
    label: "Domain",
    value: candidate?.domain ?? "N/A",
  },
  {
    label: "Last Role",
    value: candidate?.lastRole ?? "N/A",
  },
  {
    label: "Expected Salary",
    value: candidate?.expectedSalary ?? "N/A",
  },
  {
    label: "Visa Status",
    value: candidate?.visaStatus ?? "N/A",
  },
  {
    label: "EU Work Eligible",
    value: candidate?.euWorkEligible ? "Yes" : "No",
  },
];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!id) return;

    try {
      setDownloading(true);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      let y = 16;

      const ensureSpace = (height: number) => {
        if (y + height > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      const textBlock = (text: string, x: number, maxWidth: number) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        y += lines.length * 5;
      };

      const row = (label: string, value: string) => {
        ensureSpace(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(51, 65, 85);
        pdf.setFontSize(9);
        pdf.text(label, margin, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(15, 23, 42);
        pdf.text(value || "Not available", margin + 48, y, {
          maxWidth: pageWidth - margin * 2 - 48,
        });
        y += 9;
      };

      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 40, 3, 3, "FD");
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("Masked Candidate CV", margin + 6, y + 15);
      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("ORN-AI recruiter view | Identity protected", margin + 6, y + 24);
      pdf.setFillColor(219, 234, 254);
      pdf.roundedRect(pageWidth - margin - 45, y + 10, 36, 13, 2, 2, "F");
      pdf.setTextColor(30, 64, 175);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("MASKED", pageWidth - margin - 35, y + 18.5);
      y += 52;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.text("Candidate Information", margin, y);
      y += 8;
      maskedFields.forEach((field) => row(field.label, String(field.value)));

      y += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Professional Snapshot", margin, y);
      y += 8;
      professionalFields.forEach((field) => row(field.label, String(field.value)));

      y += 4;
      ensureSpace(26);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Readiness Score", margin, y);
      y += 8;
      pdf.setFillColor(226, 232, 240);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 4, 2, 2, "F");
      pdf.setFillColor(37, 99, 235);
      pdf.roundedRect(
        margin,
        y,
        ((pageWidth - margin * 2) * Math.min(Math.max(score, 0), 100)) / 100,
        4,
        2,
        2,
        "F",
      );
      y += 11;
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(18);
      pdf.text(`${score}/100`, margin, y);
      y += 10;

      if (candidate?.evaluation?.summary) {
        ensureSpace(22);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("AI Summary", margin, y);
        y += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(10);
        textBlock(candidate.evaluation.summary, margin, pageWidth - margin * 2);
        y += 5;
      }

      if (candidate?.skills?.length) {
        ensureSpace(20);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Skills", margin, y);
        y += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        textBlock(candidate.skills.join(", "), margin, pageWidth - margin * 2);
      }

      ensureSpace(20);
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, "F");
      pdf.setTextColor(51, 65, 85);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "Personal identifiers are masked to support unbiased recruiter screening.",
        margin + 4,
        y + 10,
      );

      pdf.save(`ORN-AI-Masked-CV-${id}.pdf`);
    } catch (err) {
      console.error("Frontend PDF generation failed", err);
      alert("PDF generate nahi ho paya. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Shell>
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <style>
  {`
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html,
      body {
        background: #f8fafc !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Hide buttons, sidebar, navbar, header */
      .no-print,
      aside,
      nav,
      header,
      .sidebar {
        display: none !important;
        visibility: hidden !important;
      }

      /* Shell layout fix */
      main,
      .main-content,
      .content-wrapper {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .print-page {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .print-card {
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
        margin: 0 !important;
      }

      /* Remove unnecessary spacing */
      .container,
      .wrapper {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
      }

      /* Hide everything except CV document */
      body * {
        visibility: hidden;
      }

      #masked-cv-document,
      #masked-cv-document * {
        visibility: visible;
      }

      #masked-cv-document {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }

      @page {
        size: A4;
        margin: 14mm;
      }
    }
  `}
</style>


      <div className="print-page mx-auto max-w-5xl">
        <div className="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setLocation("/recruiter")}
            className="h-11 rounded-md border-slate-200 bg-white px-5 font-semibold shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloading || loading}
              className="h-11 rounded-md bg-blue-900 px-5 font-semibold hover:bg-blue-900"
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>

            <Button
              variant="outline"
              onClick={handlePrint}
              className="h-11 rounded-md border-slate-200 bg-white px-5 font-semibold shadow-sm"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Card
          id="masked-cv-document"
          className="print-card overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 bg-white px-6 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900">
                  <ShieldCheck className="h-4 w-4" />
                  ORN-AI Recruiter View
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Masked Candidate CV
                </h1>
                <p className="mt-2 max-w-2xl text-base text-slate-600">
                  Privacy-first candidate profile for unbiased recruiter
                  screening.
                </p>
              </div>

              <div className="w-fit rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-blue-900">
                <p className="text-xs font-bold uppercase tracking-wide">
                  Identity Status
                </p>
                <p className="mt-1 text-lg font-bold">Masked</p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 p-16 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-blue-900" />
              Loading candidate data...
            </div>
          )}

          {!loading && error && (
            <div className="m-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700 md:m-8">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-bold">Candidate data not loaded</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            
            <div className="grid gap-6 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
              <div className="space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-5">
                  <SectionTitle
                    icon={<FileText className="h-5 w-5" />}
                    title="Candidate Information"
                    subtitle="Personal identifiers are hidden from recruiter view."
                  />

                  <div className="mt-5 divide-y divide-slate-100">
                    {maskedFields.map((field) => (
                      <InfoRow
                        key={field.label}
                        label={field.label}
                        value={field.value}
                        masked={field.masked}
                      />
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-5">
                  <SectionTitle
                    icon={<BadgeCheck className="h-5 w-5" />}
                    title="Professional Snapshot"
                    subtitle="Recruiter-safe profile details from the latest candidate data."
                  />

                  <div className="mt-5 divide-y divide-slate-100">
                    {professionalFields.map((field) => (
                      <InfoRow
                        key={field.label}
                        label={field.label}
                        value={field.value}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-5">
                  <SectionTitle
                    icon={<BadgeCheck className="h-5 w-5" />}
                    title="Readiness Score"
                    subtitle="Overall recruiter readiness."
                  />

                  <div className="mt-5">
                    <div className="flex items-end justify-between">
                      <span className="text-4xl font-bold text-blue-900">
                        {score}
                      </span>
                      <span className="pb-1 text-sm font-semibold text-slate-500">
                        /100
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-900"
                        style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </section>

                {candidate?.evaluation?.summary && (
                  <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <SectionTitle
                      icon={<FileText className="h-5 w-5" />}
                      title="AI Summary"
                      subtitle="Short screening note."
                    />
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {candidate.evaluation.summary}
                    </p>
                  </section>
                )}

                {candidate?.skills && candidate.skills.length > 0 && (
                  <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <SectionTitle
                      icon={<BadgeCheck className="h-5 w-5" />}
                      title="Skills"
                      subtitle="Visible professional capabilities."
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
               <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <SectionTitle
                      icon={<BadgeCheck className="h-5 w-5" />}
                      title="Employment Interests"
                      subtitle="Consultant preferred engagement types"
                    />

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <EmploymentBadge
                        label="Freelance"
                        active={isEmploymentActive("Freelance")}
                      />

                      <EmploymentBadge
                        label="Permanent"
                        active={isEmploymentActive("Permanent")}
                      />

                      <EmploymentBadge
                        label="Contract"
                        active={isEmploymentActive("Contract")}
                      />

                      <EmploymentBadge
                        label="Fixed Term"
                        active={isEmploymentActive("Fixed Term")}
                      />

                      <EmploymentBadge
                        label="C2H"
                        active={isEmploymentActive("C2H")}
                      />

                    </div>
                  </section>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-700">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-950">
                        Privacy Protection
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Personal identifiers including Name, Email, Phone, Address, LinkedIn, GitHub and Employer History are masked to support unbiased recruiter screening.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
    </Shell>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-900">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
function EmploymentBadge({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
        active
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-slate-200 bg-slate-50 text-slate-400"
      }`}
    >
      {label}
    </div>
  );
}
function InfoRow({
  label,
  value,
  masked,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  return (
    <div className="grid gap-2 py-3 md:grid-cols-[160px_1fr]">
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      <div className="min-w-0 break-words text-sm font-semibold text-slate-950">
        {masked ? (
          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
