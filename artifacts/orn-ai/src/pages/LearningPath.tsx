// artifacts\orn-ai\src\pages\LearningPath.tsx
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
  const [thumbnailPreview,
    setThumbnailPreview] =
    useState("");

  const [videoPreview,
    setVideoPreview] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoName, setVideoName] =
    useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [learningPathId, setLearningPathId] =
    useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [introVideo, setIntroVideo] = useState<File | null>(null);
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const res =
        await api.get("/api/courses");

      const courseData =
        res?.data?.courses ||
        res?.data?.data ||
        res?.data ||
        [];

      setCourses(
        courseData.map((c: any) => ({
          ...c,
          id: c.id || c._id,
        }))
      );
    } catch {
      toast.error(
        "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);
  };
  const loadLearningPath = async (
    id: string
  ) => {
    const res = await api.get(
      `/api/learning-paths/${id}`
    );

    const path = res.data.data;

    setEditingId(path.id);
    setLearningPathId(path.id);

    setTitle(path.title || "");
    setDescription(path.description || "");
    setThumbnailPreview(
      path.thumbnail || ""
    );

    setVideoPreview(
      path.introVideo || ""
    );

    setSelectedCourses(
      (path.courses || []).map(
        (c: any) => ({
          ...c,
          id: c.id || c._id,
        })
      )
    );
  };
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const id =
      params.get("edit");

    if (id) {
      loadLearningPath(id);
    }

    loadCourses();
  }, []);
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

  const toggleCourse = (course: any) => {
    const courseId =
      course.id || course._id;

    setSelectedCourses((prev) => {
      const exists = prev.some(
        (c: any) =>
          (c.id || c._id) === courseId
      );

      if (exists) {
        return prev.filter(
          (c: any) =>
            (c.id || c._id) !== courseId
        );
      }

      return [
        ...prev,
        {
          ...course,
          id: courseId,
        },
      ];
    });
  };
  const removeCourse = (
    id: string
  ) => {
    setSelectedCourses((prev) =>
      prev.filter(
        (c: any) =>
          (c.id || c._id) !== id
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

  const generatePaymentLink = async () => {
    try {
      if (!learningPathId) {
        toast.error("Create Learning Path First");
        return;
      }

      // Free Learning Path
      if (total <= 0) {
        const directUrl = `${window.location.origin}/register`;

        setPaymentLink(directUrl);

        await api.put(
          `/api/learning-paths/${learningPathId}`,
          {
            paymentLink: directUrl,
            courseIds: selectedCourses.map(
              (c: any) => c.id || c._id
            ),
          }
        );

        toast.success("Direct Link Generated");
        return;
      }

      // Paid Learning Path
      const res = await api.post(
        "/api/payment/generate-link",
        {
          learningPathId,
          courseIds: selectedCourses.map(
            (c: any) => c.id || c._id
          ),
          amount: total,
          callback_url:
            `${window.location.origin}/payment-success`,
        }
      );

      const paymentPageUrl =
        `${window.location.origin}/payment/${res.data.paymentId}`;

      setPaymentLink(paymentPageUrl);

      await api.put(
        `/api/learning-paths/${learningPathId}`,
        {
          paymentLink: paymentPageUrl,
          courseIds: selectedCourses.map(
            (c: any) => c.id || c._id
          ),
        }
      );

      toast.success("Payment Link Generated");
    } catch (error: any) {
      console.error(
        "GENERATE PAYMENT LINK ERROR =>",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.error ||
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
            (c: any) =>
              c.id || c._id
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
  const saveLearningPath = async () => {
    try {

      if (!title.trim()) {
        toast.error("Enter title");
        return;
      }

      if (!description.trim()) {
        toast.error("Enter description");
        return;
      }

      if (selectedCourses.length === 0) {
        toast.error("Select at least one course");
        return;
      }
      console.log(
        "SELECTED COURSES =>",
        selectedCourses
      );

      console.log(
        "COURSE IDS =>",
        selectedCourses.map(
          (c: any) => c.id
        )
      );
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 50)
      );
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

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

      if (paymentLink) {
        formData.append(
          "paymentLink",
          paymentLink
        );
      }

      const courseIds = selectedCourses
        .map((c: any) => c.id || c._id)
        .filter(Boolean);
      console.log(
        "Selected Courses =>",
        selectedCourses
      );

      console.log(
        "Course IDs =>",
        courseIds
      );

      formData.append(
        "courseIds",
        JSON.stringify(courseIds)
      );

      let res;

      if (editingId) {
        res = await api.put(
          `/api/learning-paths/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Learning Path Updated Successfully"
        );
      } else {
        res = await api.post(
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
          "Learning Path Created Successfully"
        );
      }

      console.log(
        "API Response =>",
        res.data
      );

    } catch (error: any) {

      console.error(
        "SAVE ERROR =>",
        error
      );

      console.error(
        "BACKEND RESPONSE =>",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save learning path"
      );

    } finally {
      setSaving(false);
    }
  };
  const editLearningPath = (
    path: any
  ) => {
    setEditingId(path.id);
    setLearningPathId(path.id);

    setTitle(path.title || "");

    setDescription(
      path.description || ""
    );

    setPaymentLink(
      path.paymentLink || ""
    );

    setSelectedCourses(
      (path.courses || []).map(
        (c: any) => ({
          ...c,
          id: c.id || c._id,
        })
      )
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Shell>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_460px]">

        {/* Left */}
          <div className="space-y-10 px-8">
          <LearningPathForm
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
          />
          <UploadMedia
            setThumbnail={setThumbnail}
            setVideo={setIntroVideo}
            thumbnailPreview={thumbnailPreview}
            videoPreview={videoPreview}
            setThumbnailPreview={setThumbnailPreview}
            setVideoPreview={setVideoPreview}
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
rounded-xl
border
border-slate-200
bg-blue-900
py-4
text-base
font-medium
text-white
transition
hover:bg-blue-800
"
          >
            Add Courses
            ({selectedCourses.length})
          </button>


        </div>

        {/* Right */}
        <div className="sticky top-6 space-y-6 pt-8 pr-4 ">
          <SelectedCourses
            courses={selectedCourses}
            removeCourse={removeCourse}
          />
          <button
            onClick={saveLearningPath}
            disabled={saving}
            className="
    w-full
    rounded-xl
    bg-blue-900
    py-3.5
    text-base
    font-semibold
    text-white
    disabled:opacity-70
    disabled:cursor-not-allowed
    flex
    items-center
    justify-center
    gap-3
    transition
  hover:bg-blue-800
  "
          >
            {saving ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>

                Saving...
              </>
            ) : editingId ? (
              "Update Learning Path"
            ) : (
              "Create Learning Path"
            )}
          </button>
          <PaymentSummary
            subtotal={subtotal}
            gst={gst}
            total={total}
            paymentLink={paymentLink}
            generatePaymentLink={generatePaymentLink}
          />



        </div>

      </div>
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">

          <div className="mx-auto mt-10 h-[85vh] w-[90%] max-w-6xl rounded-3xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>
                <h2 className="text-2xl font-bold">
                  Add Courses
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

