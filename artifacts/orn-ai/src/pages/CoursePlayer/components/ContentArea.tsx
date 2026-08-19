import AboutTab from "./AboutTab";
import PdfViewerContent from "./PdfViewerContent";
import QuizPlayer from "./QuizPlayer";
import VideoPlayerContent from "./VideoPlayerContent";
import FinalAssessment from "./FinalAssessment";
import CertificatePerformanceView from "./CertificatePerformanceView";
import MobileCourseContent from "./sidebar/MobileCourseContent";

interface ContentAreaProps {
  mode: "about" | "lesson" | "quiz" | "finalAssessment";
  course: any;
  lecture: any;
  relatedCourses: any[];
  categoryName: string;

  onQuizCompleted: () => void;
  onLessonCompleted?: (lessonId: string) => void;

  sections: any[];
  currentLecture: any;

  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  onLessonSelect: (lesson: any) => void;
  onQuizSelect: (lesson: any) => void;
  onFinalAssessmentSelect: () => void;
  onPreviousLesson: () => void;
  onNextLesson: () => void;
}

const ContentArea = ({
  mode,
  course,
  lecture,
  relatedCourses,
  onQuizCompleted,
  onLessonCompleted,
  categoryName,
  sections,
  currentLecture,

  expandedSections,
  setExpandedSections,

  onLessonSelect,
  onQuizSelect,

  onFinalAssessmentSelect,
  onPreviousLesson,
  onNextLesson,
}: ContentAreaProps) => {
  const renderContent = () => {
    switch (mode) {
      case "about":
        return (
          <AboutTab
            course={course}
            relatedCourses={relatedCourses}
             categoryName={categoryName}
          />
        );

      case "lesson":
        if (lecture?.videoUrl) {
          return (
            <VideoPlayerContent
              course={course}
              lecture={lecture}
              onPreviousLesson={
                onPreviousLesson
              }
              onNextLesson={
                onNextLesson
              }
              onLessonCompleted={
                onLessonCompleted
              }
            />
          );
        }

        if (lecture?.pdfUrl) {
          return (
            <PdfViewerContent
              course={course}
              lecture={lecture}
            />
          );
        }

        return (
          <div className="flex items-center justify-center h-full bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Found</h3>
              <p className="text-gray-500">This lesson does not have any content available.</p>
            </div>
          </div>
        );

      case "quiz":
        return (
          <QuizPlayer
            lecture={lecture}
            onQuizCompleted={onQuizCompleted}
          />
        );

      case "finalAssessment":
        return <FinalAssessment course={course} />;

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
    min-w-0
    min-h-0
    overflow-y-auto
    bg-[#F7F8FA]
    scrollbar-hide
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
    [&::-webkit-scrollbar]:w-0
  "
    >
      <div className="lg:hidden">
        <MobileCourseContent
          sections={sections}
          currentLecture={currentLecture}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          onLessonSelect={onLessonSelect}
          onQuizSelect={onQuizSelect}
          onFinalAssessmentSelect={onFinalAssessmentSelect}
          />
      </div>
          {renderContent()}
    </main>
  );
};

export default ContentArea;