import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import countryList from "country-list-with-dial-code-and-flag";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  nameLower: string;
  codeLower: string;
}

const ALL_COUNTRIES: CountryItem[] = countryList
  .getAll()
  .map((c) => ({
    code: c.countryCode,
    name: c.name,
    flag: c.flag,
    nameLower: c.name.toLowerCase(),
    codeLower: c.countryCode.toLowerCase(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface CountryComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CountryCombobox({
  value,
  onChange,
  placeholder = "Select country...",
  searchPlaceholder = "Search country...",
  disabled = false,
  className,
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = React.useMemo(() => {
    if (!value) return null;
    const valLower = value.toLowerCase();
    return ALL_COUNTRIES.find(
      (c) => c.codeLower === valLower || c.nameLower === valLower
    );
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal h-10 px-3 bg-background border-input text-left",
            !selectedCountry && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="truncate text-sm">{selectedCountry.name}</span>
            </div>
          ) : (
            <span className="text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] min-w-[280px] p-0 z-50 shadow-md"
        align="start"
      >
        <Command
          filter={(itemValue, search) => {
            const q = search.trim().toLowerCase();
            if (!q) return 1;

            const country = ALL_COUNTRIES.find((c) => c.code === itemValue);
            if (!country) return 0;

            // Exact match gets highest score
            if (country.nameLower === q || country.codeLower === q) return 1;
            // Prefix match gets high score
            if (country.nameLower.startsWith(q) || country.codeLower.startsWith(q)) return 0.8;
            // Word boundary prefix match
            const words = country.nameLower.split(/\s+/);
            if (words.some((w) => w.startsWith(q))) return 0.7;
            // Substring match gets baseline score
            if (country.nameLower.includes(q) || country.codeLower.includes(q)) return 0.4;

            return 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} className="h-9 text-sm" />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No country found.
            </CommandEmpty>
            <CommandGroup>
              {ALL_COUNTRIES.map((country) => {
                const isSelected = selectedCountry?.code === country.code;
                return (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {country.code}
                    </span>
                    <Check
                      className={cn(
                        "ml-2 size-4 text-primary shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
