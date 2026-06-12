import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";

import LearningPathForm from "./learning-path/LearningPathForm";
import UploadMedia from "./learning-path/UploadMedia";
import CourseSearch from "./learning-path/CourseSearch";
import CourseGrid from "./learning-path/CourseGrid";
import SelectedCourses from "./learning-path/SelectedCourses";
import PaymentSummary from "./learning-path/PaymentSummary";
import PaymentLinkBox from "./learning-path/PaymentLinkBox";

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: string;
  lessonCount?: number;
  quizCount?: number;
  videoCount?: number;
}

export default function LearningPath() {
const [courseModalOpen, setCourseModalOpen] =
  useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
const [learningPathId, setLearningPathId] =
  useState("");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  const [introVideo, setIntroVideo] =
    useState<File | null>(null);

  const [paymentLink, setPaymentLink] =
    useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const res =
        await api.get("/api/courses");

      setCourses(
        res?.data?.courses ||
        res?.data?.data ||
        res?.data ||
        []
      );
    } catch {
      toast.error(
        "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses =
    useMemo(() => {
      return courses.filter((course) =>
        course.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }, [courses, search]);

  const toggleCourse = (
    course: Course
  ) => {
    setSelectedCourses((prev) =>
      prev.some(
        (c) => c._id === course._id
      )
        ? prev.filter(
            (c) =>
              c._id !== course._id
          )
        : [...prev, course]
    );
  };

  const removeCourse = (
    id: string
  ) => {
    setSelectedCourses((prev) =>
      prev.filter(
        (c) => c._id !== id
      )
    );
  };

  const subtotal =
    selectedCourses.reduce(
      (sum, course) =>
        sum +
        Number(course.price || 0),
      0
    );

  const gst = Number(
    (subtotal * 0.18).toFixed(2)
  );

  const total = Number(
    (subtotal + gst).toFixed(2)
  );

  const generatePaymentLink =
  async () => {
    try {
      if (!learningPathId) {
        toast.error(
          "Create Learning Path First"
        );
        return;
      }

      const res =
        await api.post(
          "/api/payment/generate-link",
          {
            learningPathId,
            courseIds:
              selectedCourses.map(
                (c) => c._id
              ),
            amount: total,
          }
        );

      // Frontend Payment Page URL
      const paymentPageUrl =
        `${window.location.origin}/payment/${res.data.paymentId}`;

      setPaymentLink(
        paymentPageUrl
      );

      // Save URL in Learning Path
      await api.put(
        `/api/learning-paths/${learningPathId}`,
        {
          paymentLink:
            paymentPageUrl,
        }
      );

      toast.success(
        "Payment Link Generated"
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to generate payment link"
      );
    }
  };
const createLearningPath = async () => {
  try {
    if (!title) {
      toast.error("Enter title");
      return;
    }

    if (!description) {
      toast.error("Enter description");
      return;
    }

    if (selectedCourses.length === 0) {
      toast.error("Select courses");
      return;
    }

    setSaving(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (thumbnail) {
      formData.append(
        "thumbnail",
        thumbnail
      );
    }

    if (introVideo) {
      formData.append(
        "introVideo",
        introVideo
      );
    }

    formData.append(
      "courseIds",
      JSON.stringify(
        selectedCourses.map(
          (c) => c._id
        )
      )
    );

    const res =
      await api.post(
        "/api/learning-paths",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    setLearningPathId(
      res.data.data.id
    );

    toast.success(
      "Learning Path Created"
    );

  } catch (error) {
    console.log(error);

    toast.error(
      "Failed to create learning path"
    );
  } finally {
    setSaving(false);
  }
};
  return (
    <Shell>
      
     <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">

  {/* Left */}
  <div className="space-y-8">
   <LearningPathForm
  title={title}
  description={description}
  setTitle={setTitle}
  setDescription={setDescription}
/>
   <UploadMedia
  setThumbnail={setThumbnail}
  setVideo={setIntroVideo}
/>
<button
  onClick={() =>
    setCourseModalOpen(true)
  }
  className="
    flex
    w-full
    items-center
    justify-center
    rounded-[24px]
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    py-4
    text-lg
    font-semibold
    text-white
    shadow-lg
  "
>
  Manage Courses
  ({selectedCourses.length})
</button>

  
  </div>

  {/* Right */}
  <div className="sticky top-6 space-y-6">
    <SelectedCourses
  courses={selectedCourses}
  removeCourse={removeCourse}
/>
   <PaymentSummary
  subtotal={subtotal}
  gst={gst}
  total={total}
  paymentLink={paymentLink}
  generatePaymentLink={generatePaymentLink}
/>

    <button
      onClick={createLearningPath}
      className="
        w-full
        rounded-[24px]
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        py-4
        text-lg
        font-semibold
        text-white
        shadow-lg
      "
    >
      Create Learning Path
    </button>
  </div>

</div>
{courseModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/40">

    <div className="mx-auto mt-10 h-[85vh] w-[90%] max-w-6xl rounded-3xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">

        <div>
          <h2 className="text-2xl font-bold">
            Manage Courses
          </h2>

          <p className="text-sm text-slate-500">
            Select courses for this learning path
          </p>
        </div>

        <button
          onClick={() =>
            setCourseModalOpen(false)
          }
          className="rounded-xl p-2 hover:bg-slate-100"
        >
          ✕
        </button>

      </div>

      {/* Search */}
      <div className="p-6">

        <div className="relative">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search courses..."
            className="w-full rounded-2xl border p-4"
          />

        </div>

      </div>

      {/* Grid */}
      <div className="h-[calc(85vh-170px)] overflow-auto px-6 pb-6">

        <CourseGrid
          courses={filteredCourses}
          selectedCourses={selectedCourses}
          toggleCourse={toggleCourse}
          loading={loading}
        />

      </div>

    </div>

  </div>
)}

    </Shell>
  );
}

