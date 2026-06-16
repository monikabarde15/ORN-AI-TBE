import React, { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingCart, Trash2, CreditCard,
  Layers, PlayCircle, ClipboardList
} from "lucide-react";
import {
  Link,
  Copy
} from "lucide-react";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";
import {
  BookOpen,
  ExternalLink,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
interface LearningPath {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  introVideo?: string;
  paymentLink?: string | null;
  courseIds?: string[];
  courses?: any[];
  createdAt?: string;
}
export default function LearningPathList() {
  const [editingId, setEditingId] =
  useState<string | null>(null);
  const [sessionTitle, setSessionTitle] =
    useState("");
  const [search, setSearch] = useState("");
  const [trainerName, setTrainerName] =
    useState("");
  
  const [meetingLink, setMeetingLink] =
    useState("");
  
  const [sessionDate, setSessionDate] =
    useState("");
  
  const [startTime, setStartTime] =
    useState("");
  const [students, setStudents] =
  useState<any[]>([]);

const [selectedStudent, setSelectedStudent] =
  useState<any>(null);
  const [endTime, setEndTime] =
    useState("");
  const [courses, setCourses] =
    useState<LearningPath[]>([]);
  const [description, setDescription] =
    useState("");
  
  const [creating, setCreating] =
    useState(false);  
   const [openModal, setOpenModal] =
    useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<any>(null);
  
  const [loading, setLoading] =
    useState(true);
      const editLearningPath = (
        path: any
      ) => {
        window.location.href =
          `/recruiter/learning-path?edit=${path.id}`;
      };
        const [paths, setPaths] =
          useState<any[]>([]);

        useEffect(() => {
          loadLearningPaths();
        }, []);

  const loadLearningPaths =
    async () => {
      try {
        const res =
          await api.get(
            "/api/learning-paths"
          );

        setPaths(
          res.data.data || []
        );
         setCourses(
        res.data?.data || []
      );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
     const filteredCourses = useMemo(
        () => courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase())),
        [courses, search]
      );
    
const deleteLearningPath = async (
  id: string
) => {
  try {
    await api.delete(
      `/api/learning-paths/${id}`
    );

    setPaths((prev) =>
      prev.filter(
        (path) => path.id !== id
      )
    );

    toast.success(
      "Learning Path Deleted"
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Delete failed"
    );
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
const createLiveSession = async () => {
  try {
if (!selectedStudent) {
  toast.error(
    "Please select a student"
  );
  return;
}
    setCreating(true);

    await api.post("/api/live-sessions", {
      courseId: selectedCourse.courseIds[0],

      paymentId: selectedStudent?.paymentId,
      studentName: selectedStudent?.studentName,
      studentEmail: selectedStudent?.studentEmail,
      studentPhone: selectedStudent?.studentPhone,

      sessionTitle,
      trainerName,
      meetingLink,
      sessionDate,
      startTime,
      endTime,
      description,
    });

    await loadSessions();

    toast.success("Session Created");

    setOpenModal(false);

  } catch (error) {

    console.error(error);

    toast.error("Failed to create session");

  } finally {

    setCreating(false);

  }
};
const uniqueStudents =
  Array.from(
    new Map(
      students.map((s) => [
        s.studentEmail,
        s,
      ])
    ).values()
  );
useEffect(() => {
  loadSessions();
}, []);
// const paginatedCourses =
//   filteredCourses.slice(
//     (currentPage - 1) * coursesPerPage,
//     currentPage * coursesPerPage
//   );
  return (
    <Shell>
      <div className="p-6">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Learning Paths
            </h1>

            <p className="text-slate-500">
              Manage all learning paths
            </p>
          </div>


          <div className="rounded-2xl bg-blue-100 px-4 py-2 font-semibold text-blue-700">
            {paths.length} Paths
          </div>
        <a
          href="/recruiter/learning-path"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
          "
        >
          📚 Learning Paths 
        </a>

        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {paths.map((path) => (
              <div
                key={path.id}
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <img
                  src={
                    path.thumbnail ||
                    "https://placehold.co/600x400"
                  }
                  alt=""
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {path.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                    {path.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} />
                    {path.courses?.length || 0} &nbsp;
                    Courses
                  </div>

                  <div className="mt-5 flex gap-3">
                  <button
                   onClick={() => {
  const input =
    document.createElement("input");

  input.value =
    path.paymentLink || "";

  document.body.appendChild(
    input
  );

  input.select();

  document.execCommand("copy");

  document.body.removeChild(
    input
  );

  toast.success(
    "Payment Link Copied"
  );
}}
                    className="
                      flex-1
                      rounded-xl
                      bg-green-600
                      py-3
                      font-medium
                      text-white
                    "
                  >
                    <Link
                      size={16}
                      className="mr-2 inline"
                    />
                  </button>

                  <button
                  onClick={async () => {
                      try {
                        setSelectedCourse(path);

                        console.log(
                          "COURSE IDS =>",
                          path.courseIds
                        );

                        const res = await api.post(
                          "/api/learning-path-students",
                          {
                            courseIds: path.courseIds || [],
                          }
                        );

                        console.log(
                          "STUDENTS =>",
                          res.data
                        );

                        setStudents(res.data.data || []);

                    if (res.data.data?.length > 0) {
                      setSelectedStudent(res.data.data[0]);
                    }

                    setOpenModal(true);

                      } catch (error) {
                        console.error(error);
                        toast.error(
                          "Failed to load students"
                        );
                      }
                    }}
                    className="rounded-xl bg-amber-500 px-4 bg-gradient-to-r
                    from-blue-600
                    to-indigo-600 py-2 text-white"
                  >
                    Start Session
                  </button>

                    <div className="flex gap-2">

  <button
    onClick={() =>
      editLearningPath(path)
    }
    className="rounded-xl bg-amber-500 px-4 py-2 text-white"
  >
    Edit
  </button>

  <button
    onClick={() =>
      deleteLearningPath(
        path.id
      )
    }
    className="rounded-xl bg-red-600 px-4 py-2 text-white"
  >
    Delete
  </button>

</div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
        {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
          className="
            w-full
            max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            rounded-3xl
            bg-white
            p-6
          "
        >

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

       <select
  value={selectedStudent?.paymentId || ""}
  onChange={(e) => {
    const student = students.find(
      (s) => s.paymentId === e.target.value
    );

    setSelectedStudent(student);
  }}
  className="mt-3 w-full rounded-xl border p-3"
>
  <option value="">
    Select Student
  </option>

  {uniqueStudents.map((s) => (
  <option
    key={s.paymentId}
    value={s.paymentId}
  >
    {s.studentName} - {s.studentEmail}
  </option>
))}
</select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <input
            value={sessionTitle}
            onChange={(e) =>
                setSessionTitle(e.target.value)
            }
            placeholder="Session Title"
            className="rounded-xl border p-3"
            />
        <input
  value={trainerName}
  onChange={(e) =>
    setTrainerName(e.target.value)
  }
  placeholder="Trainer Name"
  className="rounded-xl border p-3"
/>

<input
  value={meetingLink}
  onChange={(e) =>
    setMeetingLink(e.target.value)
  }
  placeholder="Meeting Link"
  className="rounded-xl border p-3"
/>

<input
  type="date"
  value={sessionDate}
  onChange={(e) =>
    setSessionDate(e.target.value)
  }
  className="rounded-xl border p-3"
/>

<input
  type="time"
  value={startTime}
  onChange={(e) =>
    setStartTime(e.target.value)
  }
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

<textarea
  rows={4}
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  placeholder="Description"
  className="mt-4 w-full rounded-xl border p-3"
/>
      </div>

      

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
