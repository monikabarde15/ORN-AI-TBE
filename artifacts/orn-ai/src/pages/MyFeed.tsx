import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  Eye,
  Loader2,
  BookOpen,
  PlayCircle,
  FileQuestion,
} from "lucide-react";

import api from "../../services/api";

const getCourses = async () => {
  const res = await api.get("api/courses");
  return res.data;
};

export default function MyFeed() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  const {
    data: courses = [],
    isLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const filteredCourses = useMemo(() => {
    return courses.filter((course: any) =>
      course?.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [courses, search]);

  return (
    <Shell>
      <div className="min-h-screen bg-background">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

          {/* Header */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Explore Courses
            </h1>

            <p className="text-muted-foreground mt-2">
              Learn new skills and advance your career.
            </p>
          </div>

          {/* Search */}

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="pl-10 h-11"
                />

              </div>
            </CardContent>
          </Card>

          {/* Loading */}

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {/* Course Grid */}

          {!isLoading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredCourses.map((course: any) => (
                  <Card
                    key={course._id}
                    className="group overflow-hidden rounded-2xl border hover:shadow-xl transition-all duration-300"
                  >

                    {/* Thumbnail */}

                    <div
                      className="overflow-hidden cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/course/details/${course._id}`
                        )
                      }
                    >
                      <img
                        src={
                          course.thumbnail ||
                          "https://placehold.co/800x450"
                        }
                        alt={course.title}
                        className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <CardContent className="p-5">

                      {/* Title */}

                      <h3 className="font-bold text-lg line-clamp-2 min-h-[56px]">
                        {course.title}
                      </h3>

                      {/* Description */}

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3 min-h-[60px]">
                        {course.description ||
                          "Start learning with this course."}
                      </p>

                      {/* Stats */}

                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">

                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessonCount || 0}
                        </div>

                        <div className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4" />
                          {course.videoCount || 0}
                        </div>

                        <div className="flex items-center gap-1">
                          <FileQuestion className="h-4 w-4" />
                          {course.quizCount || 0}
                        </div>

                      </div>

                      {/* CTA */}

                      <Button
                        className="w-full mt-5"
                        onClick={() =>
                          navigate(
                            `/course/details/${course._id}`
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Course
                      </Button>

                    </CardContent>
                  </Card>
                ))}

              </div>

              {filteredCourses.length === 0 && (
                <Card className="mt-6">
                  <CardContent className="py-20 text-center">

                    <h3 className="text-xl font-semibold">
                      No Courses Found
                    </h3>

                    <p className="text-muted-foreground mt-2">
                      Try another search keyword.
                    </p>

                  </CardContent>
                </Card>
              )}
            </>
          )}

        </div>
      </div>
    </Shell>
  );
}