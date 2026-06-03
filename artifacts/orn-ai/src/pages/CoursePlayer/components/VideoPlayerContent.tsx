import { PlayCircle } from "lucide-react";

interface VideoPlayerContentProps {
  course: any;
  lecture: any;
}

const VideoPlayerContent = ({
  course,
  lecture,
}: VideoPlayerContentProps) => {
  return (
    <div className="space-y-6">
      {/* Video Section */}
      <div className="overflow-hidden rounded-3xl bg-black shadow-sm">
        <div className="aspect-video">
          <video
            src={lecture?.videoUrl}
            controls
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Lesson Info */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <PlayCircle
            size={24}
            className="text-red-500"
          />

          <span className="text-sm font-medium text-red-500 uppercase tracking-wide">
            Lesson
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          {lecture?.title}
        </h1>

        {lecture?.duration && (
          <p className="mt-3 text-sm text-gray-500">
            Duration: {lecture.duration}
          </p>
        )}

        {lecture?.description && (
          <div className="mt-6 border-t pt-6">
            <h2 className="mb-3 text-lg font-semibold">
              About this lesson
            </h2>

            <p className="leading-7 text-gray-600">
              {lecture.description}
            </p>
          </div>
        )}
      </div>

      {/* Temporary Course Info */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Course Information
        </h2>

        <div className="space-y-3 text-gray-600">
          <p>
            <strong>Course:</strong>{" "}
            {course?.courseName}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {course?.category}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {course?.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerContent;