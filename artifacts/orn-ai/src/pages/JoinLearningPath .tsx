import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/layout/Shell";

import {
  BookOpen,
  Award,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

export default function JoinLearningPath() {
  const { learningPathId } = useParams();
  const { user } = useAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!learningPathId || checkingAuth) return;

    if (!user) {
      window.location.replace(
        `/login?redirect=/join/${learningPathId}`
      );
      return;
    }

    loadLearningPath();
  }, [learningPathId, checkingAuth, user]);
const loadLearningPath = async () => {
  try {
    setLoading(true);

    // Learning Path Details
    const res = await api.get(
      `/api/learning-paths/${learningPathId}`
    );

    // Already Joined?
    const status = await api.get(
      `/api/learning-paths/${learningPathId}/join-status`
    );

    if (status.data.alreadyJoined) {
      window.location.replace(
        "/recruiter/learning-student-path-list"
      );
      return;
    }

    setLearningPath(res.data.data ?? res.data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const joinLearningPath = async () => {
  try {
    setJoining(true);

    const res = await api.post(
      `/api/learning-paths/${learningPathId}/join`
    );

    if (res.data.alreadyJoined) {
      window.location.replace(
        "/recruiter/learning-student-path-list"
      );
      return;
    }

    alert("Learning Path Joined Successfully");

    window.location.replace(
      "/recruiter/learning-student-path-list"
    );

  } catch (err) {
    console.error(err);
    alert("Unable to join learning path");
  } finally {
    setJoining(false);
  }
};
  

 

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Learning Path...
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-500">
        Learning Path Not Found
      </div>
    );
  }

  return (
    <Shell>
    <div className="min-h-screen bg-slate-100 py-12 px-4">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Hero Image */}

        <div className="relative">

          <img
            src={
              learningPath.thumbnail ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600"
            }
            alt={learningPath.title}
            className="w-full h-80 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50" />

          <div className="absolute bottom-8 left-8 text-white">

            <span className="bg-green-500 px-4 py-1 rounded-full text-sm font-semibold">
              FREE LEARNING PATH
            </span>

            <h1 className="text-5xl font-bold mt-4">
              {learningPath.title}
            </h1>

            <p className="text-lg mt-3 max-w-2xl text-gray-200">
              {learningPath.description}
            </p>

          </div>

        </div>

        {/* Content */}

        <div className="p-8">

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-blue-50 rounded-xl p-6">

              <BookOpen className="w-8 h-8 text-blue-600 mb-3" />

              <h3 className="font-bold text-lg">
                Courses
              </h3>

              <p className="text-3xl font-bold mt-2">
                {learningPath.courseIds?.length || 0}
              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-6">

              <BadgeCheck className="w-8 h-8 text-green-600 mb-3" />

              <h3 className="font-bold text-lg">
                Price
              </h3>

              <p className="text-3xl font-bold mt-2 text-green-600">
                FREE
              </p>

            </div>

            <div className="bg-purple-50 rounded-xl p-6">

              <Award className="w-8 h-8 text-purple-600 mb-3" />

              <h3 className="font-bold text-lg">
                Certificate
              </h3>

              <p className="text-lg mt-2">
                Completion Certificate Included
              </p>

            </div>

          </div>

          {/* Description */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              About this Learning Path
            </h2>

            <p className="text-gray-600 leading-8 mt-4">
              {learningPath.description}
            </p>

          </div>

          {/* Courses */}

          {learningPath.courseIds?.length > 0 && (

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Included Courses
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {learningPath.courseIds.map(
                  (course: any, index: number) => (

                    <div
                      key={index}
                      className="flex items-center gap-3 border rounded-xl p-4 bg-gray-50"
                    >

                      <BadgeCheck className="text-green-600" />

                      <span>
                        {course.title || `Course ${index + 1}`}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* Join Button */}

          <div className="mt-12">

            <Button
              size="lg"
              className="w-full h-14 text-lg"
              disabled={joining}
              onClick={joinLearningPath}
            >

              {joining
                ? "Joining..."
                : "Join Learning Path"}

              <ArrowRight className="ml-2 w-5 h-5" />

            </Button>

          </div>

        </div>

      </div>

    </div>
    </Shell>
  );
}