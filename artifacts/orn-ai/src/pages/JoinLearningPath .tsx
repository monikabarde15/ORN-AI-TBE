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
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
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
      {/* 🟢 FIX 1: Padding hata diya (py-0) aur width ko full-width kar diya */}
      <div className="w-full bg-slate-50 pb-16">

        {/* 🟢 FIX 2: Container width ko control kiya aur shadow ko clean kiya */}
        <div className="max-w-6xl mx-auto bg-white shadow-lg overflow-hidden border border-gray-100">

          {/* 🟢 FIX 3: Image Container ka height badhaya (h-[450px]) aur text ko better position kiya */}
          <div className="relative w-full h-[450px] bg-gray-900">

            <img
              src={
                learningPath.thumbnail ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600"
              }
              alt={learningPath.title}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Better Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            <div className="absolute bottom-10 left-10 right-10 text-white z-10">
              <span className="bg-green-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold inline-block shadow-sm mb-3">
                FREE LEARNING PATH
              </span>

              <h1 className="text-4xl md:text-5xl font-bold mt-2 leading-tight max-w-3xl">
                {learningPath.title}
              </h1>

              <p className="text-lg mt-3 max-w-2xl text-gray-200 line-clamp-2">
                {learningPath.description}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">

            {/* 🟢 FIX 4: Cards ko Center align kar diya aur shadow/rounded badha diya */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-lg text-gray-800">Courses</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">
                  {learningPath.courseIds?.length || 0}
                </p>
              </div>

              <div className="bg-green-50/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                <BadgeCheck className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-bold text-lg text-gray-800">Price</h3>
                <p className="text-3xl font-bold mt-2 text-green-600 uppercase">
                  Free
                </p>
              </div>

              <div className="bg-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                <Award className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-bold text-lg text-gray-800">Certificate</h3>
                <p className="text-base mt-2 text-purple-700 font-medium">
                  Completion Certificate Included
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 max-w-4xl mx-auto border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-bold text-gray-800">
                About this Learning Path
              </h2>
              <p className="text-gray-600 leading-relaxed mt-4 text-lg">
                {learningPath.description}
              </p>
            </div>

            {/* Courses */}
            {learningPath.courseIds?.length > 0 && (
              <div className="mt-10 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Included Courses
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {learningPath.courseIds.map(
                    (course: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="bg-green-100 p-1.5 rounded-full">
                          <BadgeCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {course.title || `Course ${index + 1}`}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Join Button - Clean and Wide */}
            <div className="mt-12 max-w-4xl mx-auto">
              <Button
                size="lg"
                className="w-full h-14 text-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white transition-all"
                disabled={joining}
                onClick={joinLearningPath}
              >
                {joining ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Join Learning Path
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </Shell>
  );
}