import { FileText, Download } from "lucide-react";

interface PdfViewerContentProps {
  course: any;
  lecture: any;
}

const PdfViewerContent = ({
  course,
  lecture,
}: PdfViewerContentProps) => {
  return (
    <div className="space-y-6">
      {/* PDF Viewer */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <FileText
              size={22}
              className="text-blue-600"
            />

            <div>
              <h2 className="font-semibold text-gray-900">
                {lecture?.title}
              </h2>

              <p className="text-sm text-gray-500">
                PDF Lesson
              </p>
            </div>
          </div>

          {lecture?.pdfUrl && (
            <a
              href={lecture.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Download size={16} />
              Download
            </a>
          )}
        </div>

        <iframe
          src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            lecture?.pdfUrl || ""
          )}`}
          title={lecture?.title}
          className="h-[850px] w-full"
        />
      </div>

      {/* Lesson Details */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          About this document
        </h2>

        <p className="leading-7 text-gray-600">
          {lecture?.description ||
            "No description available."}
        </p>

        {lecture?.duration && (
          <div className="mt-5 text-sm text-gray-500">
            Duration: {lecture.duration}
          </div>
        )}
      </div>

      {/* Course Info */}
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

export default PdfViewerContent;