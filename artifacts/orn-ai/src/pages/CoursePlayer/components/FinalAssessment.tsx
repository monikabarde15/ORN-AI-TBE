import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Save, ShieldCheck } from "lucide-react";
import CertificateModal from "./CertificateModal";
import { saveFinalAssessmentStorage, loadCourseProgress } from "../utils/progressStorage";
import { useAuth } from "@/hooks/use-auth";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface FinalAssessmentProps {
  course: any;
}

const DEFAULT_ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary objective of DevOps in modern software engineering?",
    options: [
      "Separating development and operations teams",
      "Shortening the systems development life cycle and providing continuous delivery",
      "Eliminating the need for automated testing",
      "Replacing all cloud infrastructure with local servers"
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which Version Control System command is used to record changes to the repository?",
    options: ["git clone", "git push", "git commit", "git checkout"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What is the key advantage of Infrastructure as Code (IaC)?",
    options: [
      "Manual server configurations are faster",
      "Allows automated, repeatable, and version-controlled infrastructure provisioning",
      "It eliminates the need for network security",
      "It only works with physical hardware"
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "In continuous integration pipelines, when should automated unit tests be run?",
    options: [
      "Only after deploying to production",
      "Automatically on every code commit or pull request",
      "Once every month",
      "Only when a bug is reported by end users"
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What role does containerization (e.g. Docker) play in application deployment?",
    options: [
      "It increases application package sizes",
      "It packages code and dependencies together so applications run reliably across environments",
      "It removes the need for operating system kernels",
      "It replaces traditional database management systems"
    ],
    correctAnswer: 1,
  },
];

const FinalAssessment = ({ course }: FinalAssessmentProps) => {
  const { user } = useAuth();
  const courseId = course?.id;

  const [questions, setQuestions] = useState<Question[]>(DEFAULT_ASSESSMENT_QUESTIONS);
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    completed: boolean;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    date: string;
    answers: Record<number, number>;
  } | null>(null);

  const [showCertificate, setShowCertificate] = useState(false);

  // Extract quizzes from course sections if available
  useEffect(() => {
    if (course?.sections) {
      const extractedQuizzes: Question[] = [];
      let qId = 1;
      course.sections.forEach((section: any) => {
        section.lessons?.forEach((lesson: any) => {
          lesson.quizzes?.forEach((quiz: any) => {
            if (quiz.question && Array.isArray(quiz.options) && quiz.options.length > 0) {
              extractedQuizzes.push({
                id: qId++,
                question: quiz.question,
                options: quiz.options,
                correctAnswer: typeof quiz.correctAnswer === "number" ? quiz.correctAnswer : 0,
              });
            }
          });
        });
      });

      if (extractedQuizzes.length >= 3) {
        setQuestions(extractedQuizzes);
      }
    }
  }, [course]);

  // Load existing saved assessment result from storage
  useEffect(() => {
    if (courseId) {
      const savedData = loadCourseProgress(user?.id, courseId);
      if (savedData.finalAssessment) {
        setAssessmentResult(savedData.finalAssessment);
        setSelectedAnswers(savedData.finalAssessment.answers || {});
        if (savedData.finalAssessment.completed) {
          setCurrentStep("result");
        }
      }
    }
  }, [courseId, user?.id]);

  const handleOptionSelect = (optionIndex: number) => {
    const updated = {
      ...selectedAnswers,
      [currentQuestionIdx]: optionIndex,
    };
    setSelectedAnswers(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1200);

    // Save step state
    if (courseId) {
      const currentScore = calculateCurrentScore(updated);
      saveFinalAssessmentStorage(user?.id, courseId, {
        completed: false,
        score: currentScore,
        total: questions.length,
        percentage: Math.round((currentScore / questions.length) * 100),
        passed: currentScore / questions.length >= 0.6,
        date: new Date().toISOString(),
        answers: updated,
      });
    }
  };

  const calculateCurrentScore = (answersObj: Record<number, number>) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answersObj[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitAssessment = () => {
    const score = calculateCurrentScore(selectedAnswers);
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const resultObj = {
      completed: true,
      score,
      total,
      percentage,
      passed,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      answers: selectedAnswers,
    };

    setAssessmentResult(resultObj);
    setCurrentStep("result");

    if (courseId) {
      saveFinalAssessmentStorage(user?.id, courseId, resultObj);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setCurrentStep("quiz");
  };

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {/* INTRO STEP */}
      {currentStep === "intro" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#102B6A] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Course Final Step
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Course Final Assessment
              </h1>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
            Demonstrate your mastery of <strong>{course?.courseName || course?.title || "this course"}</strong>.
            Completing this final assessment with a score of <strong>60% or higher</strong> will earn you your official Certificate of Completion!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-center p-3 bg-white rounded-lg shadow-2xs">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Questions</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{questions.length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-2xs">
              <p className="text-xs text-gray-500 uppercase font-semibold">Passing Score</p>
              <p className="text-xl font-bold text-green-600 mt-1">60%</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-2xs">
              <p className="text-xs text-gray-500 uppercase font-semibold">Reward</p>
              <p className="text-sm font-bold text-amber-600 mt-1">Official Certificate</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentStep("quiz")}
              className="px-6 py-3 bg-[#0B1F4D] hover:bg-[#102B6A] text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </button>

            {assessmentResult?.completed && (
              <button
                onClick={() => setCurrentStep("result")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all"
              >
                View Previous Result ({assessmentResult.percentage}%)
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ STEP */}
      {currentStep === "quiz" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          {/* Header & Step progress */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                Assessment Test
              </h2>
            </div>

            {isSaved && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full animate-in fade-in duration-200">
                <Save className="w-3.5 h-3.5" />
                Step Saved
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-[#102B6A] h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-5 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-[#102B6A] bg-blue-50/70 text-[#102B6A] font-medium shadow-2xs"
                      : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                      isSelected
                        ? "border-[#102B6A] bg-[#102B6A] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm leading-relaxed">{optionText}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                disabled={selectedAnswers[currentQuestionIdx] === undefined}
                className="px-6 py-2.5 bg-[#102B6A] hover:bg-[#0B1F4D] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULT STEP */}
      {currentStep === "result" && assessmentResult && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="text-center max-w-lg mx-auto mb-8">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
                assessmentResult.passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {assessmentResult.passed ? (
                <ShieldCheck className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>

            <span
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                assessmentResult.passed
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {assessmentResult.passed ? "Assessment Passed 🎉" : "Assessment Not Passed"}
            </span>

            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Your Score: {assessmentResult.percentage}%
            </h2>
            <p className="text-sm text-gray-500">
              Answered {assessmentResult.score} out of {assessmentResult.total} questions correctly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
            {assessmentResult.passed ? (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <Award className="w-5 h-5" />
                View & Print Certificate
              </button>
            ) : (
              <p className="text-xs text-gray-500 w-full text-center">
                Score at least 60% to unlock your official Certificate of Completion.
              </p>
            )}

            <button
              onClick={handleRetake}
              className="px-5 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200 transition-colors text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Question Answers Review
            </h3>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isCorrect ? "border-green-200 bg-green-50/40" : "border-red-200 bg-red-50/40"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-xs text-gray-600">
                        Your answer:{" "}
                        <span className={isCorrect ? "font-medium text-green-700" : "font-medium text-red-700"}>
                          {userAns !== undefined ? q.options[userAns] : "Not Answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-green-700 font-medium">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        studentName={user?.name || user?.email?.split("@")[0] || "Learner"}
        courseTitle={course?.courseName || course?.title || "DevOps with Backend Development"}
        completionDate={assessmentResult?.date}
      />
    </div>
  );
};

export default FinalAssessment;