// artifacts\orn-ai\src\pages\MCQResultsView.tsx
import React from 'react';
import { Question } from '../lib/MCQTypes';

interface MCQResultsViewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onRestart?: () => void;
}

export const MCQResultsView: React.FC<MCQResultsViewProps> = ({
  questions,
  userAnswers,
  onRestart,
}) => {
  // Score calculations
  const totalQuestions = questions.length;
  const correctCount = questions.reduce((acc, current, idx) => {
    return userAnswers[idx] === current.correctOptionIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="bg-slate-50 min-h-screen p-6 text-slate-800 rounded-xl border border-slate-200">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Main Score Summary Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Results Summary</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">Exam Complete</h2>
            <p className="text-slate-500 text-sm mt-1">Below is the complete audit of your test responses.</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Accuracy</span>
              <span className="text-3xl font-extrabold text-indigo-600">{percentage}%</span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Score</span>
              <span className="text-3xl font-extrabold text-slate-800">{correctCount} / {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Detailed Review Checklist */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Response Audit List</h3>

          {questions.map((question, idx) => {
            const userAnswerIndex = userAnswers[idx];
            const isCorrect = userAnswerIndex === question.correctOptionIndex;
            const isSkipped = userAnswerIndex === undefined;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl border p-6 shadow-sm ${
                  isSkipped
                    ? 'border-amber-200 bg-amber-50/10'
                    : isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Question {idx + 1}</span>
                    <h4 className="text-base font-medium text-slate-800 mt-0.5 leading-relaxed">
                      {question.text}
                    </h4>
                  </div>
                  
                  {/* Status Badge */}
                  <div>
                    {isSkipped ? (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
                        Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200">
                        Correct
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium border border-rose-200">
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Display Options and verify against answers */}
                <div className="space-y-2 mt-2">
                  {question.options.map((option, optIdx) => {
                    const isUserChoice = userAnswerIndex === optIdx;
                    const isCorrectAnswer = question.correctOptionIndex === optIdx;

                    let optionBorderClass = 'border-slate-200 bg-white';
                    let badgeNode = null;

                    if (isCorrectAnswer) {
                      optionBorderClass = 'border-emerald-500 bg-emerald-50/30 font-medium text-emerald-900';
                      badgeNode = (
                        <span className="text-xs font-semibold text-emerald-600 ml-auto flex items-center space-x-1">
                          <span>✓ Correct Option</span>
                        </span>
                      );
                    } else if (isUserChoice && !isCorrect) {
                      optionBorderClass = 'border-rose-500 bg-rose-50/30 font-medium text-rose-900';
                      badgeNode = (
                        <span className="text-xs font-semibold text-rose-600 ml-auto">
                          ✗ Your Selection
                        </span>
                      );
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center p-3.5 rounded-lg border text-sm transition ${optionBorderClass}`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs mr-3 ${
                          isCorrectAnswer
                            ? 'bg-emerald-600 text-white'
                            : isUserChoice
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-slate-700">{option}</span>
                        {badgeNode}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {onRestart && (
          <div className="flex justify-center pt-4">
            <button
              onClick={onRestart}
              className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition"
            >
              Retake Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};