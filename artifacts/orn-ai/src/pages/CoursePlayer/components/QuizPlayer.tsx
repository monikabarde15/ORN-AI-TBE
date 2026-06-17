import { useMemo, useState, useCallback } from "react";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Award, HelpCircle } from "lucide-react";

interface QuizPlayerProps {
  lecture: any;
  onQuizCompleted: (lessonId: string) => void;
}

const QuizPlayer = ({ lecture, onQuizCompleted }: QuizPlayerProps) => {
  const quizzes = lecture?.quizzes || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const currentQuiz = quizzes[currentQuestion];
  const isLastQuestion = currentQuestion === quizzes.length - 1;
  const isAnswered = answers[currentQuestion] !== undefined;

  // Calculate score
  const score = useMemo(() => {
    let total = 0;
    quizzes.forEach((quiz: any, index: number) => {
      if (answers[index] === quiz.correctAnswer) {
        total++;
      }
    });
    return total;
  }, [answers, quizzes]);

  // Check if all questions are answered
  const allAnswered = quizzes.every((_: any, index: number) => answers[index] !== undefined);

  // Check if all answers are correct
  const allCorrect = useMemo(() => {
    return quizzes.every((quiz: any, index: number) => answers[index] === quiz.correctAnswer);
  }, [answers, quizzes]);

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (submitted) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: optionIndex,
      }));
      if (showFeedback) {
        setShowFeedback(false);
        setFeedbackMessage("");
      }
    },
    [currentQuestion, submitted, showFeedback]
  );

  const handleNext = useCallback(() => {
    if (!isAnswered) {
      setShowFeedback(true);
      setFeedbackMessage("Please select an answer before continuing.");
      return;
    }
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [isAnswered, currentQuestion, quizzes.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(() => {
    if (!allAnswered) {
      setShowFeedback(true);
      setFeedbackMessage(`Please answer all ${quizzes.length} questions before submitting.`);
      return;
    }

    if (allCorrect) {
      setSubmitted(true);
      localStorage.setItem(`quiz_${lecture.id}`, "completed");
    } else {
      setShowFeedback(true);
      setFeedbackMessage("Some answers are incorrect. Review and try again.");
    }
  }, [allAnswered, allCorrect, quizzes.length, lecture.id]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setShowFeedback(false);
    setFeedbackMessage("");
  }, []);

  const handleContinue = useCallback(() => {
    onQuizCompleted(lecture.id);
  }, [lecture.id, onQuizCompleted]);

  // Get chapter number
  const getChapterNumber = () => {
    if (lecture?.title) {
      const match = lecture.title.match(/Chapter\s+(\d+)/i);
      if (match) return match[1];
    }
    return "";
  };

  // No quiz available
  if (!quizzes.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <HelpCircle size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Available</h3>
        <p className="text-gray-500 text-center max-w-md">This lesson does not contain any quiz questions.</p>
      </div>
    );
  }

  // Quiz Completed Success Screen
  if (submitted) {
    const isPerfectScore = score === quizzes.length;

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className={`
          w-24 h-24 rounded-full flex items-center justify-center mb-6
          ${isPerfectScore ? "bg-green-100" : "bg-yellow-100"}
          transition-all duration-500
        `}>
          {isPerfectScore ? (
            <CheckCircle size={48} className="text-green-600" />
          ) : (
            <Award size={48} className="text-yellow-600" />
          )}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
          {isPerfectScore ? "Perfect Score! 🎉" : "Quiz Completed!"}
        </h2>
        
        <p className="text-gray-600 text-lg mb-2 text-center">
          You scored <span className={`font-bold text-2xl ${isPerfectScore ? "text-green-600" : "text-gray-900"}`}>
            {score}
          </span> out of <span className="font-bold text-2xl text-gray-900">{quizzes.length}</span>
        </p>
        
        {isPerfectScore && (
          <p className="text-green-600 text-sm mb-6">Excellent work! All answers correct! 👏</p>
        )}
        
        {!isPerfectScore && (
          <p className="text-yellow-600 text-sm mb-6">You got {score} out of {quizzes.length} correct.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {!isPerfectScore && (
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto"
            >
              Retry Quiz
            </button>
          )}
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            Continue to Next Lesson
          </button>
        </div>
      </div>
    );
  }

  // Quiz Questions - Industry Grade Design
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
            Quiz
          </span>
          <span className="text-xs sm:text-sm text-gray-400">•</span>
          <span className="text-xs sm:text-sm font-medium text-gray-500">
            Chapter {getChapterNumber()}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Chapter {getChapterNumber()} Quiz
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
          This quiz is a short assessment to help solidify the learning you just went through in this chapter.
        </p>
      </div>

      {/* Progress Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Question {currentQuestion + 1} of {quizzes.length}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-400">
            {Math.round(((currentQuestion + 1) / quizzes.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 shadow-sm">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">
              {currentQuestion + 1}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase">Question</span>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
              {currentQuiz?.question}
            </h3>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 sm:space-y-3">
          {currentQuiz?.options?.map((option: string, optionIndex: number) => {
            const selected = answers[currentQuestion] === optionIndex;

            return (
              <button
                key={optionIndex}
                onClick={() => handleOptionSelect(optionIndex)}
                disabled={submitted}
                className={`
                  w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-lg
                  transition-all duration-200
                  flex items-center gap-3 sm:gap-4
                  ${
                    selected
                      ? "bg-red-50 border-2 border-red-500 shadow-sm"
                      : "bg-gray-50 border-2 border-transparent hover:border-red-300 hover:bg-red-50/50"
                  }
                  ${submitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                `}
              >
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selected ? "border-red-500 bg-red-500" : "border-gray-300"}
                `}>
                  {selected && (
                    <CheckCircle size={12} className="text-white" />
                  )}
                </div>
                <span className={`text-sm sm:text-base ${selected ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`
          mb-6 p-3 sm:p-4 rounded-lg
          ${feedbackMessage.includes("incorrect") || feedbackMessage.includes("wrong")
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-yellow-50 border border-yellow-200 text-yellow-700"
          }
        `}>
          <div className="flex items-center gap-2">
            {feedbackMessage.includes("incorrect") || feedbackMessage.includes("wrong") ? (
              <XCircle size={18} className="text-red-500 flex-shrink-0" />
            ) : (
              <CheckCircle size={18} className="text-yellow-500 flex-shrink-0" />
            )}
            <span className="text-sm sm:text-base">{feedbackMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`
            flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg
            text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center
            ${currentQuestion === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-gray-400">
            {Object.keys(answers).length} / {quizzes.length} answered
          </span>
          <div className="flex gap-1.5">
            {quizzes.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${currentQuestion === index
                    ? "bg-red-600 w-6"
                    : answers[index] !== undefined
                    ? "bg-green-500"
                    : "bg-gray-300"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`
              px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg
              text-sm font-semibold transition-all duration-200 w-full sm:w-auto
              ${allAnswered
                ? "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`
              flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg
              text-sm font-semibold transition-all duration-200 w-full sm:w-auto justify-center
              ${isAnswered
                ? "bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;