// artifacts\orn-ai\src\pages\MCQExamPortal.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question, Assessment } from '../lib/MCQTypes';

// --- Types ---
export interface StudentMCQPortalProps {
  config?: {
    title: string;
    durationMinutes: number;
  };
  questions?: Question[];
  onSubmit?: (results: { answers: Record<number, number>; timeTakenSeconds: number }) => void;
  onExit?: () => void;
}

// --- High-Quality Mock Data ---
const DEFAULT_CONFIG: Assessment = {
  title: "AI Developer Screening Assessment",
  durationMinutes: 30,
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "Which of the following activation functions is most commonly applied in hidden layers of deep neural networks to mitigate vanishing gradients?",
    options: ["Sigmoid Function", "Tanh Function", "ReLU (Rectified Linear Unit)", "Linear Identity Function"],
    correctOptionIndex: 2,
    explanation: "ReLU is widely chosen because its derivative remains 1 for all positive values, preventing vanishing gradients during backpropagation.",
    difficulty: "Easy",
    marks: 1,
    timeLimitSeconds: 60,
    status: "Published"
  },
  {
    id: 'q2',
    text: "In machine learning regularization, how does L1 (Lasso) regularization fundamentally differ from L2 (Ridge) regularization?",
    options: [
      "L1 introduces a penalty based on absolute weight values, driving some weight factors to exactly zero.",
      "L2 restricts learning rates exponentially over epochs.",
      "L1 alters input features into perfectly normal distributions.",
      "L2 completely prevents weights from adapting during the first epoch."
    ],
    correctOptionIndex: 0,
    explanation: "L1 regularization uses absolute weight values which can drive weights to zero, effectively acting as an automated feature selector.",
    difficulty: "Medium",
    marks: 2,
    timeLimitSeconds: 90,
    status: "Published"
  },
  {
    id: 'q3',
    text: "What does temperature sampling control when generating responses with large language models?",
    options: [
      "The physical GPU core temperature thresholds.",
      "The randomness and creativity of the output probability distributions.",
      "The maximum token count allowed during generative sequences.",
      "The absolute learning rate utilized during training steps."
    ],
    correctOptionIndex: 1,
    explanation: "Lower temperatures focus probabilities onto peak choices making outputs predictable, while higher temperatures spread out likelihoods for varied generation.",
    difficulty: "Hard",
    marks: 3,
    timeLimitSeconds: 120,
    status: "Published"
  }
];

export const MCQExamPortal: React.FC<StudentMCQPortalProps> = ({
  config = DEFAULT_CONFIG,
  questions = DEFAULT_QUESTIONS,
  onSubmit,
  onExit,
}) => {
  // --- Portal Phase Step ---
  const [step, setStep] = useState<'landing' | 'skeleton' | 'testing' | 'results'>('landing');

  // --- Assessment Core States ---
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState<number>(config.durationMinutes * 60);
  
  // --- UI Filter & Save States ---
  const [paletteFilter, setPaletteFilter] = useState<'All' | 'Answered' | 'Not Answered' | 'Marked' | 'Not Visited'>('All');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // --- Start Assessment with Loading Transition ---
  const handleStartAssessment = () => {
    setStep('skeleton');
    setTimeout(() => {
      setStep('testing');
    }, 1500); // Simulate network/initialization skeleton delay
  };

  // --- Simulated Progress Auto-Save effect ---
  useEffect(() => {
    if (step !== 'testing') return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedAnswers, markedForReview, step]);

  // --- Real-time Countdown Timer ---
  useEffect(() => {
    if (step !== 'testing') return;
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  // Timer Color State Class Calculation
  const timerStyle = useMemo(() => {
    if (timeLeft < 120) {
      return 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-extrabold';
    }
    if (timeLeft < 600) {
      return 'bg-amber-50 border-amber-200 text-amber-600 font-bold';
    }
    return 'bg-slate-100 border-slate-200 text-slate-700 font-semibold';
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Handlers & Navigation ---
  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    setVisitedQuestions((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      handleQuestionSelect(currentIndex + 1);
    }
  }, [currentIndex, questions.length, handleQuestionSelect]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleQuestionSelect(currentIndex - 1);
    }
  }, [currentIndex, handleQuestionSelect]);

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const handleFinalSubmit = () => {
    setIsSubmitModalOpen(false);
    setStep('results');
    if (onSubmit) {
      onSubmit({
        answers: selectedAnswers,
        timeTakenSeconds: config.durationMinutes * 60 - timeLeft
      });
    }
  };

  // --- Keyboard Shortcuts Listener ---
  useEffect(() => {
    if (step !== 'testing' || isSubmitModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault(); // Prevent page scroll
        handleToggleMarkForReview();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key) - 1;
        const activeQ = questions[currentIndex];
        if (activeQ && optionIdx < activeQ.options.length) {
          handleOptionSelect(optionIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentIndex, questions, isSubmitModalOpen, handleNext, handlePrev]);

  // --- Real-time Progress Stats ---
  const stats = useMemo(() => {
    let answered = 0;
    questions.forEach((_, idx) => {
      if (selectedAnswers[idx] !== undefined) answered++;
    });
    return {
      answered,
      marked: markedForReview.size,
      remaining: questions.length - answered,
      total: questions.length
    };
  }, [selectedAnswers, markedForReview, questions]);

  // --- Filtering Palette Questions ---
  const filteredPaletteIndices = useMemo(() => {
    return questions.map((_, idx) => idx).filter((idx) => {
      const isAnswered = selectedAnswers[idx] !== undefined;
      const isMarked = markedForReview.has(idx);
      const isVisited = visitedQuestions.has(idx);

      if (paletteFilter === 'Answered') return isAnswered;
      if (paletteFilter === 'Not Answered') return isVisited && !isAnswered;
      if (paletteFilter === 'Marked') return isMarked;
      if (paletteFilter === 'Not Visited') return !isVisited;
      return true;
    });
  }, [questions, selectedAnswers, markedForReview, visitedQuestions, paletteFilter]);

  const currentQuestion = questions[currentIndex];

  // --- 1. SKELETON LOADING VIEW ---
  if (step === 'skeleton') {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="space-y-4 pt-8">
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-12 bg-slate-200 rounded-lg"></div>
          <div className="h-12 bg-slate-200 rounded-lg"></div>
          <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // --- 2. LANDING / INTRODUCTION PAGE ---
  if (step === 'landing') {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-950 p-8 text-white">
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300">Examination Entrance</span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1">{config.title}</h1>
            <p className="text-slate-300 text-sm mt-2">Ready to verify your skills? Read the assessment blueprint parameters before launching.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 text-xs block font-medium">Duration</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block">{config.durationMinutes} Minutes</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 text-xs block font-medium">Questions</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block">{questions.length} Items</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 text-xs block font-medium">Difficulty</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block">Medium</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 text-xs block font-medium">Passing Threshold</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block">70%</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b pb-2">Assessment Instructions</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 list-disc pl-5">
                <li>Read each question completely before choosing your response card.</li>
                <li>The evaluation timer runs continuously once started and <span className="font-semibold text-rose-600">cannot be paused</span>.</li>
                <li>You can flag or mark questions for subsequent review using the palette system.</li>
                <li>Your selection state is automatically saved instantly on answer choice clicks.</li>
              </ul>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleStartAssessment}
                className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. RESULTS PAGE SUMMARY ---
  if (step === 'results') {
    const totalQuestions = questions.length;
    const correctCount = questions.reduce((acc, current, idx) => {
      return selectedAnswers[idx] === current.correctOptionIndex ? acc + 1 : acc;
    }, 0);
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = scorePct >= 70;

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-300 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Completed Summary</span>
            <h2 className="text-2xl font-extrabold text-slate-800">Assessment Completed</h2>
            <p className="text-xs text-slate-500">A detailed breakdown of candidate metrics is available below.</p>
          </div>

          <div className="flex items-center space-x-6 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Accuracy</span>
              <span className={`text-2xl font-extrabold block ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scorePct}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
              <span className={`text-sm font-extrabold block uppercase mt-1 px-2.5 py-0.5 rounded-full border ${
                isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                {isPassed ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Detailed Report Audit</h3>
          
          {questions.map((question, idx) => {
            const userAnswerIdx = selectedAnswers[idx];
            const isCorrect = userAnswerIdx === question.correctOptionIndex;
            const isSkipped = userAnswerIdx === undefined;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl border p-6 space-y-4 transition shadow-sm ${
                  isSkipped ? 'border-amber-200 bg-amber-50/10' : isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Question {idx + 1}</span>
                    <h4 className="text-base font-semibold text-slate-800 mt-1 leading-relaxed">{question.text}</h4>
                  </div>
                  <div>
                    {isSkipped ? (
                      <span className="bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Skipped</span>
                    ) : isCorrect ? (
                      <span className="bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Correct</span>
                    ) : (
                      <span className="bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">Incorrect</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {question.options.map((opt, optIdx) => {
                    const isUserChoice = userAnswerIdx === optIdx;
                    const isCorrectAnswer = question.correctOptionIndex === optIdx;

                    let cardStyle = "border-slate-200 bg-white";
                    if (isCorrectAnswer) {
                      cardStyle = "border-emerald-500 bg-emerald-50/30 text-emerald-900 font-semibold";
                    } else if (isUserChoice && !isCorrect) {
                      cardStyle = "border-rose-500 bg-rose-50/30 text-rose-900 font-semibold";
                    }

                    return (
                      <div key={optIdx} className={`p-3.5 border rounded-xl text-sm flex items-center transition ${cardStyle}`}>
                        <span className={`w-6 h-6 rounded-md text-xs font-bold mr-3 flex items-center justify-center ${
                          isCorrectAnswer ? 'bg-emerald-600 text-white' : isUserChoice ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {question.explanation && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 mt-2">
                    <span className="font-bold text-slate-700 block mb-1">Explanation:</span>
                    {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {onExit && (
          <div className="flex justify-center pt-4">
            <button
              onClick={onExit}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Exit to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- 4. TESTING VIEW (CANDIDATE INTERACTIVE EXPERIENCE) ---
  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6 flex flex-col min-h-screen pb-28 animate-in fade-in duration-300">
      
      {/* Dynamic Header */}
      <header className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{config.title}</span>
          <div className="flex items-center space-x-2 mt-0.5">
            <h1 className="text-base font-extrabold text-slate-800">
              Question {currentIndex + 1} of {questions.length}
            </h1>
            <span className="text-slate-300">•</span>
            {/* Auto Save Indicator */}
            <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
              <span>{saveStatus === 'saving' ? 'Saving...' : '✓ Progress Saved'}</span>
            </span>
          </div>
        </div>

        {/* Enhanced Progress Dashboard */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-4 text-xs text-slate-500 font-semibold border-r pr-6 border-slate-200">
            <div>
              <span>Answered: </span>
              <span className="font-bold text-slate-800">{stats.answered}</span>
            </div>
            <div>
              <span>Marked: </span>
              <span className="font-bold text-amber-500">{stats.marked}</span>
            </div>
            <div>
              <span>Remaining: </span>
              <span className="font-bold text-slate-800">{stats.remaining}</span>
            </div>
          </div>

          {/* Warning Indicator Timer */}
          <div className={`px-5 py-2.5 rounded-xl border flex items-center space-x-2 transition-all duration-300 ${timerStyle}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-sm tracking-wider">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            Submit Assessment
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left/Middle Column: Question Box & Option Cards */}
        {currentQuestion && (
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
              
              {/* Question metadata badge bar */}
              <div className="flex items-center space-x-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : currentQuestion.difficulty === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  MARKS: {currentQuestion.marks}
                </span>
              </div>

              {/* Question text */}
              <h2 className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                {currentQuestion.text}
              </h2>

              {/* Modern Option Cards */}
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`w-full flex items-center text-left p-4 rounded-xl border transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-600/30 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {/* Interactive Selection indicators */}
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold mr-4 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                        {letter}
                      </span>
                      <span className={`text-sm md:text-base ${isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* Right Column: Question Palette and Status Filters */}
        <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Navigator Grid</h3>
          
          {/* Palette Filter Options */}
          <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-3">
            {(['All', 'Answered', 'Marked', 'Not Visited'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setPaletteFilter(filterOpt)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                  paletteFilter === filterOpt ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {filterOpt}
              </button>
            ))}
          </div>

          {/* Grid Palette */}
          <div className="grid grid-cols-5 gap-2.5">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isMarked = markedForReview.has(idx);
              const isFilteredOut = !filteredPaletteIndices.includes(idx);

              let paletteStyle = "border-slate-200 text-slate-600 bg-white hover:bg-slate-50";
              if (isAnswered && isMarked) {
                paletteStyle = "bg-amber-500 border-amber-600 text-white";
              } else if (isMarked) {
                paletteStyle = "bg-purple-600 border-purple-700 text-white animate-pulse";
              } else if (isAnswered) {
                paletteStyle = "bg-emerald-600 border-emerald-700 text-white";
              } else if (isCurrent) {
                paletteStyle = "border-2 border-indigo-600 text-indigo-700 font-bold bg-indigo-50/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuestionSelect(idx)}
                  className={`aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${paletteStyle} ${
                    isFilteredOut ? 'opacity-30' : 'opacity-100'
                  }`}
                  disabled={isFilteredOut}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Color Indicators Legend */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-600" />
              <span>Marked</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md border border-indigo-600 bg-indigo-50/10" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-200" />
              <span>Unvisited</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Bottom View Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 shadow-lg z-10 flex items-center justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Previous
          </button>
          <button
            onClick={handleClearAnswer}
            disabled={selectedAnswers[currentIndex] === undefined}
            className="px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition disabled:opacity-40"
          >
            Clear Answer
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleToggleMarkForReview}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition ${
              markedForReview.has(currentIndex)
                ? 'bg-amber-100 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {markedForReview.has(currentIndex) ? '★ Flagged' : '☆ Mark for Review'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            Save & Next
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-800">Final Assessment Summary</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Please verify your selection metrics prior to locking in final submissions.</p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Total Questions</span>
                <span className="font-bold text-slate-800">{questions.length} Items</span>
              </div>
              <div>
                <span className="text-slate-400 block">Attempted</span>
                <span className="font-bold text-emerald-600">{stats.answered} Items</span>
              </div>
              <div>
                <span className="text-slate-400 block">Marked for Review</span>
                <span className="font-bold text-purple-600">{stats.marked} Items</span>
              </div>
              <div>
                <span className="text-slate-400 block">Time Left</span>
                <span className="font-bold text-slate-800">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex space-x-2.5 justify-end pt-2 text-xs">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};