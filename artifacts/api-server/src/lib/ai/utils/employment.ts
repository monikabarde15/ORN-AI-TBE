// artifacts\api-server\src\lib\ai\utils\employment.ts
import type { EmploymentHistory } from "../types";

function parseDate(value: string): Date | null {
  if (!value) return null;

  if (value.toLowerCase() === "present") {
    return new Date();
  }

  const [year, month] = value.split("-").map(Number);

  if (!year || !month) {
    return null;
  }

  return new Date(year, month - 1, 1);
}

function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function calculateYearsExperience(
  history: EmploymentHistory[],
): number {
  if (!history.length) return 0;

  let totalMonths = 0;

  for (const job of history) {
    const start = parseDate(job.startDate);
    const end = parseDate(job.endDate);

    if (!start || !end) continue;

      const months = monthsBetween(start, end) + 1;

      if (months > 0) {
          totalMonths += months;
      }
  }

  return Math.floor(totalMonths / 12);
}

export function calculateCareerGapMonths(
  history: EmploymentHistory[],
): number {
  if (history.length < 2) return 0;

  const jobs = [...history].sort((a, b) => {
    return (
      parseDate(a.startDate)!.getTime() -
      parseDate(b.startDate)!.getTime()
    );
  });

  let largestGap = 0;

  for (let i = 0; i < jobs.length - 1; i++) {
    const currentEnd = parseDate(jobs[i].endDate);
    const nextStart = parseDate(jobs[i + 1].startDate);

    if (!currentEnd || !nextStart) continue;

    const gap = monthsBetween(currentEnd, nextStart);

    if (gap >= 6 && gap > largestGap) {
      largestGap = gap;
    }
  }

  return largestGap;
}