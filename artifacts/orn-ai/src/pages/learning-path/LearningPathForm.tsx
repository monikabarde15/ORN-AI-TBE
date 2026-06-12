import {
  BookOpen,
  Sparkles,
  FileText,
} from "lucide-react";

interface Props {
  title: string;
  description: string;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
}

export default function LearningPathForm({
  title,
  description,
  setTitle,
  setDescription,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-sm border border-slate-200">

      {/* Header */}
     {/* Header */}
<div className="border-b bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">

  <div className="flex items-start justify-between">

    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
        <BookOpen size={28} />
      </div>

      <div>
        <div className="mb-1 flex items-center gap-2 text-blue-100">
          <Sparkles size={16} />
          <span className="text-sm">
            Learning Ecosystem
          </span>
        </div>

        <h2 className="text-2xl font-bold">
          Learning Path Details
        </h2>

        <p className="mt-1 text-blue-100">
          Create a structured learning roadmap
        </p>
      </div>

    </div>

    {/* List Button */}
    <a
      href="/recruiter/learning-path-list"
      className="
        rounded-xl
        bg-white
        px-4
        py-2
        text-sm
        font-semibold
        text-blue-600
        shadow
        transition
        hover:bg-blue-50
      "
    >
      📚 View List
    </a>

  </div>

</div>

      {/* Form */}
      <div className="p-8">

        <div className="space-y-6">

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BookOpen size={16} />
              Learning Path Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Full Stack Developer Roadmap"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-5
                py-4
                text-sm
                outline-none
                transition-all
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText size={16} />
              Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe what learners will achieve through this learning path..."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-5
                py-4
                text-sm
                outline-none
                transition-all
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {description.length}/1000
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}