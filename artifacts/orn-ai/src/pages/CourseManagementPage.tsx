import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Shell } from "@/components/layout/Shell";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  BookOpen,
  Video,
  FileQuestion,
  Users,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import api from "../../services/api";

// ======================================================
// API
// ======================================================

const getCourses = async () => {
  const res = await api.get("api/courses");
  return res.data;
};

const deleteCourse = async (id: string) => {
  const res = await api.delete(`api/courses/${id}`);
  return res.data;
};

// ======================================================
// PAGE
// ======================================================

export default function CourseManagementPage() {
  const [, navigate] = useLocation();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const {
    data: courses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  // ======================================================
  // FILTER
  // ======================================================

  // const filteredCourses = useMemo(() => {
  //   if (!courses) return [];

  //   return courses.filter((course: any) => {
  //     const matchesSearch =
  //       course.title
  //         ?.toLowerCase()
  //         .includes(search.toLowerCase());

  //     const matchesStatus =
  //       status === "all"
  //         ? true
  //         : course.status === status;

  //     return matchesSearch && matchesStatus;
  //   });
  // }, [courses, search, status]);
const filteredCourses = useMemo(() => {
  const courseList = Array.isArray(courses)
    ? courses
    : courses?.data || courses?.courses || [];

  return courseList.filter((course: any) => {
    const matchesSearch =
      course.title?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "all"
        ? true
        : course.status === status;

    return matchesSearch && matchesStatus;
  });
}, [courses, search, status]);
  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);

      toast.success(
        "Course deleted successfully"
      );

      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <Shell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
              COURSE WORKSPACE
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Course Management
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage all courses, lessons, quizzes,
              videos and student enrollments.
            </p>
          </div>

          <Button
            className="h-11"
            onClick={() =>
              navigate("/recruiter/course/add")
            }
          >
            <Plus className="size-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <StatsCard
            title="Total Courses"
            value={courses?.length || 0}
            icon={BookOpen}
          />

          <StatsCard
            title="Lessons"
            value={
              courses?.reduce(
                (acc: number, item: any) =>
                  acc + item.lessonCount,
                0
              ) || 0
            }
            icon={BookOpen}
          />

          <StatsCard
            title="Quiz"
            value={
              courses?.reduce(
                (acc: number, item: any) =>
                  acc + item.quizCount,
                0
              ) || 0
            }
            icon={FileQuestion}
          />

          <StatsCard
            title="Videos"
            value={
              courses?.reduce(
                (acc: number, item: any) =>
                  acc + item.videoCount,
                0
              ) || 0
            }
            icon={Video}
          />
        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <Card className="mb-6 border shadow-sm">
          <CardContent className="p-4">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

                <Input
                  placeholder="Search course..."
                  className="pl-9"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              {/* STATUS */}

              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All
                  </SelectItem>

                  <SelectItem value="published">
                    Published
                  </SelectItem>

                  <SelectItem value="draft">
                    Draft
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <Card className="overflow-hidden border shadow-sm">

          <div className="px-4 py-3 border-b bg-muted/20">

            <div className="text-sm">
              <span className="font-semibold">
                {filteredCourses?.length}
              </span>

              <span className="text-muted-foreground">
                {" "}courses found
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">

            {isLoading ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <Table>

                {/* ================================================= */}
                {/* TABLE HEAD */}
                {/* ================================================= */}

                <TableHeader>
                  <TableRow>

                    <TableHead>
                      Course
                    </TableHead>

                    {/* <TableHead>
                      Students
                    </TableHead> */}

                    <TableHead>
                      Lessons
                    </TableHead>

                    <TableHead>
                      Quiz
                    </TableHead>

                    <TableHead>
                      Videos
                    </TableHead>

                    {/* <TableHead>
                      Price
                    </TableHead> */}

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="text-right">
                      Actions
                    </TableHead>

                  </TableRow>
                </TableHeader>

                {/* ================================================= */}
                {/* TABLE BODY */}
                {/* ================================================= */}

                <TableBody>

                  {filteredCourses?.map(
                    (course: any) => (
                      <TableRow
                        key={course._id}
                        className="hover:bg-muted/30"
                      >

                        {/* COURSE */}

                        <TableCell>

                          <div className="flex items-center gap-4 min-w-[260px]">

                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-28 h-16 rounded-xl object-cover border"
                            />

                            <div>
                              <h3 className="font-semibold text-sm">
                                {course.title}
                              </h3>

                              {/* <p className="text-xs text-muted-foreground mt-1">
                                Instructor: {course.instructor}
                              </p> */}
                            </div>
                          </div>
                        </TableCell>

                        {/* STUDENTS */}

                        {/* <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            <Users className="size-4 text-muted-foreground" />

                            {course.studentsCount}
                          </div>
                        </TableCell> */}

                        {/* LESSONS */}

                        <TableCell>
                          <Badge variant="secondary">
                            {course.lessonCount}
                          </Badge>
                        </TableCell>

                        {/* QUIZ */}

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {course.quizCount}
                          </Badge>
                        </TableCell>

                        {/* VIDEOS */}

                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                            {course.videoCount}
                          </Badge>
                        </TableCell>

                        {/* PRICE */}

                        {/* <TableCell>
                          <span className="font-bold">
                            ${course.price}
                          </span>
                        </TableCell> */}

                        {/* STATUS */}

                        <TableCell>

                          <Badge
                            className={`capitalize px-3 py-1 rounded-full text-xs font-semibold border ${
                              course.status?.toLowerCase() ===
                              "published"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {course.status}
                          </Badge>

                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell>

                          <div className="flex items-center justify-end gap-2">

                            {/* PREVIEW */}

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/course/details/${course._id}`
                                )
                              }
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>

                            {/* EDIT */}

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/recruiter/course/edit/${course._id}`
                                )
                              }
                            >
                              <Pencil className="w-4 h-4 text-green-600" />
                            </Button>

                            {/* DELETE */}

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleDelete(course._id)
                              }
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>

                          </div>

                        </TableCell>
                      </TableRow>
                    )
                  )}

                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

// ======================================================
// STATS CARD
// ======================================================

function StatsCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <Card className="border shadow-sm">

      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-muted-foreground uppercase">
              {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {value}
            </h2>

          </div>

          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}

