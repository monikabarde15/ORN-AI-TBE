import AboutTab from "./AboutTab";
import PdfViewerContent from "./PdfViewerContent";
import QuizPlayer from "./QuizPlayer";
import VideoPlayerContent from "./VideoPlayerContent";

interface ContentAreaProps {
  mode: "about" | "lesson" | "quiz";

  course: any;

  lecture: any;
}

const ContentArea = ({
  mode,
  course,
  lecture,
}: ContentAreaProps) => {
  const renderContent = () => {
    switch (mode) {
      case "about":
        return (
          <AboutTab
            course={course}
          />
        );

      case "lesson":
        if (
          lecture?.videoUrl
        ) {
          return (
            <VideoPlayerContent
              course={course}
              lecture={lecture}
            />
          );
        }

        if (
          lecture?.pdfUrl
        ) {
          return (
            <PdfViewerContent
              course={course}
              lecture={lecture}
            />
          );
        }

        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              No content found
            </h2>
          </div>
        );

      case "quiz":
        return (
          <QuizPlayer
            lecture={lecture}
          />
        );

      default:
        return (
          <AboutTab
            course={course}
          />
        );
    }
  };

  return (
    <main
      className="
        flex-1
        overflow-y-auto
        bg-[#F7F8FA]
      "
    >
      <div className="max-w-[1200px] mx-auto p-6 lg:p-8">
        {renderContent()}
      </div>
    </main>
  );
};

export default ContentArea;