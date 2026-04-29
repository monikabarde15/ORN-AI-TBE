import { useCallback, useEffect, useState } from "react";

export type CandidateStatus = "shortlisted" | "needs_training" | "not_suitable";

const STORAGE_KEY = "orn-ai:candidate-statuses:v1";

type StatusMap = Record<string, CandidateStatus>;

function readStorage(): StatusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(map: StatusMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}

const listeners = new Set<(map: StatusMap) => void>();
let cache: StatusMap | null = null;

function getMap(): StatusMap {
  if (cache === null) cache = readStorage();
  return cache;
}

function emit(map: StatusMap) {
  cache = map;
  writeStorage(map);
  listeners.forEach((fn) => fn(map));
}

export function useCandidateStatuses() {
  const [map, setMap] = useState<StatusMap>(() => getMap());

  useEffect(() => {
    const listener = (next: StatusMap) => setMap({ ...next });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setStatus = useCallback((id: string, status: CandidateStatus | null) => {
    const current = { ...getMap() };
    if (status === null) {
      delete current[id];
    } else {
      current[id] = status;
    }
    emit(current);
  }, []);

  const clearAll = useCallback(() => {
    emit({});
  }, []);

  return { statuses: map, setStatus, clearAll };
}

export const STATUS_META: Record<
  CandidateStatus,
  { label: string; className: string; dotClass: string; description: string }
> = {
  shortlisted: {
    label: "Shortlisted",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-500",
    description: "Recommended to a client",
  },
  needs_training: {
    label: "Needs Training",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-500",
    description: "Sent to upskilling track",
  },
  not_suitable: {
    label: "Not Suitable",
    className:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    dotClass: "bg-rose-500",
    description: "Not a fit for current pipeline",
  },
};
