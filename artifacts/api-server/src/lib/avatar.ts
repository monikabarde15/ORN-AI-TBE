export function normalizeName(name: string): string {
  return String(name ?? "").trim().replace(/\s+/g, " ");
}

export function isLikelyFemale(name: string): boolean {
  const firstName = normalizeName(name).split(" ")[0] || "";
  const lower = firstName.toLowerCase();

  if (!lower) {
    return false;
  }

  const femaleNames = new Set([
    "monica",
    "monika",
    "sonia",
    "sonya",
    "anita",
    "amina",
    "maria",
    "preeti",
    "neha",
    "sneha",
    "anya",
    "anaya",
    "aisha",
    "alia",
    "reena",
    "nisha",
    "kavya",
    "divya",
    "sonal",
    "pinky",
  ]);

  if (femaleNames.has(lower)) {
    return true;
  }

  const maleExceptions = new Set([
    "andy",
    "gary",
    "tony",
    "henry",
    "randy",
    "jerry",
    "danny",
    "bobby",
    "kenny",
    "joey",
  ]);

  const femaleSuffixes = ["a", "e", "i", "y"];
  if (!femaleSuffixes.some((suffix) => lower.endsWith(suffix))) {
    return false;
  }

  return !maleExceptions.has(lower);
}

export function avatarForName(name: string): string {
  const cleaned = normalizeName(name) || "user";
  const gender = isLikelyFemale(cleaned) ? "female" : "male";
  const seed = cleaned.toLowerCase().replace(/\s+/g, "-");
  return `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(seed)}&gender=${gender}`;
}
