import { Badge } from "@/components/ui/badge";

const suggestions = [
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Full Stack Developer",
  "AWS Engineer",
  "DevOps Engineer",
  "AI Engineer",
  "Angular Developer",
  "Frontend Developer",
];

interface Props {
  onSelect: (value: string) => void;
}

export default function AISearchSuggestions({
  onSelect,
}: Props) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {suggestions.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          onClick={() => onSelect(item)}
          className="cursor-pointer rounded-full px-4 py-2 text-sm hover:bg-primary hover:text-white transition"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}