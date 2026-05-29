
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock3,
  Users,
  Star,
  Award,
  CheckCircle,
  Download,
  X,
  Menu,
  BookOpen,
} from "lucide-react";
import api
from "../../services/api"
import { Shell }
from "@/components/layout/Shell"

import { useParams } from "react-router-dom";
import { useRoute } from "wouter";

const VideoPlayer = () => {
  const [, params] =
  useRoute("/course/details/:id");

  const id = params?.id;

  console.log("ID =>", id);

  const [course, setCourse] =
    useState<any>(null);

  const [sections, setSections] =
    useState<any[]>([]);

  const [currentLecture,
    setCurrentLecture] =
    useState<any>(null);

  const [expandedSections,
    setExpandedSections] =
    useState<string[]>([]);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(true);

  // QUIZ
  const [quizIndex,
    setQuizIndex] =
    useState(0);

  const [selectedAnswers,
    setSelectedAnswers] =
    useState<any>({});

  const [showResult,
    setShowResult] =
    useState(false);

  const [score,
    setScore] =
    useState(0);

  const videoRef =
    useRef<HTMLVideoElement>(null);

  // 🔥 FETCH API
  useEffect(() => {
    fetchCourse();
  }, [id]);

const fetchCourse = async () => {
  try {
    const res = await api.get(`/api/courses/${id}`);

    const courseData = res.data?.data;

    setCourse(courseData);

    const formattedSections =
      courseData?.sections?.map((section: any) => ({
        id: section.id,
        title: section.sectionName,

        lessons:
          section.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.timeDuration,
            videoUrl: lesson.videoUrl,
            pdfUrl: lesson.pdfUrl,

            quizzes:
              lesson.quizzes?.map((quiz: any) => ({
                ...quiz,

                options: Array.isArray(
                  quiz.options
                )
                  ? quiz.options
                  : JSON.parse(
                      quiz.options || "[]"
                    ),
              })) || [],
          })) || [],
      })) || [];

    setSections(formattedSections);

    if (
      formattedSections.length &&
      formattedSections[0].lessons.length
    ) {
      setCurrentLecture(
        formattedSections[0].lessons[0]
      );

      setExpandedSections([
        formattedSections[0].id,
      ]);
    }
  } catch (error) {
    console.error(
      "Course Fetch Error:",
      error
    );
  }
};
const BASE_URL = "http://localhost:8080";

const getFileUrl = (filePath?: string | null) => {
  if (!filePath) return "";

  return `${BASE_URL}/${filePath.replace(/\\/g, "/")}`;
};

console.log("course", course);
console.log("sections", sections);
console.log("currentLecture", currentLecture);
  // 🔥 OPEN LECTURE
  const handleLecture = (
    lecture: any
  ) => {
    setCurrentLecture(lecture);

    setQuizIndex(0);

    setSelectedAnswers({});

    setShowResult(false);

    setScore(0);
  };

  // 🔥 AUTO NEXT
  const playNextLecture = () => {
    for (let sec of sections) {
      const index =
        sec.lessons.findIndex(
          (lesson: any) =>
            lesson.id ===
            currentLecture?.id
        );

      if (
        index !== -1 &&
        index <
          sec.lessons.length - 1
      ) {
        handleLecture(
          sec.lessons[index + 1]
        );

        return;
      }
    }
  };

  // 🔥 QUIZ
  const submitQuiz = () => {
    let correct = 0;

    currentLecture?.quizzes?.forEach(
      (quiz: any, i: number) => {
        if (
          selectedAnswers[i] ===
          quiz.correctAnswer
        ) {
          correct++;
        }
      }
    );

    setScore(correct);

    setShowResult(true);
  };

  return (
    <>
       <Shell>

      <div className="min-h-screen bg-[#f5f7fb]">

        {/* HERO */}
        <div className="relative overflow-hidden">

          {/* BACKGROUND */}
          <div className="absolute inset-0">

            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/20 blur-[140px]" />

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/20 blur-[140px]" />

          </div>

          {/* CONTENT */}
          <div className="relative z-10 max-w-[1700px] mx-auto px-4 py-8">

            <div className="flex gap-6">

              {/* LEFT */}
              <div
                className={`transition-all duration-300 ${
                  sidebarOpen
                    ? "w-full lg:w-[calc(100%-420px)]"
                    : "w-full"
                }`}
              >

                {/* VIDEO */}
                <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">

                  <div className="aspect-video">

                   {currentLecture?.videoUrl ? (
                      <video
                        ref={videoRef}
                        src={getFileUrl(
                          currentLecture.videoUrl
                        )}
                        controls
                        onEnded={playNextLecture}
                        className="w-full h-full"
                      />
                    ) : currentLecture?.pdfUrl ? (
                      <iframe
                        src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                          getFileUrl(
                            currentLecture.pdfUrl
                          )
                        )}`}
                        className="w-full h-full min-h-[750px] bg-white"
                        title="PDF"
                      />
                    ) : course?.promotionalVideo ? (
                      <video
                        src={getFileUrl(
                          course.promotionalVideo
                        )}
                        controls
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src={getFileUrl(
                          course?.thumbnail
                        )}
                        alt={course?.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="mt-8">

                  {/* TITLE */}
                  <h1 className="text-5xl font-bold text-[#111827] mb-3">
                    {
                      course?.courseName
                    }
                  </h1>

                  {/* SUBTITLE */}
                  <p className="text-xl text-gray-600 mb-6">
                    {course?.subtitle}
                  </p>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-4 mb-8">

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-2">
                      <BookOpen size={18} />
                      <span className="font-semibold">
                        {course?.totalModules || 0} Modules
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-2">
                      <PlayCircle size={18} />
                      <span className="font-semibold">
                        {course?.totalVideos || 0} Videos
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-2">
                      <FileText size={18} />
                      <span className="font-semibold">
                        {course?.totalPdfs || 0} PDFs
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-2">
                      <Clock3 size={18} />
                      <span className="font-semibold">
                        {course?.totalLessons || 0} Lessons
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-5 py-3 font-semibold">
                      {course?.difficulty || "Beginner"}
                    </div>

                    <div className="bg-green-600 text-white rounded-xl px-5 py-3 font-semibold">
                      ₹ {course?.price}
                    </div>

                  </div>

                  {/* CARDS */}
                  <div className="grid gap-6">

                    {/* LEARN */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                      <h2 className="text-3xl font-bold text-[#111827] mb-6">
                        What you'll learn
                      </h2>

                      <div className="grid md:grid-cols-2 gap-5">

                      {sections.map((section: any) => (
                        <div
                          key={section.id}
                          className="flex gap-3"
                        >
                          <CheckCircle
                            className="text-green-500 mt-1"
                            size={20}
                          />

                          <p className="text-gray-700">
                            {section.title}
                          </p>
                        </div>
                      ))}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                      <h2 className="text-3xl font-bold text-[#111827] mb-5">
                        Course Description
                      </h2>

                      <p className="text-gray-700 leading-8">
                        {
                          course?.courseDescription
                        }
                      </p>
                    </div> */}

                    {/* TAGS */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                      <h2 className="text-3xl font-bold text-[#111827] mb-5">
                        Tags
                      </h2>

                     <div className="flex flex-wrap gap-3">

                      <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                        Category: {course?.category}
                      </div>

                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                        Status: {course?.status}
                      </div>

                    </div>
                    </div>

                    {/* INSTRUCTOR */}
                    {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                      <h2 className="text-3xl font-bold text-[#111827] mb-6">
                        Instructor
                      </h2>

                      <div className="flex items-center gap-5">

                        <img
                          src={
                            course
                              ?.instructor
                              ?.image
                          }
                          alt=""
                          className="w-24 h-24 rounded-full object-cover"
                        />

                        <div>

                          <h3 className="text-2xl font-bold text-[#111827]">
                            {
                              course
                                ?.instructor
                                ?.firstName
                            }{" "}
                            {
                              course
                                ?.instructor
                                ?.lastName
                            }
                          </h3>

                          <p className="text-gray-500 mt-2">
                            {
                              course
                                ?.instructor
                                ?.email
                            }
                          </p>

                          <p className="text-gray-500 mt-1">
                            {
                              course
                                ?.instructor
                                ?.contactNumber
                            }
                          </p>
                        </div>
                      </div>
                    </div> */}

                    {/* FAQ */}
                    {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                      <h2 className="text-3xl font-bold text-[#111827] mb-6">
                        FAQ
                      </h2>

                      <div className="space-y-4">

                        {course?.faqs?.map(
                          (faq: any) => (
                            <div
                              key={faq._id}
                              className="border border-gray-200 rounded-2xl p-5"
                            >
                              <h3 className="font-bold text-lg text-[#111827] mb-3">
                                {
                                  faq.question
                                }
                              </h3>

                              <p className="text-gray-600 leading-7">
                                {
                                  faq.answer
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div> */}
                    {/* QUIZ SECTION */}
                    {/* {currentLecture?.quizzes?.length > 0 && (
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">

                        <div className="flex items-center gap-4 mb-8">

                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center">
                            <Award size={28} />
                          </div>

                          <div>

                            <h2 className="text-3xl font-bold text-[#111827]">
                              Lecture Quiz
                            </h2>

                            <p className="text-gray-500 mt-1">
                              Test your understanding
                            </p>
                          </div>
                        </div>

                        <div className="space-y-8">

                          {currentLecture?.quizzes?.map(
                            (
                              quiz: any,
                              quizIndex: number
                            ) => {

                              const submitted =
                                showResult;

                              const selectedOption =
                                selectedAnswers[
                                  quizIndex
                                ];

                              return (

                                <div
                                  key={quiz._id}
                                  className="border border-gray-200 rounded-2xl p-6"
                                >

                                  <h3 className="text-xl font-bold text-[#111827] mb-6">
                                    Q{quizIndex + 1}.{" "}
                                    {quiz.question}
                                  </h3>

                                  <div className="space-y-4">

                                    {quiz?.options?.map(
                                      (
                                        option: string,
                                        optionIndex: number
                                      ) => {

                                        const isCorrect =
                                          optionIndex ===
                                          quiz.correctAnswer;

                                        const isSelected =
                                          selectedOption ===
                                          optionIndex;

                                        return (

                                          <div
                                            key={optionIndex}
                                            onClick={() =>
                                              !submitted &&
                                              setSelectedAnswers(
                                                (
                                                  prev: any
                                                ) => ({
                                                  ...prev,
                                                  [quizIndex]:
                                                    optionIndex,
                                                })
                                              )
                                            }
                                            className={`
                                            p-4 rounded-xl border cursor-pointer transition-all

                                            ${
                                              submitted
                                                ? isCorrect
                                                  ? "bg-green-100 border-green-500 text-green-700"
                                                  : isSelected
                                                  ? "bg-red-100 border-red-500 text-red-700"
                                                  : "bg-gray-50 border-gray-200"
                                                : isSelected
                                                ? "bg-purple-100 border-purple-500"
                                                : "bg-gray-50 border-gray-200 hover:border-purple-400"
                                            }
                                          `}
                                          >

                                            <div className="flex items-center justify-between">

                                              <span>
                                                {option}
                                              </span>

                                       

                                              {submitted &&
                                                isCorrect && (
                                                  <span className="font-semibold">
                                                    ✅ Correct
                                                  </span>
                                                )}

                                              {submitted &&
                                                isSelected &&
                                                !isCorrect && (
                                                  <span className="font-semibold">
                                                    ❌ Wrong
                                                  </span>
                                                )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {!showResult && (
                          <button
                            onClick={submitQuiz}
                            className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
                          >
                            Submit Quiz
                          </button>
                        )}

                        {showResult && (
                          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6">

                            <h3 className="text-3xl font-bold mb-3">
                              Quiz Result
                            </h3>

                            <p className="text-xl">
                              You scored{" "}
                              <span className="font-bold">
                                {score}
                              </span>{" "}
                              out of{" "}
                              {
                                currentLecture?.quizzes
                                  ?.length
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )} */}

                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div
                className={`
                fixed lg:sticky
                top-0 right-0
                h-screen
                w-[400px]
                bg-white/90
                backdrop-blur-xl
                border-l border-gray-200
                shadow-2xl
                overflow-y-auto
                z-50
                transition-all duration-300
                ${
                  sidebarOpen
                    ? "translate-x-0"
                    : "translate-x-full lg:translate-x-0 lg:w-0"
                }
              `}
              >

                {/* HEADER */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 p-5 flex items-center justify-between z-20">

                  <h2 className="text-2xl font-bold text-[#111827]">
                    Course Content
                  </h2>

                  <button
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* SECTIONS */}
                <div className="p-4">

                  {sections.map(
                    (section) => (
                      <div
                        key={section.id}
                        className="mb-4 border border-gray-200 rounded-2xl overflow-hidden"
                      >

                        {/* SECTION */}
                        <button
                          onClick={() =>
                            setExpandedSections(
                              (
                                prev
                              ) =>
                                prev.includes(
                                  section.id
                                )
                                  ? prev.filter(
                                      (
                                        item
                                      ) =>
                                        item !==
                                        section.id
                                    )
                                  : [
                                      ...prev,
                                      section.id,
                                    ]
                            )
                          }
                          className="w-full p-5 bg-gray-50 hover:bg-gray-100 flex justify-between"
                        >

                          <div className="text-left">

                            <h3 className="font-bold text-[#111827]">
                              {
                                section.title
                              }
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {
                                section
                                  .lessons
                                  .length
                              }{" "}
                              lectures
                            </p>
                          </div>

                          {expandedSections.includes(
                            section.id
                          ) ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </button>

                        {/* LESSONS */}
                        {expandedSections.includes(
                          section.id
                        ) &&
                          section.lessons.map(
                            (
                              lesson: any
                            ) => (
                              <div
                                key={
                                  lesson.id
                                }
                                onClick={() =>
                                  handleLecture(
                                    lesson
                                  )
                                }
                                className={`p-4 cursor-pointer border-t border-gray-100 hover:bg-purple-50 transition ${
                                  currentLecture?.id ===
                                  lesson.id
                                    ? "bg-purple-100"
                                    : ""
                                }`}
                              >

                                <div className="flex gap-3">

                                  {lesson.videoUrl ? (
                                    <PlayCircle
                                      className="text-purple-600 mt-1"
                                      size={
                                        20
                                      }
                                    />
                                  ) : (
                                    <FileText
                                      className="text-blue-600 mt-1"
                                      size={
                                        20
                                      }
                                    />
                                  )}

                                  <div>

                                    <h3 className="font-semibold text-[#111827]">
                                      {
                                        lesson.title
                                      }
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                      {
                                        lesson.duration
                                      }{" "}
                                      sec
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )
                  )}

                  {/* CERTIFICATE */}
                  {/* <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white mt-8">

                    <Award
                      size={60}
                      className="mb-5"
                    />

                    <h2 className="text-3xl font-bold mb-4">
                      Get Certificate
                    </h2>

                    <p className="opacity-90 mb-6 leading-7">
                      Complete this course
                      and earn your
                      certificate.
                    </p>

                    <button className="bg-white text-purple-700 font-semibold px-6 py-4 rounded-2xl w-full">
                      Download Certificate
                    </button>
                  </div> */}

                </div>
              </div>

              {/* MOBILE OVERLAY */}
              {sidebarOpen && (
                <div
                  onClick={() =>
                    setSidebarOpen(
                      false
                    )
                  }
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
              )}

              {/* OPEN BTN */}
              {!sidebarOpen && (
                <button
                  onClick={() =>
                    setSidebarOpen(
                      true
                    )
                  }
                  className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl"
                >
                  <Menu size={24} />
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
       </Shell>
    </>
  );
};

export default VideoPlayer;