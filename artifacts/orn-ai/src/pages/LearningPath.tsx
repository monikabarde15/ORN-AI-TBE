
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
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: string;
  status?: string;
  lessonCount?: number;
  quizCount?: number;
  videoCount?: number;
}

export default function LearningPath() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [paymentLink, setPaymentLink] = useState("");
const coursesPerPage = 6;
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/courses");
        setCourses(res?.data?.courses || res?.data?.data || res?.data || []);
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

  const createLearningPath = async () => {
    try {
      setSaving(true);
      await api.post("/learning-path/create", {
        courseIds: selectedCourses.map(c => c._id),
      });
      toast.success("Learning Path Created");
    } catch {
      toast.error("Failed to create learning path");
    } finally {
      setSaving(false);
    }
  };

  const generatePaymentLink = async () => {
  try {
    const res = await api.post(
      "/api/payment/generate-link",
      {
        courseIds: selectedCourses.map(
          (c) => c._id
        ),
        amount: grandTotal,
      }
    );

    setPaymentLink(
      res.data.paymentLink
    );

    await navigator.clipboard.writeText(
      res.data.paymentLink
    );

    toast.success(
      "Payment link copied"
    );
  } catch {
    toast.error(
      "Failed to generate link"
    );
  }
};
const copyPaymentLink = async () => {
  try {
    await navigator.clipboard.writeText(paymentLink);
    toast.success("Payment Link Copied");
  } catch {
    toast.error("Failed to copy link");
  }
};

  return (
    <Shell>
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
            <h1 className="text-4xl font-bold">Learning Path</h1>
            <p className="mt-2 text-slate-500">Create personalized learning journeys and payment bundles</p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Courses</p>
                    <h3 className="text-3xl font-bold">{courses.length}</h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Selected</p>
                    <h3 className="text-3xl font-bold text-blue-600">
                    {selectedCourses.length}
                    </h3>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Amount</p>
                    <h3 className="text-3xl font-bold text-green-600">
                    ₹{grandTotal}
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
                        onClick={() => toggleCourse(course)}
                        className={
                            isSelected(course._id)
                            ? "flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-600"
                            : "flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                        }
                        >
                        {isSelected(course._id) ? (
                            <>
                            <CheckCircle2 size={16} />
                            Added
                            </>
                        ) : (
                            <>
                            <PlusCircle size={16} />
                            Add
                            </>
                        )}
                        </button>
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

          <div className="sticky top-6 h-fit rounded-3xl bg-white shadow-sm">
            <div className="border-b p-5 flex justify-between">
              <h2 className="font-bold">Cart</h2>
              <ShoppingCart className="h-14 w-14 text-slate-300" />
            </div>

            <div className="max-h-96 overflow-auto p-4 space-y-3">
              {selectedCourses.map(course => (
                <div key={course._id} className="flex gap-3 rounded-xl border p-2">
                 <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-16 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                  <div className="flex-1">
                    <div className="line-clamp-1 text-sm font-semibold">{course.title}</div>
                    <div className="text-green-600">₹{Number(course.price || 0)}</div>
                  </div>
                  <button onClick={() => removeCourse(course._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-5">
              <div className="flex justify-between"><span>Courses</span><span>{selectedCourses.length}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>GST</span><span>₹{gst}</span></div>
              <div className="mt-3 flex justify-between font-bold"><span>Total</span><span>₹{grandTotal}</span></div>

              <button onClick={generatePaymentLink} className="mt-4 w-full rounded-xl bg-green-600 py-3 text-white">
                <CreditCard className="mr-2 inline h-4 w-4" /> Proceed To Payment
              </button>

              {/* <button onClick={createLearningPath} disabled={saving} className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-white">
                {saving ? "Creating..." : "Create Learning Path"}
              </button> */}
            </div>
            {paymentLink && (
                <div className="mt-4 rounded-xl border p-3">
                    <p className="mb-2 text-xs">
                    Payment Link
                    </p>

                    <input
                    value={paymentLink}
                    readOnly
                    className="w-full rounded-lg border p-2"
                    />

                    <button
                    onClick={() =>
                        navigator.clipboard.writeText(
                        paymentLink
                        )
                    }
                    className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-white"
                    >
                    Copy Link
                    </button>

                    <button
                    onClick={() =>
                        window.open(
                        paymentLink,
                        "_blank"
                        )
                    }
                    className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-white"
                    >
                    Open Link
                    </button>
                </div>
                )}
          </div>
        </div>
      </div>
    </div>
    </Shell>
  );
}
