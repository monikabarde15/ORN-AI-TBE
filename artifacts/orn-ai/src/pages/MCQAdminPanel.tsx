// artifacts\orn-ai\src\pages\MCQAdminPanel.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Question, Assessment } from '../lib/MCQTypes';
import { Shell } from '@/components/layout/Shell';
import { toast } from "sonner";
import api from "../../services/api";


export const MCQAdminPanel: React.FC = () => {
    // --- View states ---
    const [loading, setLoading] = useState(false);
    const [draftAssessment, setDraftAssessment] =
    useState<Assessment | null>(null);
    const [creating, setCreating] = useState(false);
    const [view, setView] = useState<'library' | 'builder' | 'preview'>('library');
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

    // --- Active Builder States ---
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    // --- Modal & Validation States ---
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSavedNotification, setIsSavedNotification] = useState(false);

    // --- Active Selection Helpers ---
    const activeAssessment = useMemo(() => {

    if (selectedAssessmentId === "new")
        return draftAssessment;

    return assessments.find(
        a => a.id === selectedAssessmentId
    ) || null;

}, [
    assessments,
    selectedAssessmentId,
    draftAssessment
]);

    const activeQuestion = useMemo(() => {
        if (!activeAssessment) return null;
        return activeAssessment.questions.find((q) => q.id === activeQuestionId) || null;
    }, [activeAssessment, activeQuestionId]);

   const loadAssessments = async () => {
    setLoading(true);

    try {
        const res = await api.get("/api/assessments");

        setAssessments(
            (res.data.data || []).map((item: any) => ({
                id: item.id,
                name: item.assessmentName,
                role: item.targetRole,
                category: item.category,
                difficulty: item.difficulty,
                durationMinutes: item.durationMinutes,
                passingPercentage: item.passingPercentage,
                instructions: item.instructions,
                description: item.description,
                isPublished: item.status === "Published",
                questions: (item.questions || []).map((q: any) => ({
                    id: q.id,
                    text: q.question,
                    options: q.options,
                    correctOptionIndex: q.correctAnswer,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    marks: q.marks,
                    timeLimitSeconds: q.timeLimitSeconds,
                    status: q.status,
                })),
            }))
        );
    } catch (err) {
        console.error(err);
        toast.error("Failed to load assessments");
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
            loadAssessments();
        }, []);
    // Set default active question when entering builder
    useEffect(() => {
        if (activeAssessment && !activeQuestionId && activeAssessment.questions.length > 0) {
            setActiveQuestionId(activeAssessment.questions[0].id);
        }
    }, [activeAssessment, activeQuestionId]);

    // --- Library Actions ---
   const handleSelectAssessment = async (id: string) => {
    try {
        const res = await api.get(`/api/assessments/${id}`);

        const item = res.data.data;

            const assessment = {
            id: item.id,
            name: item.assessmentName,
            role: item.targetRole,
            category: item.category,
            difficulty: item.difficulty,
            durationMinutes: item.durationMinutes,
            passingPercentage: item.passingPercentage,
            instructions: item.instructions,
            description: item.description,
            isPublished: item.status === "Published",
            questions: (item.questions || []).map((q: any) => ({
                    id: q.id,
                    text: q.question,
                    options: q.options,
                    correctOptionIndex: q.correctAnswer,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    marks: q.marks,
                    timeLimitSeconds: q.timeLimitSeconds,
                    status: q.status,
                })),
            };

        setAssessments(prev => {
            const index = prev.findIndex(a => a.id === id);

            if (index === -1) {
                return [...prev, assessment];
            }

            const updated = [...prev];
            updated[index] = assessment;
            return updated;
        });

        setSelectedAssessmentId(id);
        setActiveQuestionId(
            assessment.questions?.[0]?.id || null
        );

        setView("builder");
    } catch (err) {
        console.error(err);
    }
};

const handleCreateNewAssessment = () => {
  const draft: Assessment = {
    id: "new",
    name: "",
    role: "",
    category: "",
    difficulty: "Easy",
    durationMinutes: 45,
    passingPercentage: 70,
    instructions: "",
    description: "",
    isPublished: false,
    questions: [],
};

setDraftAssessment(draft);
setSelectedAssessmentId("new");
setActiveQuestionId(null);
setView("builder");
};
    const handleEditAssessment = async (
        assessment: Assessment,
        e: React.MouseEvent
        ) => {
        e.stopPropagation();

        await handleSelectAssessment(assessment.id);
        };

    const handleDeleteAssessment = async (
    assessmentId: string,
    e: React.MouseEvent
) => {
try{
    e.stopPropagation();

    if (!window.confirm("Delete?")) return;

    await api.delete(
        `/api/assessments/${assessmentId}`
    );

    await loadAssessments();
    setSelectedAssessmentId(null);
    setActiveQuestionId(null);
    setView("library");
}catch(error){

console.error(error);

}
};

    const handleDuplicateAssessment = async (
  assessment: Assessment,
  e: React.MouseEvent
) => {
  e.stopPropagation();

  try {
    const res = await api.post(
      `/api/assessments/${assessment.id}/duplicate`
    );

   if (res.data.success) {

    await loadAssessments();

        if (res.data.data?.id) {
            await handleSelectAssessment(
                res.data.data.id
            );
        }
    }
  } catch (error) {
    console.error("Duplicate Assessment Error:", error);
  }
};

const handleSave = async () => {
  if (!activeQuestion) return;

  try {
    await api.put(`/api/questions/${activeQuestion.id}`, {
      question: activeQuestion.text,
      options: activeQuestion.options,
      correctAnswer: activeQuestion.correctOptionIndex,
      explanation: activeQuestion.explanation,
      difficulty: activeQuestion.difficulty,
      marks: activeQuestion.marks,
      timeLimitSeconds: activeQuestion.timeLimitSeconds,
      status: activeQuestion.status,
    });

    triggerSaveNotification();

    if (selectedAssessmentId) {
      await handleSelectAssessment(selectedAssessmentId);
    }
  } catch (error) {
    console.error(error);
  }
};
    // --- Builder Actions (Assessment Metadata updates) ---
    const handleUpdateAssessmentMetadata = (field: keyof Assessment, value: any) => {
        if (!selectedAssessmentId) return;
            if (selectedAssessmentId === "new") {
                setDraftAssessment(prev =>
                    prev ? { ...prev, [field]: value } : null
                );
                return;
            }

            setAssessments(prev =>
                prev.map(a =>
                    a.id === selectedAssessmentId
                        ? { ...a, [field]: value }
                        : a
                )
            );
    };

    // --- Question Item Actions ---
    const handleUpdateQuestionField = (field: keyof Question, value: any) => {
    if (!selectedAssessmentId || !activeQuestionId) return;

    if (selectedAssessmentId === "new") {
        setDraftAssessment(prev =>
            prev
                ? {
                      ...prev,
                      questions: prev.questions.map(q =>
                          q.id === activeQuestionId
                              ? { ...q, [field]: value }
                              : q
                      ),
                  }
                : null
        );
        return;
    }

    setAssessments(prev =>
        prev.map(a =>
            a.id === selectedAssessmentId
                ? {
                      ...a,
                      questions: a.questions.map(q =>
                          q.id === activeQuestionId
                              ? { ...q, [field]: value }
                              : q
                      ),
                  }
                : a
        )
    );
};

    const handleUpdateOptionText = (index: number, text: string) => {
        if (!activeQuestion) return;
        const updated = [...activeQuestion.options];
        updated[index] = text;
        handleUpdateQuestionField('options', updated);
    };

    const handleAddOption = () => {
        if (!activeQuestion) return;
        handleUpdateQuestionField('options', [...activeQuestion.options, 'New Option']);
    };

  const handleRemoveOption = (
    index: number
) => {

    if (!activeQuestion) return;

    if (activeQuestion.options.length <= 2)
        return;

    const updated =
        activeQuestion.options.filter(
            (_, i) => i !== index
        );

    handleUpdateQuestionField(
        "options",
        updated
    );

    if (
        activeQuestion.correctOptionIndex >=
        updated.length
    ) {
        handleUpdateQuestionField(
            "correctOptionIndex",
            updated.length - 1
        );
    }
};
const saveAssessment = async () => {
    console.log("saveAssessment called");
    if (!activeAssessment) return null;

    try {
        // ==========================
        // NEW ASSESSMENT
        // ==========================
        if (activeAssessment.id === "new") {
            const res = await api.post("/api/assessment/create", {
                assessmentName: activeAssessment.name,
                targetRole: activeAssessment.role,
                category: activeAssessment.category,
                difficulty: activeAssessment.difficulty,
                durationMinutes: activeAssessment.durationMinutes,
                passingPercentage: activeAssessment.passingPercentage,
                instructions: activeAssessment.instructions,
                description: activeAssessment.description,
                status: "Draft",

                // Save local questions also
                questions: activeAssessment.questions.map((q) => ({
                    question: q.text,
                    options: q.options,
                    correctAnswer: q.correctOptionIndex,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    marks: q.marks,
                    timeLimitSeconds: q.timeLimitSeconds,
                    status: q.status,
                })),
            });

                const created = res.data.data;

                // remove local draft
                setAssessments(prev =>
                    prev.filter(a => a.id !== "new")
                );

                setSelectedAssessmentId(created.id);

                await loadAssessments();

                await handleSelectAssessment(created.id);

                toast.success("Assessment Created");
                setDraftAssessment(null);

            return created;
        }

        // ==========================
        // UPDATE ASSESSMENT
        // ==========================
        await api.put(`/api/assessments/${activeAssessment.id}`, {
            assessmentName: activeAssessment.name,
            targetRole: activeAssessment.role,
            category: activeAssessment.category,
            difficulty: activeAssessment.difficulty,
            durationMinutes: activeAssessment.durationMinutes,
            passingPercentage: activeAssessment.passingPercentage,
            instructions: activeAssessment.instructions,
            description: activeAssessment.description,
            questions: (activeAssessment.questions || []).map((q) => ({
                question: q.text,
                options: q.options,
                correctAnswer: q.correctOptionIndex,
                explanation: q.explanation,
                difficulty: q.difficulty,
                marks: q.marks,
                timeLimitSeconds: q.timeLimitSeconds,
                status: q.status || "Published",
            })),
        });

        toast.success("Assessment Updated");

        return activeAssessment;
    } catch (err) {
        console.error(err);
        toast.error("Failed to save assessment");
        return null;
    }
};
    // --- Validation & Create New Question ---
    const handleAddQuestion = async () => {
    if (!selectedAssessmentId) return;

    // New Assessment (API call nahi)
    if (selectedAssessmentId === "new") {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            text: "Enter your question here",
            options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D",
            ],
            correctOptionIndex: 0,
            explanation: "",
            difficulty: "Easy",
            marks: 1,
            timeLimitSeconds: 60,
            status: "Draft",
        };

       setDraftAssessment(prev =>
            prev
                ? {
                    ...prev,
                    questions: [...prev.questions, newQuestion],
                }
                : null
        );

        setActiveQuestionId(newQuestion.id);
        return;
    }

    // Existing Assessment (API call)
    try {
        await api.post(
            `/api/assessments/${selectedAssessmentId}/questions`,
            {
                question: "Enter your question here",
                options: [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D",
                ],
                correctAnswer: 0,
                explanation: "",
                difficulty: "Easy",
                marks: 1,
                timeLimitSeconds: 60,
                status: "Draft",
            }
        );

        await handleSelectAssessment(selectedAssessmentId);
    } catch (err) {
        console.error(err);
    }
};

const handleDeleteQuestion = async (
  qId: string,
  e: React.MouseEvent
) => {
  e.stopPropagation();

  if (!window.confirm("Delete Question?")) return;

  try {
    await api.delete(`/api/questions/${qId}`);

    if (selectedAssessmentId) {
      await handleSelectAssessment(selectedAssessmentId);
    }

    triggerSaveNotification();
  } catch (error) {
    console.error("Delete Question Error:", error);
  }
};
const isAssessmentSaved =
    activeAssessment && activeAssessment.id !== "new";
    // --- Filtered Questions for Sidebar ---
    const filteredQuestions = useMemo(() => {
        if (!activeAssessment) return [];
        return activeAssessment.questions.filter((q) => {
            const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
            const matchesStatus = filterStatus === 'All' || q.status === filterStatus;
            return matchesSearch && matchesDifficulty && matchesStatus;
        });
    }, [activeAssessment, searchQuery, filterDifficulty, filterStatus]);

    // --- Summary Breakdown ---
    const summaryBreakdown = useMemo(() => {
        if (!activeAssessment) return { easy: 0, medium: 0, hard: 0 };
        let easy = 0, medium = 0, hard = 0;
        activeAssessment.questions.forEach((q) => {
            if (q.difficulty === 'Easy') easy++;
            if (q.difficulty === 'Medium') medium++;
            if (q.difficulty === 'Hard') hard++;
        });
        return { easy, medium, hard };
    }, [activeAssessment]);

    // --- Publish Validation ---
    const isPublishAllowed = useMemo(() => {
        if (!activeAssessment) return false;
        const hasPublishedQuestion = activeAssessment.questions.some((q) => q.status === 'Published');
        return (
            activeAssessment.name.trim().length > 0 &&
            activeAssessment.durationMinutes > 0 &&
            activeAssessment.passingPercentage > 0 &&
            hasPublishedQuestion
        );
    }, [activeAssessment]);
const handleConfirmPublish = async () => {
    if (!selectedAssessmentId) return;

    try {
        await api.put(
            `/api/assessments/${selectedAssessmentId}/publish`
        );

        await loadAssessments();

        await handleSelectAssessment(selectedAssessmentId);

        setIsPublishModalOpen(false);

        triggerSaveNotification();
    } catch (error) {
        console.error(error);
    }
};

    const triggerSaveNotification = () => {
        setIsSavedNotification(true);
        setTimeout(() => setIsSavedNotification(false), 2000);
    };

    // --- Simulated Portal States for Preview Mode ---
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewAnswers, setPreviewAnswers] = useState<Record<number, number>>({});
    const previewQuestions = useMemo(() => {
        return activeAssessment?.questions.filter((q) => q.status === 'Published') || [];
    }, [activeAssessment]);
if (loading) {
    return (
        <Shell>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 w-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-500">
                        Loading Assessments...
                    </p>
                </div>
            </div>
        </Shell>
    );
}
    return (
        <Shell>
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">

            {/* ----------------- VIEW 1: LIBRARY DASHBOARD ----------------- */}
            {view === 'library' && (
                <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Assessment Library</h1>
                            <p className="text-slate-500 text-sm mt-1">Configure, build, and publish standardized assessments for candidate pre-screening.</p>
                        </div>
                        <button
                            onClick={handleCreateNewAssessment}
                            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-sm self-start"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Create Assessment</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assessments
                            .filter(assessment => assessment.id !== "new")
                            .map((assessment) => {
                            const pubCount = assessment.questions.filter((q) => q.status === 'Published').length;
                            return (
                                <div
                                    key={assessment.id}
                                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group relative"
                                >
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-blue-800 bg-indigo-50 px-2 py-1 rounded-md">
                                                {assessment.category}
                                            </span>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${assessment.isPublished
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    : 'bg-amber-50 border-amber-200 text-amber-700'
                                                }`}>
                                                {assessment.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-blue-800 transition truncate">
                                            {assessment.name}
                                        </h3>
                                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 h-8">
                                            {assessment.description || 'No description supplied.'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3 my-4 text-xs text-slate-600">
                                            <div>
                                                <span className="text-slate-400 block">Questions</span>
                                                <span className="font-semibold text-slate-800">{assessment.questions.length} total ({pubCount} active)</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Duration</span>
                                                <span className="font-semibold text-slate-800">{assessment.durationMinutes} minutes</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Target Role</span>
                                                <span className="font-semibold text-slate-800 truncate block">{assessment.role}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Difficulty</span>
                                                <span className="font-semibold text-slate-800">{assessment.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                                        <span>ID: {assessment.id}</span>
                                        <button
                                            onClick={(e) => handleDuplicateAssessment(assessment, e)}
                                            className="text-blue-900 hover:text-blue-800 font-semibold flex items-center space-x-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.4M7 2h7.375c.621 0 1.125.504 1.125 1.125V17.25" />
                                            </svg>
                                            <span>Duplicate</span>
                                        </button>

                                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                                            {/* <span>ID: {assessment.id}</span> */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => handleEditAssessment(assessment, e)}
                                                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                                                    className="text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ----------------- VIEW 2: DETAILED ASSESSMENT BUILDER ----------------- */}
            {view === 'builder' && activeAssessment && (
                <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6 flex flex-col min-h-screen pb-24 animate-in fade-in duration-200">

                    {/* Header Action Row */}
                    <header className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setView('library')}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-lg font-bold text-slate-900">{activeAssessment.name}</h1>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeAssessment.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {activeAssessment.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">{activeAssessment.role} • {activeAssessment.category}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                           <button
                                    onClick={() => {
                                        setPreviewIndex(0);
                                        setPreviewAnswers({});
                                        setView("preview");
                                    }}
                                    disabled={!isAssessmentSaved || previewQuestions.length === 0}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                        !isAssessmentSaved || previewQuestions.length === 0
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    Preview Portal
                                </button>

                            <button
                                onClick={() => {
                                    if (isPublishAllowed) {
                                        setIsPublishModalOpen(true);
                                    }
                                }}
                                disabled={!isAssessmentSaved || activeAssessment.isPublished || !isPublishAllowed}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg ${
                                    !isAssessmentSaved
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : activeAssessment.isPublished
                                        ? "bg-emerald-50 text-emerald-700"
                                        : isPublishAllowed
                                        ? "bg-blue-900 text-white hover:bg-blue-800"
                                        : "bg-slate-100 text-slate-400"
                                }`}
                            >
                                {activeAssessment.isPublished
                                    ? "Published Live"
                                    : "Publish Assessment"}
                            </button>
                        </div>
                    </header>

                    {/* Error alerts */}
                    {validationError && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs font-semibold flex justify-between items-center animate-pulse">
                            <span>{validationError}</span>
                            <button onClick={() => setValidationError(null)} className="font-bold hover:text-rose-900">✕</button>
                        </div>
                    )}

                    {/* Three-Column Workspace */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                        {/* ---------------- COLUMN 1: LEFT SIDEBAR (QUESTIONS NAVIGATION) ---------------- */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4 flex flex-col h-[700px]">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Assessment Questions</h3>
                                <button
                                    onClick={handleAddQuestion}
                                    className="p-1.5 text-blue-900 hover:bg-indigo-50 rounded-lg transition font-bold text-xs flex items-center space-x-1"
                                >
                                    <span>+ Add</span>
                                </button>
                            </div>

                            {/* Search & Filter */}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={filterDifficulty}
                                        onChange={(e) => setFilterDifficulty(e.target.value)}
                                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-500 focus:outline-none focus:border-blue-900"
                                    >
                                        <option value="All">All Diff.</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-500 focus:outline-none focus:border-blue-900"
                                    >
                                        <option value="All">All Stats.</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                {filteredQuestions.map((q, idx) => (
                                    <div
                                        key={q.id}
                                        onClick={() => {
                                            setValidationError(null);
                                            setActiveQuestionId(q.id);
                                        }}
                                        className={`p-3 rounded-lg border text-left cursor-pointer transition flex flex-col justify-between h-24 ${activeQuestionId === q.id
                                                ? 'bg-indigo-50 border-indigo-200'
                                                : 'border-slate-100 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start text-[10px]">
                                            <span className="font-bold text-blue-900">Question {idx + 1}</span>
                                            <div className="flex space-x-1">
                                                <span className={`px-1.5 py-0.5 rounded font-semibold ${q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                    }`}>{q.difficulty}</span>
                                                <span className={`px-1.5 py-0.5 rounded font-semibold ${q.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : q.status === 'Archived' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-800'
                                                    }`}>{q.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium truncate mt-1">
                                        {q.text}
                                        </p>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 mt-auto">
                                            <span>Marks: {q.marks}</span>
                                            <button
                                                onClick={(e) => handleDeleteQuestion(q.id, e)}
                                                className="text-slate-400 hover:text-rose-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <div className="text-center py-12 text-slate-400 space-y-2">
                                        <p className="text-xs">No questions matched filters.</p>
                                        <button
                                            onClick={handleAddQuestion}
                                            className="text-xs text-blue-900 font-bold hover:underline"
                                        >
                                            + Add First Question
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ---------------- COLUMN 2 & 3: CENTER COLUMN (QUESTION FORM WRAPPER) ---------------- */}
                        <div className="lg:col-span-2 space-y-4">
                            {activeQuestion ? (
                                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 min-h-[700px] flex flex-col justify-between">
                                    <div className="space-y-5">

                                        {/* Primary Question Prompt */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Question Prompt
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={activeQuestion.text}
                                                onChange={(e) => handleUpdateQuestionField('text', e.target.value)}
                                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm font-medium leading-relaxed"
                                                placeholder="Type question stem..."
                                            />
                                        </div>

                                        {/* Metadata Sub-Panel inside editor */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Difficulty
                                                </label>
                                                <select
                                                    value={activeQuestion.difficulty}
                                                    onChange={(e) => handleUpdateQuestionField('difficulty', e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Marks / Score Weight
                                                </label>
                                                <input
                                                    type="number"
                                                    value={activeQuestion.marks}
                                                    onChange={(e) => handleUpdateQuestionField('marks', parseInt(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Time Limit (Seconds)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={activeQuestion.timeLimitSeconds}
                                                    onChange={(e) => handleUpdateQuestionField('timeLimitSeconds', parseInt(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Question Status
                                                </label>
                                                <select
                                                    value={activeQuestion.status}
                                                    onChange={(e) => handleUpdateQuestionField('status', e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white font-semibold text-indigo-700"
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Published">Published</option>
                                                    <option value="Archived">Archived</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Options Builder */}
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    Options & Correct Answer Choice
                                                </label>
                                                <button
                                                    onClick={handleAddOption}
                                                    className="text-xs text-blue-900 hover:text-blue-800 font-bold"
                                                >
                                                    + Add Option Choice
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {activeQuestion.options.map((option, optIdx) => (
                                                    <div key={optIdx} className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            name="builder_correct_option"
                                                            checked={activeQuestion.correctOptionIndex === optIdx}
                                                            onChange={() => handleUpdateQuestionField('correctOptionIndex', optIdx)}
                                                            className="text-blue-900 focus:ring-blue-800 w-4 h-4 cursor-pointer"
                                                            title="Mark as correct answer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleUpdateOptionText(optIdx, e.target.value)}
                                                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-xs"
                                                        />
                                                        {activeQuestion.options.length > 2 && (
                                                            <button
                                                                onClick={() => handleRemoveOption(optIdx)}
                                                                className="text-slate-400 hover:text-rose-500 p-1"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Feedback Explanation */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Answer Explanation (Displayed post-submission)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={activeQuestion.explanation}
                                                onChange={(e) => handleUpdateQuestionField('explanation', e.target.value)}
                                                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-xs"
                                                placeholder="Provide deep analytics or step-by-step resolution details..."
                                            />
                                        </div>
                                    </div>

                                    {/* Sticky Question Editor Action Row */}
                                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => handleUpdateQuestionField('status', 'Draft')}
                                            className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                                        >
                                            Revert to Draft
                                        </button>
                                        <div className="flex space-x-2 items-center">
                                            {isSavedNotification && (
                                                <span className="text-xs text-emerald-600 font-semibold animate-pulse">Changes Saved!</span>
                                            )}
                                            <button
                                              onClick={async () => {
                                                const savedAssessment = await saveAssessment();

                                                if (!savedAssessment) return;

                                                if (activeQuestion) {
                                                    await handleSave();
                                                }
                                            }}
                                                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
                                            >
                                                Save Draft Code
                                            </button>
                                            <button
                                              onClick={async () => {
                                                if (!activeQuestion || !selectedAssessmentId) return;

                                                try {
                                                    await api.put(
                                                        `/api/questions/${activeQuestion.id}`,
                                                        {
                                                            question: activeQuestion.text,
                                                            options: activeQuestion.options,
                                                            correctAnswer: activeQuestion.correctOptionIndex,
                                                            difficulty: activeQuestion.difficulty,
                                                            marks: activeQuestion.marks,
                                                            timeLimitSeconds: activeQuestion.timeLimitSeconds,
                                                            status: "Published",
                                                            explanation: activeQuestion.explanation,
                                                        }
                                                    );

                                                    // Local state update after successful API
                                                   // handleUpdateQuestionField("status", "Published");

                                                    toast.success("Question Published");

                                                    await handleSelectAssessment(selectedAssessmentId);
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Failed to publish question");
                                                }
                                            }}
                                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                                            >
                                                Publish Question
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[700px] text-center text-slate-400 space-y-4 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-slate-700">No Questions Selected</h4>
                                        <p className="text-xs max-w-xs mt-1">Start building the assessment by adding or choosing a question template.</p>
                                    </div>
                                    <button
                                        onClick={handleAddQuestion}
                                        className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        + Add First Question
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ---------------- COLUMN 4: RIGHT PANEL (ASSESSMENT INFO & SUMMARY) ---------------- */}
                        <div className="space-y-6">
                            {/* Assessment Meta Form */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Assessment Parameters</h3>
                                <div className="pt-4 border-t mt-4">
                                    <button
                                        onClick={saveAssessment}
                                        className="w-full bg-blue-900 text-white py-2 rounded-lg"
                                    >
                                        Save Assessment
                                    </button>
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div>
                                        <label className="block font-semibold text-slate-500 mb-1">Assessment Name *</label>
                                        <input
                                            type="text"
                                            value={activeAssessment.name}
                                            onChange={(e) => handleUpdateAssessmentMetadata('name', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block font-semibold text-slate-500 mb-1">Target Role *</label>
                                            <input
                                                type="text"
                                                value={activeAssessment.role}
                                                onChange={(e) => handleUpdateAssessmentMetadata('role', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-500 mb-1">Category *</label>
                                            <input
                                                type="text"
                                                value={activeAssessment.category}
                                                onChange={(e) => handleUpdateAssessmentMetadata('category', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block font-semibold text-slate-500 mb-1">Difficulty</label>
                                            <select
                                                value={activeAssessment.difficulty}
                                                onChange={(e) => handleUpdateAssessmentMetadata('difficulty', e.target.value)}
                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-white"
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-500 mb-1">Passing %</label>
                                            <input
                                                type="number"
                                                value={activeAssessment.passingPercentage}
                                                onChange={(e) => handleUpdateAssessmentMetadata('passingPercentage', parseInt(e.target.value) || 0)}
                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-500 mb-1">Duration (m)</label>
                                            <input
                                                type="number"
                                                value={activeAssessment.durationMinutes}
                                                onChange={(e) => handleUpdateAssessmentMetadata('durationMinutes', parseInt(e.target.value) || 0)}
                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-500 mb-1">Instructions</label>
                                        <textarea
                                            rows={2}
                                            value={activeAssessment.instructions}
                                            onChange={(e) => handleUpdateAssessmentMetadata('instructions', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live Assessment Metrics Summary */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Live Blueprint Metrics</h3>
                                <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                        <span>Total Questions</span>
                                        <span className="font-semibold text-slate-800">{activeAssessment.questions.length}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                        <span>Easy Questions</span>
                                        <span className="font-semibold text-emerald-600">{summaryBreakdown.easy}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                        <span>Medium Questions</span>
                                        <span className="font-semibold text-amber-600">{summaryBreakdown.medium}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                        <span>Hard Questions</span>
                                        <span className="font-semibold text-rose-600">{summaryBreakdown.hard}</span>
                                    </div>
                                    <div className="flex justify-between pb-1">
                                        <span>Estimated Duration</span>
                                        <span className="font-semibold text-slate-800">{activeAssessment.durationMinutes} mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sticky footer */}
                    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shadow-lg z-10">
                        <button
                            onClick={() => setView('library')}
                            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition"
                        >
                            Exit to Library
                        </button>
                        <div className="flex space-x-2">
                            <button
                               onClick={async () => {

                                const saved = await saveAssessment();

                                if (!saved) return;

                                if (activeQuestion) {
                                    await handleSave();
                                }

                            }}
                                className="px-5 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
                            >
                                Save Changes Draft
                            </button>
                        </div>
                    </footer>
                </div>
            )}

            {/* ----------------- VIEW 3: INTEGRATED SIMULATED PORTAL PREVIEW ----------------- */}
            {view === 'preview' && activeAssessment && (
                <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
                    <div className="bg-indigo-900 text-white p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-200 block">Candidate Portal Preview Mode</span>
                            <span className="font-bold text-lg">{activeAssessment.name}</span>
                        </div>
                        <button
                            onClick={() => setView('builder')}
                            className="px-4 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-xs font-semibold rounded-lg transition"
                        >
                            Exit Preview Mode
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Simulated Question Center */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-6 min-h-[400px] flex flex-col justify-between shadow-sm">
                            {previewQuestions[previewIndex] ? (
                                <>
                                    <div className="space-y-4">
                                        <span className="text-xs font-bold text-slate-400">Question {previewIndex + 1} of {previewQuestions.length}</span>
                                        <h3 className="text-base font-semibold leading-relaxed text-slate-800">
                                            {previewQuestions[previewIndex].text}
                                        </h3>

                                        <div className="space-y-2 pt-2">
                                            {previewQuestions[previewIndex].options.map((opt, optIdx) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => setPreviewAnswers((prev) => ({ ...prev, [previewIndex]: optIdx }))}
                                                    className={`w-full text-left p-3.5 border rounded-lg text-sm transition flex items-center ${previewAnswers[previewIndex] === optIdx
                                                            ? 'border-indigo-600 bg-indigo-50/50'
                                                            : 'border-slate-200 hover:bg-slate-50 bg-white'
                                                        }`}
                                                >
                                                    <span className={`w-6 h-6 rounded-md text-xs font-bold mr-3 flex items-center justify-center ${previewAnswers[previewIndex] === optIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    <span className="text-slate-700">{opt}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
                                        <button
                                            onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                                            disabled={previewIndex === 0}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-40"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPreviewIndex((prev) => Math.min(previewQuestions.length - 1, prev + 1))}
                                            disabled={previewIndex === previewQuestions.length - 1}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-slate-400">No active published questions.</div>
                            )}
                        </div>

                        {/* Simulated Palette side */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Student Navigation Grid</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {previewQuestions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPreviewIndex(idx)}
                                        className={`aspect-square text-xs font-bold rounded-lg border transition ${idx === previewIndex
                                                ? 'border-indigo-600 text-indigo-700 ring-2 ring-indigo-50'
                                                : previewAnswers[idx] !== undefined
                                                    ? 'bg-emerald-600 border-emerald-700 text-white'
                                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------- MODALS & VALIDATION GATES ----------------- */}
            {isPublishModalOpen && activeAssessment && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                        <div className="flex items-center space-x-3 text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-bold text-slate-900">Publish Assessment Summary</h3>
                        </div>

                        <p className="text-slate-500 text-xs leading-relaxed">
                            Ready to deploy this assessment? Once published, candidates can launch tests live.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{activeAssessment.name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Total Questions:</span> <span className="font-semibold text-slate-800">{activeAssessment.questions.length}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Published Questions:</span> <span className="font-semibold text-emerald-600">{previewQuestions.length}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Duration Limit:</span> <span className="font-semibold text-slate-800">{activeAssessment.durationMinutes} Mins</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Passing Grade:</span> <span className="font-semibold text-slate-800">{activeAssessment.passingPercentage}%</span></div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2 text-xs">
                            <button
                                onClick={() => setIsPublishModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPublish}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                            >
                                Confirm & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        </Shell>
    );
};