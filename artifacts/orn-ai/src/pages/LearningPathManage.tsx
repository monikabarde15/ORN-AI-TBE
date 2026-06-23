// artifacts\orn-ai\src\pages\LearningPathManage.tsx
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import api from "../../services/api";
import { useRoute } from "wouter";
import { toast } from "sonner";
import CourseSearch from "./learning-path/CourseSearch";
import CourseGrid from "./learning-path/CourseGrid";
import TabNavigation from "./learning-path-manage/TabNavigation";
import CoursesTab from "./learning-path-manage/CoursesTab";
import SessionsTab from "./learning-path-manage/SessionsTab";
import SessionForm from "./learning-path-manage/SessionForm";
import LearningPathSidebar from "./learning-path-manage/LearningPathSidebar";
import { useAuth } from "@/hooks/use-auth";


export default function LearningPathManage() {
       const { user } = useAuth();
    
      const [permissions, setPermissions] = useState([]);
    
    useEffect(() => {
      if (!user?.id) return;
    
      api
        .get(`/api/user-permissions/${user.id}`)
        .then((res) => {
          setPermissions(res.data.permissions || []);
        });
    }, [user?.id]);
    
    const hasPermission = (
      moduleName: string,
      action = "canView"
    ) => {
      if (user?.role === "admin") return true;
    
      return permissions.some(
        (p: any) =>
          p.moduleName === moduleName &&
          p[action]
      );
    };
    
      
      console.log(user);
    const [activeTab, setActiveTab] = useState("courses");
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [learningPathId, setLearningPathId] = useState("");
    const [paymentLink, setPaymentLink] = useState("");
    const [match, params] = useRoute("/recruiter/learning-path-manage/:id");

    const [saving, setSaving] = useState(false);
    const [sessionTitle, setSessionTitle] = useState("");
    const [trainerName, setTrainerName] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [sessionDescription, setSessionDescription,] = useState("");
    const [creating, setCreating] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [sessions, setSessions] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [introVideo, setIntroVideo] = useState<File | null>(null);

    const [showCourseManager, setShowCourseManager] =useState(false);
    const [showSessionForm, setShowSessionForm] =useState(false);


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

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses =
        useMemo(() => {
            return courses.filter(
                (course: any) =>
                    course.title
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
        }, [courses, search]);


    const toggleCourse = (
        course: any
    ) => {
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

    // Remove course
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

    // Total
    const subtotal =
        selectedCourses.reduce(
            (sum, course: any) =>
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

    // Load Existing Learning Path
    const loadLearningPath = async (id: string) => {
        const res = await api.get(
            `/api/learning-paths/${id}`
        );

        const path = res.data.data;

        setLearningPathId(path.id);
        setEditingId(path.id);
        setPaymentLink(path.paymentLink || "");
        setTitle(path.title || "");
        setDescription(path.description || "");

        setSelectedCourses(
            (path.courses || []).map(
                (c: any) => ({
                    ...c,
                    id: c.id || c._id,
                })
            )
        );
    };


    // Generate Payment Link
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
                                    (c: any) =>
                                        c.id || c._id
                                ),
                            amount: total,
                        }
                    );


                // Frontend Payment Page URL
                const paymentPageUrl = `${window.location.origin}/payment/${res.data.paymentId}`;

                setPaymentLink(
                    paymentPageUrl
                );

                // Save URL in Learning Path
                await api.put(
                    `/api/learning-paths/${learningPathId}`,
                    {
                        paymentLink:
                            paymentPageUrl,

                        courseIds:
                            selectedCourses.map(
                                (c: any) =>
                                    c.id || c._id
                            ),
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

    const loadSessions = async () => {
        const res = await api.get(
            "/api/live-sessions"
        );

        setSessions(res.data.data || []);
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

    const loadStudents = async () => {
        try {
            if (
                selectedCourses.length === 0
            )
                return;

            const res = await api.post(
                "/api/learning-path-students",
                {
                    courseIds:
                        selectedCourses.map(
                            (c: any) =>
                                c.id || c._id
                        ),
                }
            );

            setStudents(
                res.data.data || []
            );

            if (
                res.data.data?.length > 0
            ) {
                setSelectedStudent(
                    res.data.data[0]
                );
            }

        } catch (error) {
            console.error(error);
        }
    };

    // Save Learning Path

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

    // Load Students for This Learning Path
    useEffect(() => {
        loadStudents();
    }, [selectedCourses]);

    // Load on Page Open
    useEffect(() => {
        if (params?.id) {
            loadLearningPath(
                params.id
            );
        }
    }, [params?.id]);

    useEffect(() => {
        loadCourses();
    }, []);


    useEffect(() => {
        loadSessions();
    }, []);

    // Session Creation Logic
    const createLiveSession =
        async () => {
            try {

                if (!selectedStudent) {
                    toast.error(
                        "Please select a student"
                    );
                    return;
                }

                setCreating(true);

                await api.post(
                    "/api/live-sessions",
                    {
                        courseId:
                            selectedCourses?.[0]?.id ||
                            selectedCourses?.[0]?._id,

                        paymentId:
                            selectedStudent?.paymentId,

                        studentName:
                            selectedStudent?.studentName,

                        studentEmail:
                            selectedStudent?.studentEmail,

                        studentPhone:
                            selectedStudent?.studentPhone,

                        sessionTitle,
                        trainerName,
                        meetingLink,
                        sessionDate,
                        startTime,
                        endTime,
                        description: sessionDescription,
                    }
                );

                await loadSessions();

                toast.success(
                    "Session Created"
                );

            } catch (error) {
                console.error(error);

                toast.error(
                    "Failed to create session"
                );

            } finally {
                setCreating(false);
            }
        };

    return (
        <Shell>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Learning Path Management
                    </h1>

                    <p className="text-slate-500">
                        Manage courses and live sessions
                    </p>
                </div>

                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    showCourseManager={
                        showCourseManager
                    }
                    setShowCourseManager={
                        setShowCourseManager
                    }
                    showSessionForm={
                        showSessionForm
                    }
                    setShowSessionForm={
                        setShowSessionForm
                    }
                />


                <div
                    className={
                        activeTab === "courses" &&
                            showCourseManager
                            ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
                            : "grid gap-8"
                    }
                >

                    {/* Middle */}
                    <div className="w-full">

                        {/* Courses */}
                        {activeTab === "courses" && (
                            <>
                                {!showCourseManager ? (
                                    <CoursesTab
                                        selectedCourses={
                                            selectedCourses
                                        }
                                        setShowCourseManager={
                                            setShowCourseManager
                                        }
                                    />
                                ) : (
                                    <div className="space-y-6">


                                        <CourseSearch
                                            search={search}
                                            setSearch={setSearch}
                                        />

                                        <CourseGrid
                                            courses={
                                                filteredCourses
                                            }
                                            selectedCourses={
                                                selectedCourses
                                            }
                                            toggleCourse={
                                                toggleCourse
                                            }
                                            loading={loading}
                                        />

                                    </div>
                                )}
                            </>
                        )}

                        {/* Sessions */}

                        {activeTab === "sessions" && (
                            <>
                                {!showSessionForm ? (
                                    <SessionsTab
                                        sessions={sessions}
                                        setShowSessionForm={
                                            setShowSessionForm
                                        }
                                        hasPermission={hasPermission}
                                    />
                                ) : (
                                    <SessionForm
                                        students={students}
                                        uniqueStudents={
                                            uniqueStudents
                                        }
                                        selectedStudent={
                                            selectedStudent
                                        }
                                        setSelectedStudent={
                                            setSelectedStudent
                                        }
                                        sessionTitle={
                                            sessionTitle
                                        }
                                        setSessionTitle={
                                            setSessionTitle
                                        }
                                        trainerName={
                                            trainerName
                                        }
                                        setTrainerName={
                                            setTrainerName
                                        }
                                        meetingLink={
                                            meetingLink
                                        }
                                        setMeetingLink={
                                            setMeetingLink
                                        }
                                        sessionDate={
                                            sessionDate
                                        }
                                        setSessionDate={
                                            setSessionDate
                                        }
                                        startTime={
                                            startTime
                                        }
                                        setStartTime={
                                            setStartTime
                                        }
                                        endTime={endTime}
                                        setEndTime={
                                            setEndTime
                                        }
                                        sessionDescription={
                                            sessionDescription
                                        }
                                        setSessionDescription={
                                            setSessionDescription
                                        }
                                        creating={creating}
                                        createLiveSession={
                                            createLiveSession
                                        }
                                        setShowSessionForm={
                                            setShowSessionForm
                                        }
                                    />
                                )}
                            </>
                        )}

                    </div>

                    {/* Right */}
                    {activeTab === "courses" &&
                        showCourseManager && (
                            <LearningPathSidebar
                                selectedCourses={selectedCourses}
                                removeCourse={removeCourse}
                                saving={saving}
                                saveLearningPath={saveLearningPath}
                                editingId={editingId}
                                subtotal={subtotal}
                                gst={gst}
                                total={total}
                                paymentLink={paymentLink}
                                generatePaymentLink={generatePaymentLink}
                            />
                        )}

                </div>

            </div>
        </Shell>
    );
}