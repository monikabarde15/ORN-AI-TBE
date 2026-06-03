import { useMemo, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizPlayerProps {
  lecture: any;
}

const QuizPlayer = ({
  lecture,
}: QuizPlayerProps) => {
  const quizzes =
    lecture?.quizzes || [];

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  const [answers,
    setAnswers] =
    useState<Record<number, number>>(
      {}
    );

  const [submitted,
    setSubmitted] =
    useState(false);

  const currentQuiz =
    quizzes[currentQuestion];

  const score = useMemo(() => {
    let total = 0;

    quizzes.forEach(
      (
        quiz: any,
        index: number
      ) => {
        if (
          answers[index] ===
          quiz.correctAnswer
        ) {
          total++;
        }
      }
    );

    return total;
  }, [answers, quizzes]);

  const handleOptionSelect = (
    optionIndex: number
  ) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]:
        optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!quizzes.length) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold">
          No Quiz Available
        </h2>

        <p className="mt-3 text-gray-500">
          This lesson does not
          contain any quiz
          questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Result Screen */}
      {submitted && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <CheckCircle
              size={40}
              className="text-green-500"
            />

            <div>
              <h2 className="text-3xl font-bold">
                Quiz Completed
              </h2>

              <p className="mt-2 text-gray-500">
                You scored{" "}
                <span className="font-semibold text-gray-900">
                  {score}
                </span>{" "}
                out of{" "}
                {quizzes.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Card */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-red-500 uppercase">
            Assessment
          </p>

          <h1 className="text-3xl font-bold">
            Lesson Quiz
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>
              Question{" "}
              {currentQuestion + 1}
            </span>

            <span>
              {quizzes.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{
                width: `${
                  ((currentQuestion +
                    1) /
                    quizzes.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold leading-relaxed">
            {currentQuiz?.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuiz?.options?.map(
            (
              option: string,
              optionIndex: number
            ) => {
              const selected =
                answers[
                  currentQuestion
                ] ===
                optionIndex;

              const isCorrect =
                optionIndex ===
                currentQuiz.correctAnswer;

              let optionClass =
                "border-gray-200 hover:border-red-300";

              if (
                submitted &&
                isCorrect
              ) {
                optionClass =
                  "border-green-500 bg-green-50";
              }

              if (
                submitted &&
                selected &&
                !isCorrect
              ) {
                optionClass =
                  "border-red-500 bg-red-50";
              }

              if (
                !submitted &&
                selected
              ) {
                optionClass =
                  "border-red-500 bg-red-50";
              }

              return (
                <button
                  key={
                    optionIndex
                  }
                  onClick={() =>
                    handleOptionSelect(
                      optionIndex
                    )
                  }
                  className={`
                    w-full
                    rounded-2xl
                    border
                    p-5
                    text-left
                    transition-all
                    ${optionClass}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {option}
                    </span>

                    {submitted &&
                      isCorrect && (
                        <CheckCircle
                          size={18}
                          className="text-green-500"
                        />
                      )}

                    {submitted &&
                      selected &&
                      !isCorrect && (
                        <XCircle
                          size={18}
                          className="text-red-500"
                        />
                      )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            disabled={
              currentQuestion === 0
            }
            onClick={() =>
              setCurrentQuestion(
                (prev) =>
                  prev - 1
              )
            }
            className="
              rounded-xl
              border
              px-5
              py-3
              disabled:opacity-40
            "
          >
            Previous
          </button>

          {!submitted &&
          currentQuestion ===
            quizzes.length - 1 ? (
            <button
              onClick={
                handleSubmit
              }
              className="
                rounded-xl
                bg-red-500
                px-6
                py-3
                font-medium
                text-white
              "
            >
              Submit Quiz
            </button>
          ) : (
            <button
              disabled={
                currentQuestion ===
                quizzes.length - 1
              }
              onClick={() =>
                setCurrentQuestion(
                  (prev) =>
                    prev + 1
                )
              }
              className="
                rounded-xl
                bg-gray-900
                px-6
                py-3
                font-medium
                text-white
                disabled:opacity-40
              "
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;