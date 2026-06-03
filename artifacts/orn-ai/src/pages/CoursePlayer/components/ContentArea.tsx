import AboutTab from "./AboutTab";
import PdfViewerContent from "./PdfViewerContent";
import QuizPlayer from "./QuizPlayer";
import VideoPlayerContent from "./VideoPlayerContent";
import FinalAssessment from "./FinalAssessment";
interface ContentAreaProps {
  mode: "about" | "lesson" | "quiz" | "finalAssessment";
  course: any;
  lecture: any;
  relatedCourses: any[];
   onQuizCompleted: () => void;
}

const ContentArea = ({
  mode,
  course,
  lecture,
  relatedCourses,
  onQuizCompleted,
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

      case "finalAssessment":
  return (
    <FinalAssessment />
  );
        case "quiz":
        return (
          <QuizPlayer
            lecture={lecture}
            onQuizCompleted={
        onQuizCompleted
      }
          />
        );

      default:
        return (
          <AboutTab
            course={course}
            relatedCourses={relatedCourses}
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