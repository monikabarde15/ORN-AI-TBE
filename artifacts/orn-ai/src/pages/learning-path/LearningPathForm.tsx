import {
  BookOpen,
  Sparkles,
  FileText,
  Eye,
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
    <div>

      {/* Header */}
      <div className="mb-8 mt-6"
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-5">

            <div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Learning Path Details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter the basic information for your learning path.
              </p>
            </div>


          </div>

          {/* List Button */}
          <a
            href="/recruiter/learning-path-list"
            className="
  inline-flex
  items-center
  rounded-xl
  border
  border-slate-200
  bg-blue-900
  px-4
  py-2
  text-sm
  font-medium
  text-white
  transition
  hover:bg-blue-800
"
          >
            👁 View List
          </a>

        </div>

      </div>

      {/* Form */}
      <div className="pt-0">

        <div className="space-y-6">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name of the learning path
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
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
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

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Explain what learners will achieve.
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
                rounded-xl
                border
                border-slate-200
                bg-white
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
              {(description || "").length}/1000
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}