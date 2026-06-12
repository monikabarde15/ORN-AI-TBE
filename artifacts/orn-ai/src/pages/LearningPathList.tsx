import { useEffect, useState } from "react";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";
import {
  BookOpen,
  ExternalLink,
  Eye,
} from "lucide-react";

export default function LearningPathList() {
  const [loading, setLoading] =
    useState(true);

  const [paths, setPaths] =
    useState<any[]>([]);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  const loadLearningPaths =
    async () => {
      try {
        const res =
          await api.get(
            "/api/learning-paths"
          );

        setPaths(
          res.data.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Shell>
      <div className="p-6">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Learning Paths
            </h1>

            <p className="text-slate-500">
              Manage all learning paths
            </p>
          </div>


          <div className="rounded-2xl bg-blue-100 px-4 py-2 font-semibold text-blue-700">
            {paths.length} Paths
          </div>
        <a
  href="/learning-paths"
  className="
    inline-flex
    items-center
    gap-2
    rounded-lg
    bg-blue-600
    px-3
    py-2
    text-sm
    font-medium
    text-white
  "
>
  📚 Learning Paths
</a>

        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {paths.map((path) => (
              <div
                key={path.id}
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <img
                  src={
                    path.thumbnail ||
                    "https://placehold.co/600x400"
                  }
                  alt=""
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {path.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                    {path.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} />
                    {path.courses?.length || 0}
                    Courses
                  </div>

                  <div className="mt-5 flex gap-3">

                    <button
                      className="
                        flex-1
                        rounded-xl
                        bg-blue-600
                        py-3
                        font-medium
                        text-white
                      "
                    >
                      <Eye
                        size={16}
                        className="mr-2 inline"
                      />
                      View
                    </button>

                    {path.paymentLink && (
                      <a
                        href={
                          path.paymentLink
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          border
                          px-4
                        "
                      >
                        <ExternalLink
                          size={18}
                        />
                      </a>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </Shell>
  );
}
