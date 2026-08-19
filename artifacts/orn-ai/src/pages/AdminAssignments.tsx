import React, { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Check,
  Edit2,
  BookOpen,
  Settings,
  FileText
} from "lucide-react";

interface Course {
  id: string;
  title: string;
}

interface DraftQuestion {
  id?: string; // Database UUID (if existing) or temp UI id
  type: "mcq" | "true_false" | "short_answer";
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function AdminAssignments() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  // Under-the-hood resolved subsectionId for database compatibility
  const [resolvedSubsectionId, setResolvedSubsectionId] = useState<string | null>(null);

  // State for all questions in the current assignment
  const [questionsList, setQuestionsList] = useState<DraftQuestion[]>([]);
  const [originalQuizzes, setOriginalQuizzes] = useState<DraftQuestion[]>([]);

  // Active Editor States
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qType, setQType] = useState<"mcq" | "true_false" | "short_answer">("mcq");
  const [questionText, setQuestionText] = useState("");
  
  // MCQ Options
  const [mcqOptions, setMcqOptions] = useState(["", "", "", ""]);
  const [mcqCorrect, setMcqCorrect] = useState(0);

  // True/False correct index (0 for True, 1 for False)
  const [tfCorrect, setTfCorrect] = useState(0);

  // Short Answer Text
  const [shortAnswerText, setShortAnswerText] = useState("");

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingAssignment, setLoadingAssignment] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await api.get("/api/courses");
      setCourses(res.data || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Resolve subsection and fetch existing questions when course changes
  useEffect(() => {
    if (!selectedCourseId) {
      setQuestionsList([]);
      setOriginalQuizzes([]);
      setResolvedSubsectionId(null);
      resetEditor();
      return;
    }
    loadCourseAssignment();
  }, [selectedCourseId]);

  const loadCourseAssignment = async () => {
    setLoadingAssignment(true);
    resetEditor();
    try {
      // 1. Fetch course details to find or create the default subsection
      const res = await api.get(`/api/courses/${selectedCourseId}`);
      const sections = res.data.sections || [];
      
      let targetSubId = null;

      // 1. Try to find an existing quiz-only section (no lessons with video or PDF)
      let targetSection = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const lessons = sec.lessons || [];
        const hasLearningContent = lessons.some((l: any) => l.videoUrl || l.pdfUrl);
        // If the section exists and has no videos/PDFs, it is our quiz/assessment section
        if (!hasLearningContent && lessons.length > 0) {
          targetSection = sec;
          break;
        }
      }

      // 2. If no quiz-only section found, check if there's any section named exactly "Final Assessment"
      if (!targetSection) {
        targetSection = sections.find(
          (sec: any) => (sec.sectionName || "").toLowerCase() === "final assessment"
        );
      }

      // 3. Resolve the target subsection (lesson) within that section
      if (targetSection) {
        const lessons = targetSection.lessons || [];
        if (lessons.length > 0) {
          targetSubId = lessons[0].id;
        } else {
          // If the section has no subsections, create one under this section
          const formData = new FormData();
          formData.append("sectionId", targetSection.id);
          formData.append("title", "Final Assessment");
          formData.append("description", "Auto-created assessment container");
          formData.append("timeDuration", "0");

          const subRes = await api.post("/api/course/addSubSection", formData);
          targetSubId = subRes.data.data.subSection[0]._id;
        }
      } else {
        // 4. Create a new "Final Assessment" section and then a subsection
        const secRes = await api.post("/api/course/addSection", {
          sectionName: "Final Assessment",
          courseId: selectedCourseId,
        });
        const newSecId = secRes.data.updatedCourse.courseContent[0]._id;

        const formData = new FormData();
        formData.append("sectionId", newSecId);
        formData.append("title", "Final Assessment");
        formData.append("description", "Auto-created assessment container");
        formData.append("timeDuration", "0");

        const subRes = await api.post("/api/course/addSubSection", formData);
        targetSubId = subRes.data.data.subSection[0]._id;
      }

      setResolvedSubsectionId(targetSubId);

      // 2. Fetch the course structure again to load the subsection's existing quizzes
      const updatedRes = await api.get(`/api/courses/${selectedCourseId}`);
      const updatedSections = updatedRes.data.sections || [];
      let quizzes: any[] = [];

      for (const sec of updatedSections) {
        const lessons = sec.lessons || [];
        const matchedLesson = lessons.find((l: any) => l.id === targetSubId);
        if (matchedLesson) {
          quizzes = matchedLesson.quizzes || [];
          break;
        }
      }

      // Map raw quizzes to draft format (strictly MCQ)
      const formatted: DraftQuestion[] = quizzes.map((q: any) => {
        return {
          id: q.id,
          type: "mcq",
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        };
      });

      setQuestionsList(formatted);
      setOriginalQuizzes(JSON.parse(JSON.stringify(formatted))); // Keep deep copy for syncing
    } catch (error) {
      console.error("Error loading assignment:", error);
      toast.error("Failed to load or initialize course assignment");
    } finally {
      setLoadingAssignment(false);
    }
  };

  const resetEditor = () => {
    setEditingIndex(null);
    setQuestionText("");
    setMcqOptions(["", "", "", ""]);
    setMcqCorrect(0);
    setTfCorrect(0);
    setShortAnswerText("");
  };

  const loadQuestionIntoEditor = (index: number) => {
    const q = questionsList[index];
    setEditingIndex(index);
    setQType(q.type);
    setQuestionText(q.question);
    if (q.type === "mcq") {
      setMcqOptions([...q.options]);
      setMcqCorrect(q.correctAnswer);
    } else if (q.type === "true_false") {
      setTfCorrect(q.correctAnswer);
    } else if (q.type === "short_answer") {
      setShortAnswerText(q.options[0] || "");
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...mcqOptions];
    updated[index] = val;
    setMcqOptions(updated);
  };

  const handleAddOrUpdateQuestion = () => {
    if (!questionText.trim()) {
      toast.error("Please enter the question text");
      return;
    }

    let finalOptions: string[] = [];
    let finalCorrect = 0;

    if (qType === "mcq") {
      if (mcqOptions.some((opt) => !opt.trim())) {
        toast.error("Please fill in all 4 MCQ options");
        return;
      }
      finalOptions = [...mcqOptions];
      finalCorrect = mcqCorrect;
    } else if (qType === "true_false") {
      finalOptions = ["True", "False"];
      finalCorrect = tfCorrect;
    } else if (qType === "short_answer") {
      if (!shortAnswerText.trim()) {
        toast.error("Please enter the correct answer text");
        return;
      }
      finalOptions = [shortAnswerText.trim()];
      finalCorrect = 0;
    }

    const newQuestion: DraftQuestion = {
      type: qType,
      question: questionText.trim(),
      options: finalOptions,
      correctAnswer: finalCorrect,
    };

    if (editingIndex !== null) {
      // Retain existing DB ID if we are updating an existing question
      const existingId = questionsList[editingIndex].id;
      if (existingId) {
        newQuestion.id = existingId;
      }
      const updated = [...questionsList];
      updated[editingIndex] = newQuestion;
      setQuestionsList(updated);
      toast.success("Question updated in list");
    } else {
      setQuestionsList([...questionsList, newQuestion]);
      toast.success("Question added to list");
    }

    resetEditor();
  };

  const handleDeleteFromList = (index: number) => {
    const updated = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updated);
    if (editingIndex === index) {
      resetEditor();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questionsList.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questionsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setQuestionsList(updated);
    if (editingIndex === index) setEditingIndex(targetIndex);
    else if (editingIndex === targetIndex) setEditingIndex(index);
  };

  const handleSaveAssignment = async () => {
    if (!selectedCourseId || !resolvedSubsectionId) {
      toast.error("Please select a course first");
      return;
    }

    setSaving(true);
    try {
      // 1. Identify deleted questions (present in originalQuizzes but not in questionsList)
      const deletedQuizzes = originalQuizzes.filter(
        (orig) => orig.id && !questionsList.some((q) => q.id === orig.id)
      );

      // Delete them
      for (const del of deletedQuizzes) {
        if (del.id) {
          await api.delete(`/api/mcq/${del.id}`);
        }
      }

      // 2. Add or Update the current questions list
      for (const q of questionsList) {
        if (q.id) {
          // Existing quiz -> Update
          await api.post("/api/mcq/update", {
            mcqId: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          });
        } else {
          // New quiz -> Create
          await api.post("/api/mcq/create", {
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            courseId: selectedCourseId,
            subsectionId: resolvedSubsectionId,
          });
        }
      }

      toast.success("Assignment saved and published successfully!");
      // Reload assignment to refresh originalQuizzes state and get database UUIDs for new questions
      await loadCourseAssignment();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to save assignment questions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-blue-900 bg-clip-text text-transparent">
              Course Assignment Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select a course to design, reorder, and publish interactive homework assessments and quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="flex h-11 w-64 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={loadingCourses}
            >
              <option value="">Choose Course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Overlay */}
        {loadingAssignment ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading course structures and quizzes...</p>
          </div>
        ) : !selectedCourseId ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 border rounded-[24px] border-dashed bg-slate-50/50">
            <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
              <BookOpen className="size-8" />
            </div>
            <h3 className="text-lg font-bold">No Course Selected</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
              Please choose a training course from the header dropdown to create or edit its assignments.
            </p>
          </div>
        ) : (
          /* Main Workspace Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Question Creator / Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="shadow-md border rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {editingIndex !== null ? "Edit Question" : "Create Question"}
                      </CardTitle>
                      <CardDescription>
                        Design a multiple-choice question for the assignment.
                      </CardDescription>
                    </div>
                    {editingIndex !== null && (
                      <Button variant="outline" size="sm" onClick={resetEditor}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Question Prompt */}
                  <div className="space-y-2">
                    <Label htmlFor="qPrompt" className="text-sm font-semibold">Question Prompt</Label>
                    <Textarea
                      id="qPrompt"
                      placeholder="Write your assignment question here..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="min-h-[110px] rounded-xl"
                    />
                  </div>

                  {/* MCQ Configurator */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Options & Correct Answer</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mcqOptions.map((opt, i) => (
                        <div
                          key={i}
                          className={`flex flex-col gap-2 p-4 rounded-xl border transition-all ${
                            mcqCorrect === i
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-input bg-slate-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">Option {i + 1}</span>
                            <button
                              type="button"
                              onClick={() => setMcqCorrect(i)}
                              className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold border transition-all ${
                                mcqCorrect === i
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "bg-background border-input text-muted-foreground hover:bg-slate-50"
                              }`}
                            >
                              {mcqCorrect === i && <Check className="size-3" />}
                              Correct
                            </button>
                          </div>
                          <Input
                            placeholder={`Option {i + 1} text`}
                            value={opt}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                            className="bg-background mt-1 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add/Save to List Action */}
                  <Button
                    onClick={handleAddOrUpdateQuestion}
                    className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {editingIndex !== null ? (
                      <>
                        <Check className="size-5" /> Update Question in List
                      </>
                    ) : (
                      <>
                        <Plus className="size-5" /> Add Question to Assignment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right side: Summary & Publish (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
              <Card className="shadow-md border rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold">Assignment Outline</CardTitle>
                      <CardDescription>
                        {questionsList.length} Questions Drafted
                      </CardDescription>
                    </div>
                    {questionsList.length > 0 && (
                      <Button
                        onClick={handleSaveAssignment}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 rounded-xl flex items-center gap-1 shadow-sm"
                      >
                        {saving ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Publish
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 max-h-[550px] overflow-y-auto divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {questionsList.length === 0 ? (
                      <div className="py-20 text-center text-sm text-muted-foreground flex flex-col items-center justify-center space-y-3">
                        <HelpCircle className="size-8 text-slate-300" />
                        <span>No questions added yet. Construct your assignment using the panel on the left.</span>
                      </div>
                    ) : (
                      questionsList.map((q, idx) => (
                        <motion.div
                          key={q.id || idx}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="py-4 first:pt-2 last:pb-2 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-2">
                              <span className="font-bold text-sm text-primary">{idx + 1}.</span>
                              <div className="space-y-1">
                                <p className="font-semibold text-sm text-slate-800 break-words leading-relaxed">
                                  {q.question}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
                                  Multiple Choice
                                </span>
                              </div>
                            </div>

                            {/* Question control actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => moveQuestion(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-slate-100 text-muted-foreground disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="size-3.5" />
                              </button>
                              <button
                                onClick={() => moveQuestion(idx, "down")}
                                disabled={idx === questionsList.length - 1}
                                className="p-1 rounded hover:bg-slate-100 text-muted-foreground disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="size-3.5" />
                              </button>
                              <button
                                onClick={() => loadQuestionIntoEditor(idx)}
                                className={`p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors ${
                                  editingIndex === idx ? "bg-blue-50" : ""
                                }`}
                                title="Edit Question"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFromList(idx)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                title="Delete Question"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Preview options */}
                          <div className="pl-5 space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = optIdx === q.correctAnswer;
                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg border ${
                                    isCorrect
                                      ? "bg-emerald-50/50 text-emerald-700 border-emerald-100 font-medium"
                                      : "bg-slate-50/50 text-muted-foreground border-transparent"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <CheckCircle className="size-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <div className="size-3.5 border rounded-full shrink-0" />
                                  )}
                                  <span className="break-all">{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </Shell>
  );
}
