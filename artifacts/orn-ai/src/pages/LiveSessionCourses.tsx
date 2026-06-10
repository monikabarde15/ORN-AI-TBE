
import React, { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingCart, Trash2, CreditCard,
  Layers, PlayCircle, ClipboardList
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";
import { PlusCircle, CheckCircle2 } from "lucide-react";
interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: string;

  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  paymentId?: string;

  lessonCount?: number;
  quizCount?: number;
  videoCount?: number;
}

export default function LearningPath() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openModal, setOpenModal] =
  useState(false);

const [selectedCourse, setSelectedCourse] =
  useState<any>(null);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [paymentLink, setPaymentLink] = useState("");

const [sessionTitle, setSessionTitle] =
  useState("");

const [trainerName, setTrainerName] =
  useState("");

const [meetingLink, setMeetingLink] =
  useState("");

const [sessionDate, setSessionDate] =
  useState("");

const [startTime, setStartTime] =
  useState("");

const [endTime, setEndTime] =
  useState("");

const [description, setDescription] =
  useState("");

const [creating, setCreating] =
  useState(false);  
const coursesPerPage = 6;
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(
            "/api/payment/students-courses"
            );

            const paidCourses =
            res.data.data.flatMap(
                (item: any) =>
                item.courses.map((course: any) => ({
                    ...course,
                    studentName: item.studentName,
                    studentEmail: item.studentEmail,
                    studentPhone: item.studentPhone,
                    paymentId: item.paymentId,
                }))
            );

            setCourses(paidCourses);
      } catch {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredCourses = useMemo(
    () => courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase())),
    [courses, search]
  );

  const isSelected = (_id: string) =>
    selectedCourses.some(c => c._id === _id);

  const toggleCourse = (course: Course) => {
    setSelectedCourses(prev =>
      prev.some(c => c._id === course._id)
        ? prev.filter(c => c._id !== course._id)
        : [...prev, course]
    );
  };
const totalPages = Math.ceil(
  filteredCourses.length / coursesPerPage
);
const createLiveSession = async () => {
  try {
    setCreating(true);

    await api.post(
      "/api/live-sessions",
      {
        courseId: selectedCourse._id,

        paymentId:
          selectedCourse.paymentId,

        studentName:
          selectedCourse.studentName,

        studentEmail:
          selectedCourse.studentEmail,

        studentPhone:
          selectedCourse.studentPhone,

        sessionTitle,
        trainerName,
        meetingLink,
        sessionDate,
        startTime,
        endTime,
        description,
      }
    );

    toast.success(
      "Live Session Created"
    );

    setOpenModal(false);

    setSessionTitle("");
    setTrainerName("");
    setMeetingLink("");
    setSessionDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to create session"
    );
  } finally {
    setCreating(false);
  }
};
const [sessions, setSessions] =
  useState([]);
  const loadSessions = async () => {
  const res = await api.get(
    "/api/live-sessions"
  );

  setSessions(res.data.data || []);
};
useEffect(() => {
  loadSessions();
}, []);
const paginatedCourses =
  filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );
  const removeCourse = (_id: string) =>
    setSelectedCourses(prev => prev.filter(c => c._id !== _id));

  const subtotal = selectedCourses.reduce((s, c) => s + Number(c.price || 0), 0);
  const gst = Number((subtotal * 0.18).toFixed(2));
  const grandTotal = Number((subtotal + gst).toFixed(2));

  

  return (
    <Shell>
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
            <h1 className="text-4xl font-bold">
                Live Training Sessions
            </h1>
            <p className="mt-2 text-slate-500">Create, manage and assign live sessions for students who have purchased courses</p>
        </div>

        <div className="w-full">
          <div className="">
           <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                    Total Courses
                    </p>
                    <h3 className="text-3xl font-bold">
                    {courses.length}
                    </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                    Paid Students
                    </p>
                    <h3 className="text-3xl font-bold text-green-600">
                    {
                        new Set(
                        courses.map(
                            (c) => c.studentEmail
                        )
                        ).size
                    }
                    </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                    Live Sessions
                    </p>
                    <h3 className="text-3xl font-bold text-orange-600">
                        0
                    </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                    Upcoming
                    </p>
                    <h3 className="text-3xl font-bold text-orange-600">
                    0
                    </h3>
                </div>
                </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading ? "Loading..." : paginatedCourses.map(course => (
                <div key={course._id} className={`overflow-hidden rounded-3xl border bg-white ${isSelected(course._id) ? "border-green-500" : ""}`}>
                  <img
                    src={course.thumbnail || "https://placehold.co/600x400"}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-semibold">{course.title}</h3>
                    <p className="line-clamp-2 text-xs text-slate-500">{course.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-2 py-1"><Layers size={12} className="inline" /> {course.lessonCount || 0}</span>
                      <span className="rounded-full bg-purple-50 px-2 py-1"><ClipboardList size={12} className="inline" /> {course.quizCount || 0}</span>
                      <span className="rounded-full bg-orange-50 px-2 py-1"><PlayCircle size={12} className="inline" /> {course.videoCount || 0}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-green-600">
                            ₹{Number(course.price || 0)}
                        </span>

                        <button
                        onClick={() => {
                            setSelectedCourse(course);
                            setOpenModal(true);
                        }}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-white"
                        >
                        Create Session
                        </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Paid
                        </span>
                        <span className="text-xs text-slate-500">
                            Purchased By:
                            {course.studentName}
                        </span>
                    </div>
                  </div>
                    
                </div>
                
              ))}
            </div>
            <div className="border-t bg-white px-5 py-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() =>
                setCurrentPage((p) => p - 1)
                }
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
                Previous
            </button>

            {Array.from(
                { length: totalPages },
                (_, i) => (
                <button
                    key={i}
                    onClick={() =>
                    setCurrentPage(i + 1)
                    }
                    className={`h-10 w-10 rounded-lg ${
                    currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "border"
                    }`}
                >
                    {i + 1}
                </button>
                )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() =>
                setCurrentPage((p) => p + 1)
                }
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
                Next
            </button>
        </div>
</div>
          </div>

          
        </div>
      </div>
    </div>
    {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Create Live Session
        </h2>

        <button
          onClick={() =>
            setOpenModal(false)
          }
        >
          ✕
        </button>
      </div>

      <div className="mb-4 rounded-xl bg-slate-50 p-4">
        <p className="font-semibold">
          {selectedCourse?.title}
        </p>

        <p className="text-sm text-slate-500">
          {selectedCourse?.studentName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
            value={sessionTitle}
            onChange={(e) =>
                setSessionTitle(e.target.value)
            }
            placeholder="Session Title"
            className="rounded-xl border p-3"
            />
        <input
          placeholder="Trainer Name"
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Meeting Link"
          className="rounded-xl border p-3"
        />

        <input
          type="date"
          className="rounded-xl border p-3"
        />

            <input
            type="time"
            value={endTime}
            onChange={(e) =>
                setEndTime(e.target.value)
            }
            className="rounded-xl border p-3"
            />
        <input
          placeholder="Max Students"
          className="rounded-xl border p-3"
        />
      </div>

      <textarea
        rows={4}
        placeholder="Description"
        className="mt-4 w-full rounded-xl border p-3"
      />

     <button
        onClick={createLiveSession}
        disabled={creating}
        className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-white"
        >
        {creating
            ? "Creating..."
            : "Create Session"}
        </button>
    </div>
  </div>
)}
    </Shell>
  );
}
