// artifacts\api-server\src\lib\cv-parser.ts
// @ts-expect-error – pdf-parse v1 has no types
// import pdfParse from "pdf-parse/lib/pdf-parse.js";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import { SKILL_POOL } from "./regions";

export interface ExtractedProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  yearsExperience: number | null;
  lastRole: string | null;
  domain: string | null;
  careerGapMonths: number;
  skills: string[];
  rawText: string;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const YEARS_RE =
  /(\d{1,2})\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:professional\s+)?experience/i;
const ROLE_HINTS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Engineer",
  "QA Engineer",
  "Product Manager",
  "Product Designer",
  "UX Designer",
  "Solutions Architect",
  "Site Reliability Engineer",
];
const DOMAIN_HINTS = [
  "Fintech",
  "Healthcare",
  "E-commerce",
  "SaaS",
  "Banking",
  "Telecom",
  "Insurance",
  "Logistics",
  "Gaming",
  "EdTech",
  "Cybersecurity",
];
const LOCATION_HINTS = [
  "Romania",
  "Czechia",
  "Czech Republic",
  "Hungary",
  "Poland",
  "Slovakia",
  "Bulgaria",
  "Serbia",
  "Croatia",
  "Italy",
  "Spain",
  "Portugal",
  "Greece",
];
const MONTH_RE =
  /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})/gi;

function safeDecodeURIComponent(str: string): string {
  if (!str) return "";
  try {
    return decodeURIComponent(str);
  } catch {
    try {
      return decodeURIComponent(str.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
    } catch {
      return str;
    }
  }
}

function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve) => {
    try {
      const parser = new PDFParser();

      parser.on("pdfParser_dataError", (err) => {
        console.error("PDF Parsing Error:", err);
        resolve("");
      });

      parser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = (pdfData.Pages ?? [])
            .flatMap((page: any) => page.Texts ?? [])
            .map((text: any) =>
              safeDecodeURIComponent(
                (text.R ?? [])
                  .map((r: any) => r.T ?? "")
                  .join(""),
              ),
            )
            .join(" ");

          resolve(text);
        } catch (err) {
          console.error("Error extracting text from PDF data:", err);
          resolve("");
        }
      });

      parser.parseBuffer(buffer);
    } catch (err) {
      console.error("Failed to parse PDF buffer:", err);
      resolve("");
    }
  });
}


export async function parseCvBuffer(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      return await extractTextFromPdf(buffer);
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return String(result.value ?? "");
    }

    return buffer.toString("utf8");
  } catch (err) {
    console.error("Error in parseCvBuffer:", err);
    return "";
  }
}

function pickName(lines: string[]): string | null {
  for (const line of lines.slice(0, 6)) {
    const trimmed = line.trim();
    if (trimmed.length < 4 || trimmed.length > 60) continue;
    // Looks like a personal name: 2-4 capitalised words, no digits/symbols
    if (
      /^[A-ZÁÉÍÓÚÄÖÜČŠŽĆĐŁŃŚŹŻ][a-záéíóúäöüčšžćđłńśźż'-]+(\s+[A-ZÁÉÍÓÚÄÖÜČŠŽĆĐŁŃŚŹŻ][a-záéíóúäöüčšžćđłńśźż'-]+){1,3}$/.test(
        trimmed,
      )
    ) {
      return trimmed;
    }
  }
  return null;
}

function pickFromHints(text: string, hints: string[]): string | null {
  const lower = text.toLowerCase();
  for (const h of hints) {
    if (lower.includes(h.toLowerCase())) return h;
  }
  return null;
}

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const s of SKILL_POOL) {
    // Word boundary-ish match (skip very short tokens to avoid false positives)
    if (s.length < 2) continue;
    const needle = s.toLowerCase();
    const re = new RegExp(`(^|[^a-z0-9+#])${escapeRegex(needle)}([^a-z0-9+#]|$)`, "i");
    if (re.test(lower)) found.add(s);
  }
  return Array.from(found).slice(0, 24);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectYears(text: string): number | null {
  const m = text.match(YEARS_RE);
  if (m && m[1]) return Math.min(40, Number(m[1]));
  // Heuristic from earliest "Month YYYY" mention
  let earliest: number | null = null;
  for (const match of text.matchAll(MONTH_RE)) {
    const yr = Number(match[2]);
    if (yr >= 1980 && yr <= new Date().getFullYear()) {
      earliest = earliest === null ? yr : Math.min(earliest, yr);
    }
  }
  if (earliest !== null) {
    return Math.max(0, Math.min(40, new Date().getFullYear() - earliest));
  }
  return null;
}

/**
 * Look for the largest gap between two consecutive `Month YYYY` mentions
 * in the work-history portion of the CV. This is a heuristic — it works best
 * for chronological CVs and degrades gracefully when the format is unusual.
 */
export function detectCareerGapMonths(
  text: string,
): number {
  const dates: number[] = [];
  for (const match of text.matchAll(MONTH_RE)) {
    const yr = Number(match[2]);
    const monIdx =
      [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ].indexOf((match[1] ?? "").slice(0, 3).toLowerCase()) || 0;
    if (yr >= 1980) dates.push(yr * 12 + monIdx);
  }
  if (dates.length < 2) return 0;
  dates.sort((a, b) => a - b);
  let largest = 0;
  for (let i = 1; i < dates.length; i++) {
    const gap = (dates[i] ?? 0) - (dates[i - 1] ?? 0);
    if (gap > largest) largest = gap;
  }
  // Anything under 6 months is normal job-change friction, not a "gap"
  return largest >= 6 ? largest : 0;
}

export function extractProfileFromText(text: string): ExtractedProfile {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const email = text.match(EMAIL_RE)?.[0] ?? null;
  const phone = text.match(PHONE_RE)?.[0]?.trim() ?? null;
  const fullName = pickName(lines);
  const location = pickFromHints(text, LOCATION_HINTS);
  const lastRole = pickFromHints(text, ROLE_HINTS);
  const domain = pickFromHints(text, DOMAIN_HINTS);
  const yearsExperience = detectYears(text);
  const careerGapMonths = detectCareerGapMonths(text);
  const skills = detectSkills(text);

  return {
    fullName,
    email,
    phone,
    location,
    lastRole,
    domain,
    yearsExperience,
    careerGapMonths,
    skills,
    rawText: text.slice(0, 4000),
  };
}
