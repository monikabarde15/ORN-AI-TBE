"use client"

import React, { useEffect, useRef, useState } from "react"
import { Shell } from "@/components/layout/Shell";

import {
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  BookOpen,
  File,
  Video,
} from "lucide-react"
import { useParams } from "react-router-dom";
import { useRoute } from "wouter";

import { toast, Toaster } from "react-hot-toast"
import api from "../../services/api"
import "./CreateCourse.css"



/* =======================================================
   TYPES
======================================================= */

interface Subscription {
  id: number
  name: string
}

interface Category {
  _id: string
  name: string
}

interface CourseFormData {
  title: string
  subtitle: string
  description: string
  category: string
  difficulty: string
  duration: string

  instructor: string
  subscription_name: string

  learningOutcomes: string[]
  prerequisites: string[]

  price: string

  thumbnailImage: File | null
  promotionalVideo: File | null  // ADD THIS

  ebook: File | null

  tags: string[]
  faqs: FAQ[]
}

// Add Quiz interface
interface QuizQuestion {
  id: string
  mcqId?: string
  question: string
  options: string[]
  correctAnswer: string
}

interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;

  videoUrl?: string;
  pdfUrl?: string;

  videoPreview?: string;
  documentPreview?: string;

  documentFile?: File | null;
  videoFile?: File | null;
  quizzes?: any[];
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  quizzes: Quiz[]  // ADD THIS
}

interface FAQ {
  id: string
  question: string
  answer: string
}

/* =======================================================
   API FUNCTIONS
======================================================= */

const mockApi = {
  // ================= CREATE COURSE =================

  createCourse: async (data: CourseFormData) => {
    const formData = new FormData()

    formData.append("courseName", data.title)
    formData.append("courseDescription", data.description)
   formData.append(
      "whatYouWillLearn",
      JSON.stringify(data.learningOutcomes)
    )
    formData.append("price", data.price || "0")
    formData.append(
      "tag",
      JSON.stringify(
        [...new Set(data.tags || [])]
      )
    );
    formData.append("instructions", JSON.stringify(data.prerequisites))
    formData.append("category", data.category)
    formData.append(
      "subtitle",
      data.subtitle
      )

      formData.append(
      "difficulty",
      data.difficulty
      )

      const cleanFaqs =
  data.faqs.map(
    ({ id, ...rest }) => rest
  );

formData.append(
  "faqs",
  JSON.stringify(cleanFaqs)
)
    formData.append("status", "Draft")

    if (data.thumbnailImage) {
      formData.append("thumbnailImage", data.thumbnailImage)
    }
    if (data.promotionalVideo) {

    formData.append(
      "promotionalVideo",
      data.promotionalVideo
    )
  }

    if (data.ebook) {
      formData.append("ebook", data.ebook)
    }

    try {
      const res = await api.post(
        "/api/course/createCourse",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

      return {
        success: true,
        id: res.data?.data?._id,
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course")
      throw error
    }
  },
 updateCourse: async (
    courseId: string,
    data: CourseFormData
  ) => {

    const formDataObj =
      new FormData();

    formDataObj.append(
      "courseId",
      courseId
    );

    formDataObj.append(
      "courseName",
      data.title
    );

    formDataObj.append(
      "courseDescription",
      data.description
    );

    formDataObj.append(
      "subtitle",
      data.subtitle
    );
formDataObj.append(
  "instructor",
  data.instructor
);
    formDataObj.append(
      "difficulty",
      data.difficulty
    );

    formDataObj.append(
      "category",
      data.category
    );

    formDataObj.append(
      "price",
      data.price || "0"
    );
   formDataObj.append(
  "tag",
  JSON.stringify(
    [...new Set(data.tags || [])]
  )
);
    formDataObj.append(
      "whatYouWillLearn",
      JSON.stringify(
        data.learningOutcomes
      )
    );

    formDataObj.append(
      "instructions",
      JSON.stringify(
        data.prerequisites
      )
    );

    const cleanFaqs =
      data.faqs.map(
        ({ id, ...rest }) => rest
      );

    formDataObj.append(
      "faqs",
      JSON.stringify(cleanFaqs)
    );

    if (data.thumbnailImage) {
      formDataObj.append(
        "thumbnailImage",
        data.thumbnailImage
      );
    }

    if (data.promotionalVideo) {
      formDataObj.append(
        "promotionalVideo",
        data.promotionalVideo
      );
    }

    return await api.post(
      "/api/course/editCourse",
      formDataObj,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },
  // ================= ADD SECTION =================

  addModule: async (courseId: string, module: { title: string }) => {
    const res = await api.post("/api/course/addSection", {
      sectionName: module.title,
      courseId,
    })

    const latestSection = res.data.updatedCourse?.courseContent?.[
      res.data.updatedCourse?.courseContent.length - 1
    ]

    return {
      success: true,
      id: latestSection?._id,
    }
  },

  // ================= ADD SUBSECTION =================

 addLesson: async (
  sectionId: string,
  lesson: Lesson
) => {

  const formData =
    new FormData();

  formData.append(
    "sectionId",
    sectionId
  );

  formData.append(
    "title",
    lesson.title
  );

  formData.append(
    "description",
    lesson.content
  );

  formData.append(
    "timeDuration",
    lesson.duration
  );

  if (lesson.videoFile) {
    formData.append(
      "video",
      lesson.videoFile
    );
  }

  if (lesson.documentFile) {
    formData.append(
      "pdf",
      lesson.documentFile
    );
  }

  const res =
    await api.post(
      "/api/course/addSubSection",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  console.log(
    "SUBSECTION RESPONSE",
    res.data
  );

  return {
      success: true,

      // ✅ FULL SECTION DATA
      data: res.data.data,
    };
},

  // ================= PUBLISH =================

  publishCourse: async (
    courseId: string
  ) => {
    const formData = new FormData()

    formData.append("courseId", courseId)

    formData.append(
      "status",
      "Published"
    )

    await api.post(
  "/api/course/publishCourse",
  {
    courseId,
  }
);

    return {
      success: true,
    }
  },


  // ================= ADD QUIZ (MOCK - replace with real API later) =================
  // ================= ADD QUIZ =================

addQuiz: async (
  courseId: string,
  subSectionId: string,
  quiz: any
) => {

  const responses =
    await Promise.all(
      quiz.questions.map(
        async (question: any) => {

          const res =
            await api.post(
              "/api/mcq/create",
              {
                question:
                  question.question,

                options:
                  question.options,

                correctAnswer:
                  question.options.indexOf(
                    question.correctAnswer
                  ),

                courseId,

                subsectionId:
                  subSectionId,
              }
            );

          return {
            ...question,
            id:
              res.data.data._id,

            mcqId:
              res.data.data._id,
          };
        }
      )
    );

  return {
    success: true,

    quizId:
      crypto.randomUUID(),

    questions:
      responses,
  };
},
}



/* =======================================================
   UI COMPONENTS
======================================================= */

function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  )
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-2"
    />
  )
}

function Textarea(props: any) {
  return (
    <textarea
      {...props}
      className="w-full border rounded-lg px-4 py-2"
    />
  )
}

/* =======================================================
   MAIN COMPONENT
======================================================= */

function EditCoursePage() {
  const spinnerStyle: React.CSSProperties = {
  width: "14px",
  height: "14px",
  border: "2px solid #e5e7eb",
  borderTop: "2px solid #2563eb",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
<style>
{`
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`}
</style>
 const [match, params] =
  useRoute(
    "/recruiter/course/edit/:id"
  );

const editCourseId =
  params?.id;

  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [videoSelected, setVideoSelected] =
  useState<Record<string, boolean>>({});
  const [docSelected, setDocSelected] =
  useState<Record<string, boolean>>({});
  const [uploadStatus, setUploadStatus] =
  useState<Record<
    string,
    "idle" | "uploading" | "success"
  >>({});
  const [lessonUploading, setLessonUploading] =
  useState<Record<string, boolean>>({});
  const [modules, setModules] = useState<Module[]>([])
  const [moduleTitle, setModuleTitle] = useState("")
  const [lessonForms, setLessonForms] = useState<Record<string, Lesson>>({})
  const [mediaUploading, setMediaUploading] = useState({
  cover: false,
  video: false,
});

  // NEW STATE VARIABLES (For STEP 1)
  const [coverPreview, setCoverPreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({})

  // For Cover Photo drag & drop ( Drag states)
  const [isDraggingCover, setIsDraggingCover] = useState(false)
  const [isDraggingVideo, setIsDraggingVideo] = useState(false)

  // Quiz related states
  const [quizForms, setQuizForms] = useState<Record<string, Quiz>>({})
  const [showQuizForm, setShowQuizForm] = useState<Record<string, boolean>>({})

  // Collapsible modules state
const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({})

// Show lesson form per module
const [showLessonForm, setShowLessonForm] = useState<Record<string, boolean>>({})
const [editingModuleId, setEditingModuleId] =
  useState<string | null>(null);
const [courseId, setCourseId] =
  useState("");
  // Tags state
  const [tagInput, setTagInput] = useState("")
  const [editingLesson, setEditingLesson] = useState<{
  moduleId: string;
  lessonId: string;
} | null>(null);
const [selectedLessonId, setSelectedLessonId] =
  useState<string | null>(null);
const [editingQuiz, setEditingQuiz] = useState<{
  moduleId: string;
  quizId: string;
} | null>(null);
  // FormData with NEW fields
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",           // NEW FIELD
    description: "",
    category: "",
    difficulty: "beginner",
    duration: "",
    instructor: "",          // NEW FIELD
    subscription_name: "",
    learningOutcomes: [""],
    prerequisites: [""],
    price: "",
    thumbnailImage: null,
    promotionalVideo: null,  // NEW FIELD
    ebook: null,
    // DEFAULT FAQS - ADD THIS
    faqs: [
      {
        id: "1",
        question: "Do I need any prior experience or knowledge of interior design to take this course?",
        answer: "No, this course is designed for beginners. You'll learn everything from the basics to advanced concepts."
      },
      {
        id: "2",
        question: "What topics will be covered in this course?",
        answer: "The course covers fundamentals, practical applications, and real-world case studies."
      },
      {
        id: "3",
        question: "How long does the course take, and is it self-paced?",
        answer: "The course is self-paced. Average completion time is 4-6 weeks."
      },
      {
        id: "4",
        question: "Will I have access to any resources or support during the course?",
        answer: "Yes, you'll get lifetime access to all materials and community support."
      },
      {
        id: "5",
        question: "Is there a refund policy for the course?",
        answer: "We offer a 30-day money-back guarantee if you're not satisfied."
      }
    ],
    tags: [],
  })
const fetchCourse = async () => {
  try {
    const res = await api.get(
  `/api/courses/${editCourseId}`
);


    const course =
      res.data.data;

    setFormData((prev) => ({
  ...prev,

  title: course.title || "",
  subtitle: course.subtitle || "",
  description: course.description || "",
  category: course.category || "",
  difficulty: course.difficulty || "beginner",
  instructor: course.instructor || "",
  price: course.price || "0",

  learningOutcomes:
    course.whatYouWillLearn?.length
      ? course.whatYouWillLearn
      : [""],

  prerequisites:
    course.instructions?.length
      ? course.instructions
      : [""],

  faqs:
    course.faqs?.length
      ? course.faqs.map(
          (faq: any, index: number) => ({
            id: String(index + 1),
            ...faq,
          })
        )
      : [],

  tags:
    course.tags || [],
}));
    // ===== MODULES =====
setCoverPreview(
  course.thumbnail || null
);

setVideoPreview(
  course.promotionalVideo || null
);
console.log(
  "SECTIONS WITH LESSONS",
  course.sections.map((s:any) => ({
    id: s.id,
    title: s.sectionName,
    lessonCount: s.lessons?.length
  }))
);
console.log(
  "BEFORE REVERSE",
  course.sections?.map((s:any) => ({
    id: s.id,
    title: s.sectionName
  }))
);
    const mappedModules = [...(course.sections || [])]
  .map((section: any) => ({
    id: section.id,
    title: section.sectionName,
    description: "",

    lessons: (section.lessons || []).map(
  (lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    duration: lesson.timeDuration,
    content: lesson.description,

    videoUrl: lesson.videoUrl,
    pdfUrl: lesson.pdfUrl,

    quizzes: (lesson.quizzes || []).map(
      (quiz: any) => ({
        id: quiz.id,
        question: quiz.question,
        options: quiz.options || [],
        correctAnswer: quiz.correctAnswer,
      })
    ),
  })
),


    quizzes: (section.lessons || []).flatMap(
      (lesson: any) =>
        (lesson.quizzes || []).map(
          (quiz: any) => ({
            id: quiz.id,
            title: quiz.question,

            questions: [
              {
                id: quiz.id,
                mcqId: quiz.id,

                question: quiz.question,

                options: quiz.options,

                correctAnswer:
                  quiz.options[
                    quiz.correctAnswer
                  ] || "",
              },
            ],
          })
        )
    ),
  }));
const reversedSections =
  [...(course.sections || [])].reverse();

console.log(
  "AFTER REVERSE",
  reversedSections.map((s:any) => ({
    id: s.id,
    title: s.sectionName
  }))
);

setModules(mappedModules);

    setModules(
      mappedModules
    );

console.log("FULL COURSE =>", course);

console.log(
  "SECTIONS FROM API =>",
  course.sections?.map((s:any) => ({
    id: s.id,
    name: s.sectionName,
    lessons: s.lessons?.map((l:any) => ({
      id: l.id,
      title: l.title
    }))
  }))
);
  } catch (error) {

    console.log(
      error
    );

    toast.error(
      "Failed to load course"
    );
  }
};
const handleEditModule = (
  moduleId: string
) => {

  const module =
    modules.find(
      (m) => m.id === moduleId
    );

  if (!module) return;

  setEditingModuleId(
    moduleId
  );

  setModuleTitle(
    module.title
  );
};
const handleTagInput = (value: string) => {
  const newTags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  setFormData((prev) => ({
    ...prev,
    tags: [...new Set([...(prev.tags || []), ...newTags])],
  }));

  setTagInput("");
};
const handleSaveModule = async () => {

  if (!moduleTitle.trim()) {
    toast.error(
      "Module title required"
    );
    return;
  }

  try {

    if (editingModuleId) {

      await api.post(
        "/api/course/updateSection",
        {
          sectionId:
            editingModuleId,

          sectionName:
            moduleTitle,
        }
      );

      setModules((prev) =>
        prev.map((m) =>
          m.id === editingModuleId
            ? {
                ...m,
                title: moduleTitle,
              }
            : m
        )
      );

      setEditingModuleId(null);

      setModuleTitle("");

      toast.success(
        "Module Updated"
      );

      return;
    }

    await handleAddModule();

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to save module"
    );
  }
};
const handleDeleteModule = async (
  moduleId: string
) => {

  if (
    !window.confirm(
      "Delete this module?"
    )
  )
    return;

  try {

    await api.post(
      "/api/course/deleteSection",
      {
        sectionId: moduleId,
      }
    );

    setModules((prev) =>
      prev.filter(
        (m) => m.id !== moduleId
      )
    );

    toast.success(
      "Module Deleted"
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to delete module"
    );
  }
};
const handleEditLesson = (
  moduleId: string,
  lessonId: string
) => {

  const module = modules.find(
    (m) => m.id === moduleId
  );

  const lesson = module?.lessons.find(
    (l) => l.id === lessonId
  );

  if (!lesson) return;

  setLessonForms((prev) => ({
  ...prev,
  [moduleId]: {
    ...lesson,

    pdfUrl:
      lesson.pdfUrl || "",

    videoUrl:
      lesson.videoUrl || "",

    documentPreview:
      lesson.pdfUrl || "",

    videoPreview:
      lesson.videoUrl || "",

    documentFile: null,
    videoFile: null,
  },
}));

  setEditingLesson({
    moduleId,
    lessonId,
  });

  setShowLessonForm((prev) => ({
    ...prev,
    [moduleId]: true,
  }));
};
const handleUpdateLesson = async (
  moduleId: string
) => {

  const lesson =
    lessonForms[moduleId];

  try {

    setLessonUploading((prev) => ({
      ...prev,
      [moduleId]: true,
    }));

    const formData =
      new FormData();

    formData.append(
      "subSectionId",
      editingLesson?.lessonId || ""
    );

    formData.append(
      "title",
      lesson.title
    );

    formData.append(
      "description",
      lesson.content
    );

    formData.append(
      "timeDuration",
      lesson.duration
    );

    if (lesson.videoFile) {
      formData.append(
        "video",
        lesson.videoFile
      );
    }

    if (lesson.documentFile) {
      formData.append(
        "pdf",
        lesson.documentFile
      );
    }

    const res =
      await api.post(
        "/api/course/updateSubSection",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    console.log(
      "UPDATE RESPONSE",
      res.data
    );

   
   toast.success("Lesson Updated");

await fetchCourse();

setEditingLesson(null);

setShowLessonForm((prev) => ({
  ...prev,
  [moduleId]: false,
}));

setLessonForms((prev) => ({
  ...prev,
  [moduleId]: {
    id: "",
    title: "",
    duration: "",
    content: "",
    pdfUrl: "",
    videoUrl: "",
    videoFile: null,
    documentFile: null,
  },
}));

    setEditingLesson(null);

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to update lesson"
    );

  } finally {

    setLessonUploading((prev) => ({
      ...prev,
      [moduleId]: false,
    }));
  }
};
const handleDeleteLesson = async (
  moduleId: string,
  lessonId: string
) => {

  if (
    !window.confirm(
      "Delete this lesson?"
    )
  )
    return;

  try {

    await api.post(
      "/api/course/deleteSubSection",
      {
        subSectionId:
          lessonId,
      }
    );

    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons:
                m.lessons.filter(
                  (l) =>
                    l.id !== lessonId
                ),
            }
          : m
      )
    );

    toast.success(
      "Lesson Deleted"
    );

  } catch {
    toast.error(
      "Delete failed"
    );
  }
};
const handleEditQuiz = (
  moduleId: string,
  quizId: string
) => {
  const module = modules.find(
    (m) => m.id === moduleId
  );

  if (!module) return;

  let selectedQuiz: any = null;

  module.lessons.forEach((lesson) => {
    const foundQuiz = lesson.quizzes?.find(
      (q: any) => q.id === quizId
    );

    if (foundQuiz) {
      selectedQuiz = {
        id: foundQuiz.id,
        title: foundQuiz.question,
        questions: [
          {
            id: foundQuiz.id,
            mcqId: foundQuiz.id,
            question: foundQuiz.question,
            options: foundQuiz.options || [],
            correctAnswer:
              foundQuiz.options?.[
                foundQuiz.correctAnswer
              ] || "",
          },
        ],
      };
    }
  });

  if (!selectedQuiz) {
    console.log("Quiz not found");
    return;
  }

  setQuizForms((prev) => ({
    ...prev,
    [moduleId]: selectedQuiz,
  }));

  setEditingQuiz({
    moduleId,
    quizId,
  });

  setShowQuizForm((prev) => ({
    ...prev,
    [moduleId]: true,
  }));
};
const handleDeleteQuiz = async (
  moduleId: string,
  quizId: string
) => {

  if (
    !window.confirm(
      "Delete Quiz?"
    )
  )
    return;

  try {

    await api.delete(
      `/api/mcq/${quizId}`
    );

    setModules((prev) =>
  prev.map((module) =>
    module.id === moduleId
      ? {
          ...module,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            quizzes: (lesson.quizzes || []).filter(
              (quiz: any) => quiz.id !== quizId
            ),
          })),
        }
      : module
  )
);

    toast.success(
      "Quiz Deleted"
    );

  } catch {
    toast.error(
      "Delete failed"
    );
  }
};
const handleUpdateQuiz = async (
  moduleId: string
) => {
  try {

    const quiz =
      quizForms[moduleId];

    if (
      !quiz ||
      !quiz.questions?.length
    ) {
      toast.error(
        "No questions found"
      );
      return;
    }

    console.log(
      "UPDATE QUIZ =>",
      quiz
    );

    await Promise.all(
      quiz.questions.map(
        async (question: any) => {

          console.log(
            "MCQ ID =>",
            question.mcqId
          );

          return api.post(
            "/api/mcq/update",
            {
              mcqId:
                question.mcqId,

              question:
                question.question,

              options:
                question.options,

              correctAnswer:
                question.options.indexOf(
                  question.correctAnswer
                ),
            }
          );
        }
      )
    );

    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map((q) =>
                q.id === editingQuiz?.quizId
                  ? {
                      ...q,
                      title: quiz.title,
                      questions: quiz.questions,
                    }
                  : q
              ),
            }
          : m
      )
    );

    setEditingQuiz(null);

    setShowQuizForm((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

    toast.success(
      "Quiz updated successfully"
    );

    await fetchCourse();

  } catch (error) {

    console.error(
      "UPDATE QUIZ ERROR =>",
      error
    );

    toast.error(
      "Failed to update quiz"
    );
  }
};
useEffect(() => {

  console.log(
    "ID =>",
    editCourseId
  );

  if (editCourseId) {

    fetchCourse();

    setCourseId(
      editCourseId
    );

  }

}, [editCourseId]);
  // ========== useEffect hooks go HERE ==========

  useEffect(() => {
    fetchCategories()
  }, [])


  // ========== Helper Functions go HERE ==========

  /* =======================================================
     CREATE COURSE
  ======================================================= */

  const handleCreateCourse = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    setLoading(true);

    if (courseId) {

      await mockApi.updateCourse(
        courseId,
        formData
      );

      toast.success(
        "Course Updated"
      );
       setStep(2); 

    } else {

      const res =
        await mockApi.createCourse(
          formData
        );

      console.log(
        "Course created with ID:",
        res.id
      );

      setCourseId(
        res.id
      );

      toast.success(
        "Course Created"
      );

      setStep(2);
    }

  } catch (err) {

    console.log(err);

    toast.error(
      courseId
        ? "Failed to update course"
        : "Failed to create course"
    );

  } finally {

    setLoading(false);

  }
};

const fetchCategories = async () => {
  try {
    const res = await api.get(
      "/api/course-category/list"
    );

    console.log(
      "Category API Response",
      res.data
    );

    const categoryList =
      res.data?.data || [];

    setCategories(
      categoryList.map((item: any) => ({
        _id: item.id,
        name: item.name,
      }))
    );
  } catch (error) {
    console.log(error);

    toast.error(
      "Failed to load categories"
    );
  }
};

useEffect(() => {
  fetchCategories();
}, []);

  /* =======================================================
     ADD MODULE
  ======================================================= */

  const handleAddModule = async () => {
    if (!moduleTitle) {
      toast.error("Please enter module title")
      return
    }

    if (!courseId) {
      toast.error("Course not created yet. Please complete Step 1 first.")
      return
    }

    try {
      const res = await mockApi.addModule(courseId, { title: moduleTitle })

     setModules((prev) => [
      ...prev,
      {
        id: res.id,
        title: moduleTitle,
        description: "",
        lessons: [],
        quizzes: [],
      },
    ]);
      setModuleTitle("")
      toast.success("Module Added")
    } catch (err) {
      console.error("Add module error:", err)
      toast.error("Failed to add module")
    }
  }

  // ========== TOGGLE MODULE COLLAPSE ==========
  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  /* =======================================================
     ADD LESSON
  ======================================================= */

const handleAddLesson = async (
  moduleId: string
) => {
 console.log("MODULE ID", moduleId);
const currentModule =
  modules.find(
    m => m.id === moduleId
  );

console.log(
  "MODULE TITLE",
  currentModule?.title
);
  const lesson =
    lessonForms[moduleId];

  if (!lesson?.title) {
    toast.error(
      "Lesson title required"
    );
    return;
  }

  if (!courseId) {
    toast.error(
      "Course not found. Please refresh and try again."
    );
    return;
  }

  try {

    // START LOADER
     setLessonUploading((prev) => ({
      ...prev,
      [moduleId]: true,
    }));
    const res =
      await mockApi.addLesson(
        moduleId,
        lesson
      );

    console.log(
      "LESSON API RESPONSE",
      res
    );

    const subSections =
      res?.data?.subSection || [];

    const latestSubSection =
      subSections[
        subSections.length - 1
      ];

    const realSubSectionId =
      latestSubSection?._id;

    if (!realSubSectionId) {
      toast.error(
        "SubSection ID not found"
      );
      return;
    }

    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  ...lesson,

                  id:
                    realSubSectionId,

                  pdfUrl:
                    latestSubSection?.pdfUrl || "",

                  videoUrl:
                    latestSubSection?.videoUrl || "",
                },
              ],
            }
          : m
      )
    );

    setLessonForms((prev) => ({
      ...prev,
      [moduleId]: {
        id: "",
        title: "",
        duration: "",
        content: "",

        pdfUrl: "",
        videoUrl: "",

        videoFile: null,
        documentFile: null,
      },
    }));

    setShowLessonForm((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

    toast.success(
      "Lesson Added Successfully"
    );
setUploadStatus(prev => ({
  ...prev,
  [moduleId]: "success",
}));
setTimeout(() => {
  setUploadStatus(prev => ({
    ...prev,
    [moduleId]: "idle",
  }));
}, 2000);
  } catch (err) {

    console.error(
      "Add lesson error:",
      err
    );

    toast.error(
      "Failed to add lesson"
    );

  } finally {

  setLessonUploading((prev) => ({
    ...prev,
    [moduleId]: false,
  }));
}
};

  /* =======================================================
     PUBLISH
  ======================================================= */

  // ========== SAVE MODULES & GO TO FAQ ==========
  const handleSaveModulesAndContinue = async () => {
    // Just save current modules data and move to FAQ
    // No API call to publish yet
    toast.success("Modules saved")
    setStep(3)  // Go to FAQ step
  }

  // ========== FINAL PUBLISH (when all steps complete) ==========
  const handleFinalPublish = async () => {
    try {
      setLoading(true)

      // This will publish the course
      await mockApi.publishCourse(courseId)

      toast.success("Course updated Successfully!")

      setStep(4)  // Go to success page (or final step)
       setTimeout(() => {
        window.location.href =
          "/recruiter/courses";
      }, 200);
    } catch (err) {
      console.error("Publish error:", err)
      toast.error("Failed to publish course")
    } finally {
      setLoading(false)
    }
  }

  // ========== NEW HELPER FUNCTIONS FOR PAGE 1 ==========



  const handleDragOver = (e, setDragging) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e, setDragging) => {
    e.preventDefault()
    setDragging(false)
  }

 const handleCoverDrop = (e) => {
  e.preventDefault();
  setIsDraggingCover(false);

  const file = e.dataTransfer.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size cannot exceed 500MB");
    return;
  }

  setFormData({
    ...formData,
    thumbnailImage: file,
  });

  const reader = new FileReader();

  reader.onloadend = () =>
    setCoverPreview(reader.result);

  reader.readAsDataURL(file);
};
  const handleVideoDrop = (e) => {
  e.preventDefault();
  setIsDraggingVideo(false);

  const file = e.dataTransfer.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("video/")) {
    toast.error("Only video files are allowed");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size cannot exceed 500MB");
    return;
  }

  setFormData({
    ...formData,
    promotionalVideo: file,
  });

  setVideoPreview(file.name);
};

  // ========== FILE UPLOAD HANDLERS ==========

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const handleCoverUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Only Image
  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed");
    e.target.value = "";
    return;
  }

  // Max Size
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size cannot exceed 500MB");
    e.target.value = "";
    return;
  }

  setMediaUploading((prev) => ({
    ...prev,
    cover: true,
  }));

  const reader = new FileReader();

  reader.onloadend = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnailImage: file,
    }));

    setCoverPreview(reader.result as string);

    setMediaUploading((prev) => ({
      ...prev,
      cover: false,
    }));
  };

  reader.readAsDataURL(file);
};
  const handleVideoUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Only Video
  if (!file.type.startsWith("video/")) {
    toast.error("Only video files are allowed");
    e.target.value = "";
    return;
  }

  // Max Size
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size cannot exceed 500MB");
    e.target.value = "";
    return;
  }

  setMediaUploading((prev) => ({
    ...prev,
    video: true,
  }));

  setFormData((prev) => ({
    ...prev,
    promotionalVideo: file,
  }));

  setVideoPreview(file.name);

  setMediaUploading((prev) => ({
    ...prev,
    video: false,
  }));
};

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // ========== LEARNING OUTCOMES FUNCTIONS ==========


 const updateLearningOutcome = (
  index: number,
  value: string
) => {
  const newOutcomes = [...formData.learningOutcomes];
  newOutcomes[index] = value;

  setFormData({
    ...formData,
    learningOutcomes: newOutcomes,
  });
};

  const addLearningOutcome = () => {
    setFormData({
      ...formData,
      learningOutcomes: [...formData.learningOutcomes, ""],
    })
  }

  const removeLearningOutcome = (index: number) => {
    const newOutcomes = formData.learningOutcomes.filter((_, i) => i !== index)
    setFormData({ ...formData, learningOutcomes: newOutcomes })
  }

  // ========== QUIZ FUNCTIONS ==========

const handleAddQuiz = async (
  moduleId: string
) => {

  const currentModule =
    modules.find(
      (m) => m.id === moduleId
    );

  const quiz =
    quizForms[moduleId];

  
  if (
    !quiz.questions ||
    quiz.questions.length === 0
  ) {
    toast.error(
      "At least one question required"
    );
    return;
  }

  // ✅ GET LAST CREATED LESSON
  const latestLesson =
    currentModule?.lessons?.[
      currentModule.lessons.length - 1
    ];

  console.log(
    "LATEST LESSON",
    latestLesson
  );

  // ✅ REAL SUBSECTION ID
  const realSubSectionId =
  selectedLessonId;

  console.log(
    "REAL SUBSECTION ID",
    realSubSectionId
  );

  if (!realSubSectionId) {
    toast.error(
      "Please add lesson first"
    );
    return;
  }

  try {

    const res =
      await mockApi.addQuiz(
        courseId,
        realSubSectionId,
        quiz
      );

    setModules((prev) =>
  prev.map((m) =>
    m.id === moduleId
      ? {
          ...m,
          lessons: m.lessons.map((lesson, index) =>
  index === m.lessons.length - 1
    ? {
        ...lesson,
        quizzes: [
          ...(lesson.quizzes || []),
          {
            id: res.quizId,
            question: res.questions?.[0]?.question || "",
            options: res.questions?.[0]?.options || [],
            correctAnswer:
              res.questions?.[0]?.correctAnswer || "",
          },
        ],
      }
    : lesson
),
        }
      : m
  )
);

    // ✅ RESET QUIZ FORM
    setQuizForms((prev) => ({
      ...prev,
      [moduleId]: {
        id: "",
        title: "",
        questions: [],
      },
    }));

    setShowQuizForm((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

    toast.success(
      "Quiz Added"
    );
    await fetchCourse();
    setShowQuizForm((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

  } catch (err) {

    console.log(err);

    toast.error(
      "Failed to add quiz"
    );
  }
};

  const addQuestionToQuiz = (moduleId: string) => {
    const currentQuiz = quizForms[moduleId] || {
      id: "",
      title: "",
      questions: [],
    }

    setQuizForms((prev) => ({
  ...prev,
  [moduleId]: {
    ...currentQuiz,
    questions: [
      ...(currentQuiz.questions || []),
      {
        id: Date.now().toString(),
        question: "",
        options: ["", ""],
        correctAnswer: "",
      },
    ],
  },
}));
  }

  const updateQuizQuestion = (
    moduleId: string,
    questionIndex: number,
    field: string,
    value: string
  ) => {
    const currentQuiz = quizForms[moduleId]
    const updatedQuestions = [...currentQuiz.questions]

    if (field === 'question') {
      updatedQuestions[questionIndex].question = value
    } else if (field === 'correctAnswer') {
      updatedQuestions[questionIndex].correctAnswer = value
    }

    setQuizForms((prev) => ({
      ...prev,
      [moduleId]: {
        ...currentQuiz,
        questions: updatedQuestions,
      },
    }))
  }

  const updateQuizOption = (
    moduleId: string,
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const currentQuiz = quizForms[moduleId]
    const updatedQuestions = [...currentQuiz.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value

    setQuizForms((prev) => ({
      ...prev,
      [moduleId]: {
        ...currentQuiz,
        questions: updatedQuestions,
      },
    }))
  }

  const addOptionToQuestion = (moduleId: string, questionIndex: number) => {
    const currentQuiz = quizForms[moduleId]
    const updatedQuestions = [...currentQuiz.questions]
    updatedQuestions[questionIndex].options.push("")

    setQuizForms((prev) => ({
      ...prev,
      [moduleId]: {
        ...currentQuiz,
        questions: updatedQuestions,
      },
    }))
  }

  const removeQuizQuestion = (
  moduleId: string,
  questionIndex: number
) => {

  const currentQuiz =
    quizForms[moduleId];

  const updatedQuestions =
    currentQuiz.questions.filter(
      (_, i) => i !== questionIndex
    );

  if (updatedQuestions.length === 0) {

    setShowQuizForm((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

    return;
  }

  setQuizForms((prev) => ({
    ...prev,
    [moduleId]: {
      ...currentQuiz,
      questions: updatedQuestions,
    },
  }));
};

  // ========== TAGS FUNCTIONS ==========

  const addTag = (tag: string) => {
    if (!tag.trim()) return
    if (formData.tags?.includes(tag.trim())) {
      toast.error("Tag already exists")
      return
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tag.trim()],
    }))
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }))
  }


  // ========== FAQ FUNCTIONS ==========

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq
      ),
    }))
  }

  const addFAQ = () => {
    const newId = Date.now().toString()
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: newId,
          question: "",
          answer: "",
        },
      ],
    }))
  }

  const removeFAQ = (id: string) => {
    if (formData.faqs.length <= 1) {
      toast.error("At least one FAQ is required")
      return
    }
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }))
  }

  const getCharacterCountColor = (length: number) => {
    if (length >= 250) return 'danger'
    if (length >= 200) return 'warning'
    return ''
  }
  /* =======================================================
     SUCCESS // ========== RETURN STATEMENT ==========
  ======================================================= */

  {/* ========== STEP 4 - SUCCESS PAGE ========== */ }
  // if (step === 4) {
  //   return (
  //     <div className="max-w-3xl mx-auto p-10 text-center">
  //       <div className="text-4xl mb-4">✅</div>
  //       <h2 className="text-2xl font-bold">Course Published Successfully!</h2>
  //       <p className="text-gray-500 mt-2">Your course is now live.</p>
  //       <button
  //         className="btn-primary mt-6"
  //         onClick={() => {
  //           // Reset form or redirect
  //           window.location.href = "/recruiter/courses"
  //         }}
  //       >
  //         View All Courses
  //       </button>
  //     </div>
  //   )
  // }



  return (
    <Shell>
    <div className="max-w-5xl mx-auto p-6">
      <Toaster />

      {/* =======================================================
          STEP 1
      ======================================================= */}

      {step === 1 && (
        <form onSubmit={handleCreateCourse}>
          {/* Header */}
          <div className="form-header">
           <h1>
              {courseId
                ? "Edit Course"
                : "Create New Course"}
            </h1>
          </div>

          {/* Section 1: Basic Information */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>

            {/* Course Title */}
            <div className="form-group">
              <label>Course Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Graphic Design Bootcamp: Photoshop, Illustrator, InDesign"
                // required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Course Subtitle - NEW */}
            <div className="form-group">
              <label>Course Subtitle</label>
              <input
                type="text"
                className="form-control"
                placeholder="ORN-AI is an interesting platform that will teach you in more an interactive way"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* Row: Category, Level, Instructor */}
            <div className="form-row-3">
              {/* Category */}
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select
                  className="form-control"
                  // required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level - NEW */}
              <div className="form-group">
                <label>Level</label>
                <select
                  className="form-control"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advance">Advance</option>
                </select>
              </div>

              {/* Instructor - NEW */}
              <div className="form-group">
                <label>Instructor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                />
              </div>
            </div>


            {/* Row: Price & Tags */}
            <div className="form-row-2">
              {/* Price */}
              <div className="form-group">
                <label>Price <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    style={{ paddingLeft: '32px' }}
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <p className="upload-hint" style={{ marginTop: '4px' }}>
                  Enter 0 for free course
                </p>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input-container">
                  <div className="tags-list">
                    {formData.tags?.map((tag, index) => (
                      <span key={index} className="tag-item">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => removeTag(index)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrapper">
                    <input
                      type="text"
                      placeholder="Add tag and press Enter"
                       value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTagInput(tagInput);
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="upload-hint" style={{ marginTop: '4px' }}>
                  Press Enter to add tag (e.g., Beginner, Web Development, Design)
                </p>
              </div>
            </div>

            {/* Course Description */}
            <div className="form-group">
              <label>Course Description <span className="required">*</span></label>
              <textarea
                className="form-control"
                rows={5}
                // required
                placeholder="ORN-AI is an interesting platform that will teach you in more an interactive way..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: What Students Will Learn */}
          <div className="form-section">
            <h2 className="section-title">What Students Will Learn?</h2>

            {formData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Learn Figma Basic to Advanced Design"
                  value={outcome}
                  onChange={(e) =>
                    updateLearningOutcome(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();

                      const values = outcome
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);

                      if (values.length > 1) {
                        setFormData((prev) => ({
                          ...prev,
                          learningOutcomes: [
                            ...prev.learningOutcomes.filter(
                              (_, i) => i !== index
                            ),
                            ...values,
                          ],
                        }));
                      }
                    }
                  }}
                />
                {formData.learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeLearningOutcome(index)}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-btn" onClick={addLearningOutcome}>
              <Plus size={16} /> Add More
            </button>
          </div>

          {/* Section 3: Media */}
          <div className="form-section">
            <h2 className="section-title">Media</h2>

            {/* Row: Cover Photo & Promotional Video */}
            <div className="media-row">

              {/* Cover Photo */}
              <div className="media-col">
                <label>Cover Photo</label>
                <div
                  className={`file-upload-area ${isDraggingCover ? 'dragging' : ''}`}
                  onDragOver={(e) => handleDragOver(e, setIsDraggingCover)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDraggingCover)}
                  onDrop={handleCoverDrop}
                  onClick={() => document.getElementById('coverInput').click()}
                >
                  <div className="upload-icon">
                    <div className="file-status-area">
                      {loading ? (
                        <div className="uploading-status">
                          <div className="button-spinner"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="upload-complete">
                          <Check size={16} />
                          <span>Ready</span>
                        </div>
                      )}
                    </div>
                  </div>
                    {coverPreview && (
                      <div className="mt-3">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}


                  <div className="upload-text">
                    Drag & Drop image or <span className="upload-browse">Browse</span>
                  </div>
                  <div className="upload-hint"> JPG, PNG, GIF, WEBP (Max 500MB)</div>
                  <input
                    id="coverInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleCoverUpload}
                  />
                </div>

                {formData.thumbnailImage && (
                  <div className="file-list">
                    <div className="file-item">
                      <div className="file-info">
                        <File size={16} />
                        <span className="file-name">{formData.thumbnailImage.name}</span>
                        <span className="file-size">{formatFileSize(formData.thumbnailImage.size)}</span>
                      </div>
                      <div className="file-status-area">
                        {uploadProgress.cover === 'uploading' ? (
                          <div className="uploading-status">
                            <div className="uploading-spinner"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : uploadProgress.cover === 'completed' ? (
                          <div className="upload-complete">
                            <Check size={16} />
                            <span>Ready</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Promotional Video */}
              <div className="media-col">
                <label>Promotional Video</label>
                <div
                  className={`file-upload-area ${isDraggingVideo ? 'dragging' : ''}`}
                  onDragOver={(e) => handleDragOver(e, setIsDraggingVideo)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDraggingVideo)}
                  onDrop={handleVideoDrop}
                  onClick={() => document.getElementById('videoInput').click()}
                >
                  <div className="upload-icon">
                  <div className="file-status-area">
                    {loading ? (
                      <div className="uploading-status">
                        <div className="button-spinner"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="upload-complete">
                        <Check size={16} />
                        <span>Ready</span>
                      </div>
                    )}
                  </div>
                  </div>
                  {videoPreview && (
                    <div className="mt-3">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-48 rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="upload-text">
                    Drag & Drop video or <span className="upload-browse">Browse</span>
                  </div>
                  <div className="upload-hint">MP4, MOV, AVI (Max 500MB)</div>
                  <input
                    id="videoInput"
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={handleVideoUpload}
                  />
                </div>

                {formData.promotionalVideo && (
                  <div className="file-list">
                    <div className="file-item">
                      <div className="file-info">
                        <Video size={16} />
                        <span className="file-name">{formData.promotionalVideo.name}</span>
                        <span className="file-size">{formatFileSize(formData.promotionalVideo.size)}</span>
                      </div>
                      <div className="file-status-area">
                        {uploadProgress.video === 'uploading' ? (
                          <div className="uploading-status">
                            <div className="uploading-spinner"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : uploadProgress.video === 'completed' ? (
                          <div className="upload-complete">
                            <Check size={16} />
                            <span>Ready</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-group">
            <button type="button" className="btn-draft">
              Save as Draft
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Save & Continue"}
            </button>
          </div>
        </form>
      )}

      {/* =======================================================
          STEP 2
      ======================================================= */}


      {step === 2 && (
        <div>
          <div className="form-header">
            <h1>Create New Course</h1>
          </div>

          
          {/* Add Module Button at Bottom */}
          {!editingModuleId && (
          <div className="add-module-bottom">
            <div className="add-module-section" style={{ marginBottom: '0' }}>
              <input
                type="text"
                className="add-module-input"
                placeholder="Module Title (e.g., Greetings and Introduction)"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
              <button
                type="button"
                className="add-module-btn"
                onClick={handleSaveModule}
              >
                <Plus size={16} /> {
  editingModuleId
    ? "Update Module"
    : "Add Module"
}
              </button>
            </div>
          </div>
          )}
{/* Modules List */}
          {modules.length === 0 ? (
            <div className="empty-modules">
              <div className="empty-modules-icon">📚</div>
              <p className="empty-modules-text">
                No modules yet. Click "Add Module" to start building your course.
              </p>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              
               <React.Fragment key={module.id}>
                {editingModuleId === module.id && (
                  <div className="add-module-bottom">
                    <div
                      className="add-module-section"
                      style={{ marginBottom: "0" }}
                    >
                      <input
                        type="text"
                        className="add-module-input"
                        value={moduleTitle}
                        onChange={(e) =>
                          setModuleTitle(e.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="add-module-btn"
                        onClick={handleSaveModule}
                      >
                        Update Module
                      </button>

                      <button
                        type="button"
                        className="btn-draft"
                        onClick={() => {
                          setEditingModuleId(null);
                          setModuleTitle("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              <div className="module-card">                
                {/* Collapsible Header */}
                <div
                  className="module-header"
                  onClick={() => toggleModuleCollapse(module.id)}
                >
                  <div className="module-header-left">
                    <ChevronRight
                      size={20}
                      className={`collapse-icon ${collapsedModules[module.id] ? '' : 'rotated'}`}
                    />
                    <h3 className="module-title">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                  </div>
                  <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(module.id);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    <span className="module-number">
                      📚 {module.lessons.length} Lessons
                    </span>
                    <span className="module-number">
                      📝 {module.quizzes.length} Quizzes
                    </span>
                  </div>
                </div>

                {/* Collapsible Content */}
                <div className={`module-content ${collapsedModules[module.id] ? 'collapsed' : ''}`}>
                    {/* ========== EXISTING LESSONS LIST ========== */}
                 {module.lessons.length > 0 && (
                      <div className="lessons-list">
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            marginBottom: "12px",
                            color: "#64748b",
                          }}
                        >
                          📚 Lessons in this module:
                        </h4>

                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id}>
                        {/* LESSON ROW */}
                        <div className="existing-lesson-item">
                          <div className="existing-lesson-info">
                            <span className="lesson-number">
                              Lesson {lessonIndex + 1}
                            </span>

                            <span className="existing-lesson-title">
                              {lesson.title}
                            </span>

                            {lesson.duration && (
                              <span className="existing-lesson-duration">
                                ⏱ {lesson.duration}
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            
                            <button
                              type="button"
                              className="add-lesson-btn"
                              onClick={() => {
                                setSelectedLessonId(lesson.id);

                                setQuizForms((prev) => ({
                                  ...prev,
                                  [module.id]: {
                                    id: "",
                                    title: "",
                                    questions: [
                                      {
                                        id: Date.now().toString(),
                                        question: "",
                                        options: ["", ""],
                                        correctAnswer: "",
                                      },
                                    ],
                                  },
                                }));

                                setShowQuizForm((prev) => ({
                                  ...prev,
                                  [module.id]: true,
                                }));
                              }}
                            >
                              <Plus size={16} />
                              Quiz
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditLesson(
                                  module.id,
                                  lesson.id
                                )
                              }
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLesson(
                                  module.id,
                                  lesson.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* QUIZ UNDER LESSON */}
                        {lesson.quizzes?.length > 0 && (
                          <div
                            style={{
                              marginLeft: "40px",
                              marginTop: "8px",
                              marginBottom: "12px",
                              borderLeft: "2px solid #e2e8f0",
                              paddingLeft: "15px",
                            }}
                          >
                            {lesson.quizzes.map(
                              (quiz: any, quizIndex: number) => (
                                <div
                                  key={quiz.id}
                                  className="existing-lesson-item"
                                >
                                  <div className="existing-lesson-info">
                                    <span className="lesson-number">
                                      📝 Quiz {quizIndex + 1}
                                    </span>

                                    <span className="existing-lesson-title">
                                      {quiz.question}
                                    </span>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditQuiz(
                                          module.id,
                                          quiz.id
                                        )
                                      }
                                    >
                                      <Edit size={16} />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteQuiz(
                                          module.id,
                                          quiz.id
                                        )
                                      }
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                      </div>
                  )}


                  {/* ========== EXISTING QUIZZES LIST ========== */}
                  {/* {module.quizzes.length > 0 && (
                    <div className="lessons-list">
                      <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#64748b' }}>
                        📝 Quizzes in this module:
                      </h4>
                      {module.quizzes.map((quiz, quizIndex) => (
                        <div key={quiz.id} className="existing-lesson-item">
                          <div className="existing-lesson-info">
                            <span className="lesson-number">Quiz {quizIndex + 1}</span>
                            <span className="existing-lesson-title">{quiz.title}</span>
                            <span className="existing-lesson-duration">📋 {quiz.questions.length} questions</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleEditQuiz(
                                  module.id,
                                  quiz.id
                                )
                              }
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteQuiz(
                                  module.id,
                                  quiz.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                      ))}
                    </div>
                  )} */}
                  {/* Action Buttons - Add Lesson & Add Quiz */}
                  <div className="module-actions">
                    <button
                      type="button"
                      className="add-lesson-btn"
                      onClick={() => {
                        setShowLessonForm((prev) => ({
                          ...prev,
                          [module.id]: !prev[module.id],
                        }));

                        setShowQuizForm((prev) => ({
                          ...prev,
                          [module.id]: false,
                        }));
                      }}
                    >
                      <Plus size={16} /> Add Lesson
                    </button>

                   
                  </div>

                  {/* ========== LESSON FORM ========== */}
                  {showLessonForm[module.id] && (
                    <div className="lesson-form">
                      <input
                        type="text"
                        className="lesson-input"
                        placeholder="Lesson Title (e.g., What is Amazon KDP?)"
                        value={lessonForms[module.id]?.title || ""}
                        onChange={(e) =>
                        setLessonForms((prev) => ({
                          ...prev,
                          [module.id]: {
                            ...prev[module.id],
                            title: e.target.value,
                          },
                        }))
                      }
                      />

                      <input
                        type="text"
                        className="lesson-input"
                        placeholder="Duration (e.g., 10:30)"
                        value={lessonForms[module.id]?.duration || ""}
                        onChange={(e) =>
                          setLessonForms((prev) => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              duration: e.target.value,
                            },
                          }))
                        }
                      />

                      <textarea
                        className="lesson-input"
                        rows={3}
                        placeholder="Lesson Description"
                        value={lessonForms[module.id]?.content || ""}
                        onChange={(e) =>
                          setLessonForms((prev) => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              content: e.target.value,
                            },
                          }))
                        }
                      />

                      {/* Media Row: Document & Video */}
                      <div className="lesson-media-row">
                        {/* Document Upload */}
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Document (PDF, Image)</label>
                          <div
                            className="file-upload-area-small"
                            onClick={() => document.getElementById(`lesson-doc-${module.id}`)?.click()}
                          >
                            <div className="upload-icon">📄</div>
                            {
                                lessonForms[module.id]?.documentFile && (
                                  lessonUploading[module.id] ? (
                                    <div
                                      style={{
                                        marginTop: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div style={spinnerStyle} />
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        marginTop: "6px",
                                        color: "#22c55e",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      ✓
                                    </div>
                                  )
                                )
                              }
                            {
                              lessonForms[module.id]?.documentPreview && (
                                <div
                                  style={{
                                    marginTop: "10px",
                                    width: "100%",
                                  }}
                                >
                                  {lessonForms[module.id]?.documentFile?.type?.startsWith(
                                    "image/"
                                  ) ? (
                                    <img
                                      src={
                                        lessonForms[module.id]
                                          ?.documentPreview
                                      }
                                      alt="Preview"
                                      style={{
                                        width: "100%",
                                        height: "250px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    />
                                  ) : (
                                    <iframe
                                      src={
                                        lessonForms[module.id]
                                          ?.documentPreview
                                      }
                                      title="PDF Preview"
                                      style={{
                                        width: "100%",
                                        height: "250px",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        background: "#fff",
                                      }}
                                    />
                                  )}
                                </div>
                              )
                            }
                            <div className="upload-text">PDF or Image</div>
                            <div className="upload-hint"> PDF Only (Max 500MB)</div>
                            <input
                              type="file"
                              accept=".pdf"
                              style={{ display: 'none' }}
                              id={`lesson-doc-${module.id}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];

                                  if (!file) return;

                                  // Only PDF
                                  if (file.type !== "application/pdf") {
                                    toast.error("Only PDF files are allowed");
                                    e.target.value = "";
                                    return;
                                  }

                                  // Max 500MB
                                  if (file.size > 500 * 1024 * 1024) {
                                    toast.error("PDF size cannot exceed 500MB");
                                    e.target.value = "";
                                    return;
                                  }

                                  setLessonForms((prev) => ({
                                    ...prev,
                                    [module.id]: {
                                      ...prev[module.id],
                                      documentFile: file,
                                      documentPreview: URL.createObjectURL(file),
                                    },
                                  }));
                                }}
                            />
                          </div>
                          
                            
                              
                        </div>

                        {/* Video Upload */}
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Video</label>
                          <div
                            className="file-upload-area-small"
                            onClick={() => document.getElementById(`lesson-video-${module.id}`)?.click()}
                          >
                           
                            <div className="upload-icon">🎥</div>
                            <div className="upload-text">MP4, MOV</div>
                            {
                            lessonForms[module.id]?.videoFile && (
                              lessonUploading[module.id] ? (
                                <div
                                  style={{
                                    marginTop: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={spinnerStyle} />
                                </div>
                              ) : (
                                <div
                                  style={{
                                    marginTop: "6px",
                                    color: "#22c55e",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                  }}
                                >
                                  ✓
                                </div>
                              )
                            )
                          }
                            {
                              lessonForms[module.id]?.videoPreview && (
                                <div
                                  style={{
                                    width: "100%",
                                    marginTop: "10px",
                                  }}
                                >
                                  <video
                                    controls
                                    src={
                                      lessonForms[module.id]
                                        ?.videoPreview
                                    }
                                    style={{
                                      width: "100%",
                                      height: "250px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </div>
                              )
                            }
                            <div className="upload-hint">Video Only (Max 500MB)</div>
                            
                            <input
                              type="file"
                              accept="video/*"
                              style={{ display: 'none' }}
                              id={`lesson-video-${module.id}`}
                             onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                // Only Video
                                if (!file.type.startsWith("video/")) {
                                  toast.error("Only video files are allowed");
                                  e.target.value = "";
                                  return;
                                }

                                // Max 500MB
                                if (file.size > 500 * 1024 * 1024) {
                                  toast.error("Video size cannot exceed 500MB");
                                  e.target.value = "";
                                  return;
                                }

                                setLessonForms((prev) => ({
                                  ...prev,
                                  [module.id]: {
                                    ...prev[module.id],
                                    videoFile: file,
                                    videoPreview: URL.createObjectURL(file),
                                  },
                                }));
                              }}
                              />
                          </div>
                         
                        

                        </div>
                      </div>

                      <button
                        type="button"
                        className="add-lesson-btn"
                        disabled={lessonUploading[module.id]}
                        onClick={() =>
                          editingLesson?.moduleId === module.id
                            ? handleUpdateLesson(module.id)
                            : handleAddLesson(module.id)
                        }
                      >
                        {lessonUploading[module.id] ? (
                          <>
                            <div className="button-spinner" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            {editingLesson?.moduleId === module.id
                              ? "Update Lesson"
                              : "Add This Lesson"}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* ========== QUIZ FORM ========== */}
                  {showQuizForm[module.id] && (
                    <div className="lesson-form" style={{ marginTop: '16px' }}>
                      {/* <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#22c55e' }}>
                        Add New Quiz
                      </h4> */}

                      {/* <input
                        type="text"
                        className="lesson-input"
                        placeholder="Quiz Title (e.g., First Quiz of this module)"
                        value={quizForms[module.id]?.title || ""}
                        onChange={(e) =>
                          setQuizForms((prev) => ({
                            ...prev,
                           [module.id]: {
                              ...prev[module.id],
                              title: e.target.value,
                            },
                          }))
                        }
                      /> */}

                      {/* Questions List */}
                      {quizForms[module.id]?.questions?.map((question, qIndex) => (
                        <div key={qIndex} className="module-card" style={{ marginTop: '16px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h5 style={{ fontWeight: 600 }}>Question</h5>
                            <button
                              type="button"
                              className="remove-lesson-btn"
                              onClick={() => removeQuizQuestion(module.id, qIndex)}
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <input
                            type="text"
                            className="lesson-input"
                            placeholder="Question text"
                            value={question.question}
                            onChange={(e) => updateQuizQuestion(module.id, qIndex, 'question', e.target.value)}
                          />

                          <div style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Options</label>
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                  type="text"
                                  className="lesson-input"
                                  placeholder={`Option ${oIndex + 1}`}
                                  value={option}
                                  onChange={(e) => updateQuizOption(module.id, qIndex, oIndex, e.target.value)}
                                  style={{ marginBottom: 0 }}
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              className="add-lesson-btn"
                              style={{ marginTop: '8px' }}
                              onClick={() => addOptionToQuestion(module.id, qIndex)}
                            >
                              <Plus size={14} /> Add Option
                            </button>
                          </div>

                          <div style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Correct Answer</label>
                            <select
                              className="lesson-input"
                              value={question.correctAnswer}
                              onChange={(e) => updateQuizQuestion(module.id, qIndex, 'correctAnswer', e.target.value)}
                            >
                              <option value="">Select correct answer</option>
                              {question.options.map((option, oIndex) => (
                                option && <option key={oIndex} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                      ))}

                     <button
                          type="button"
                          className="btn-primary"
                          style={{
                            marginTop: "16px",
                            width: "100%",
                          }}
                          onClick={() =>
                            editingQuiz?.moduleId === module.id
                              ? handleUpdateQuiz(module.id)
                              : handleAddQuiz(module.id)
                          }
                        >
                          {editingQuiz?.moduleId === module.id
                            ? "Update Quiz"
                            : "Save Quiz"}
                        </button>

                      
                    </div>
                  )}

                  
                </div>
              </div>
               </React.Fragment>
            ))
          )}

          {/* Bottom Buttons */}
          <div className="bottom-btn-group">
            <button
              type="button"
              className="btn-draft"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <div className="right-buttons">
              <button
                type="button"
                className="btn-draft"
                onClick={() => {
                  toast.success("Course saved as draft")
                }}
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveModulesAndContinue}
                disabled={loading}
              >
                 {loading
    ? "Saving..."
    : courseId
      ? "Update Course"
      : "Save & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* =======================================================
    STEP 3 - FAQ SECTION
======================================================= */}

      {step === 3 && (
        <div>
          <div className="form-header">
            <h1>Frequently Asked Questions</h1>
            <p style={{ color: '#64748b', marginTop: '8px' }}>
              Add common questions students might have about this course
            </p>
          </div>

          <div className="faq-section">
            {formData.faqs.map((faq, index) => (
              <div key={faq.id} className="faq-item">
                <div className="faq-question">
                  <label>Question {index + 1}</label>
                  <input
                    type="text"
                    className="faq-question-input"
                    placeholder="e.g., Do I need any prior experience?"
                    value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                  />
                </div>

                <div className="faq-answer">
                  <label>Answer</label>
                  <textarea
                    className="faq-answer-textarea"
                    rows={4}
                    placeholder="Write a clear and helpful answer..."
                    value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                    maxLength={500}
                  />
                  <div className={`faq-character-count ${getCharacterCountColor(faq.answer.length)}`}>
                    {faq.answer.length}/500 characters
                  </div>
                </div>

                <div className="faq-remove-btn">
                  <button type="button" onClick={() => removeFAQ(faq.id)}>
                    <X size={14} /> Remove Question
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="add-faq-btn" onClick={addFAQ}>
              <Plus size={16} /> Add Frequently Asked Question
            </button>
          </div>

          {/* Buttons */}
          <div className="step2-btn-group">
            <button
              type="button"
              className="btn-draft"
              onClick={() => setStep(2)}  // Go back to modules
            >
              ← Back to Modules
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleFinalPublish}  // Now this publishes
              disabled={loading}
            >
              {loading ? "Updating..." : "Update →"}
            </button>
          </div>
        </div>
      )}



    </div>
    </Shell>
  )
}
export default EditCoursePage

