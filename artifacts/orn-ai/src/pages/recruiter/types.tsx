// src/pages/recruiter/types.ts

import { Candidate } from "@workspace/api-client-react";

export type SortField =
  | "name"
  | "experience"
  | "status"
  | "role"
  | "country";

export type SortDirection = "asc" | "desc";

export interface RecruiterFilters {
  country: string;
  role: string;
  englishLevel: string;
  minReadiness: string;
}

export interface SearchState {
  loading: boolean;
  searched: boolean;
  query: string;
}

export interface CandidateTableProps {
  candidates: Candidate[];
  loading: boolean;
  onView: (candidate: Candidate) => void;
}

export interface CandidateRowProps {
  candidate: Candidate;
  onView: (candidate: Candidate) => void;
}

export interface CandidateDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

export interface AIHeroSearchProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export interface CandidateFiltersProps {
  filters: RecruiterFilters;
  experience: [number, number];
  roles: string[];
  regions: any[];
  onChange: (
    key: keyof RecruiterFilters,
    value: string
  ) => void;
  onExperienceChange: (
    value: [number, number]
  ) => void;
}

export interface SearchResultHeaderProps {
  total: number;
}

export interface CandidateActionProps {
  candidate: Candidate;
}

export interface CandidateStatusBadgeProps {
  status?: string;
}

export interface ScoreBarProps {
  label: string;
  value: number;
}

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}