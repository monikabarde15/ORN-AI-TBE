import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { Button } from "@/components/ui/button";

import { RotateCcw } from "lucide-react";

import { CandidateFiltersProps } from "../types";

export default function CandidateFilters({
  filters,
  experience,
  roles,
  regions,
  onChange,
  onExperienceChange,
}: CandidateFiltersProps) {
  return (
    <div className="rounded-2xl border bg-background shadow-sm p-6 mt-8">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold">

          Candidate Filters

        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onChange("country", "");
            onChange("role", "");
            onChange("englishLevel", "");
            onChange("minReadiness", "");
            onExperienceChange([0, 20]);
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />

          Reset
        </Button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

        {/* Country */}

        <Select
          value={filters.country || "all"}
          onValueChange={(value) =>
            onChange("country", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="Country" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Countries

            </SelectItem>

            {regions.map((country: any) => (

              <SelectItem
                key={country.code}
                value={country.code}
              >
                {country.flag} {country.name}
              </SelectItem>

            ))}

          </SelectContent>

        </Select>

        {/* Role */}

        <Select
          value={filters.role || "all"}
          onValueChange={(value) =>
            onChange("role", value === "all" ? "" : value)
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="Role" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Roles

            </SelectItem>

            {roles.map((role) => (

              <SelectItem
                key={role}
                value={role}
              >
                {role}
              </SelectItem>

            ))}

          </SelectContent>

        </Select>

        {/* English */}

        <Select
          value={filters.englishLevel || "all"}
          onValueChange={(value) =>
            onChange(
              "englishLevel",
              value === "all" ? "" : value
            )
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="English" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              Any English
            </SelectItem>

            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
            <SelectItem value="C2">C2</SelectItem>

          </SelectContent>

        </Select>

        {/* Readiness */}

        <Select
          value={filters.minReadiness || "all"}
          onValueChange={(value) =>
            onChange(
              "minReadiness",
              value === "all" ? "" : value
            )
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="Readiness" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Scores

            </SelectItem>

            <SelectItem value="90">

              90+

            </SelectItem>

            <SelectItem value="80">

              80+

            </SelectItem>

            <SelectItem value="70">

              70+

            </SelectItem>

            <SelectItem value="60">

              60+

            </SelectItem>

          </SelectContent>

        </Select>

        {/* Experience */}
        <Select
          value={String(experience[0])}
          onValueChange={(value) => {
            onExperienceChange([Number(value), 20]);
          }}
        >
          <SelectTrigger className="w-full xl:w-[220px]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="0">Any Experience</SelectItem>
            <SelectItem value="1">1+ Years</SelectItem>
            <SelectItem value="2">2+ Years</SelectItem>
            <SelectItem value="3">3+ Years</SelectItem>
            <SelectItem value="5">5+ Years</SelectItem>
            <SelectItem value="7">7+ Years</SelectItem>
            <SelectItem value="10">10+ Years</SelectItem>
            <SelectItem value="15">15+ Years</SelectItem>
            <SelectItem value="20">20+ Years</SelectItem>
          </SelectContent>
        </Select>

      </div>



    </div>
  );
}