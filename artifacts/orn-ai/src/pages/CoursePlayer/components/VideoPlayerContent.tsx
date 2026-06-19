import {
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Tag,
  FileText,
} from "lucide-react";
import { useState } from "react";

import VideoPlayer from "./player/VideoPlayer";

interface VideoPlayerContentProps {
  course: any;
  lecture: any;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
}

const VideoPlayerContent = ({
  course,
  lecture,
  onPreviousLesson,
  onNextLesson,
}: VideoPlayerContentProps) => {
  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  return (<div className="bg-[#F7F8FA]">
    {/* ORN AI Video Player */}


    <VideoPlayer
      videoUrl={lecture?.videoUrl}
      lessonId={lecture?.id || lecture?.title}
      onPreviousLesson={
        onPreviousLesson
      }
      onNextLesson={
        onNextLesson
      }
    />
    

    {/* Content Below Video */}

    <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
      <div className="w-full space-y-4 sm:space-y-6">

        {/* Lesson Info */}

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-red-600 uppercase tracking-wide">
              Chapter
            </span>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {lecture?.title ||
              "Untitled Lesson"}
          </h1>

          {lecture?.duration && (
            <p className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Duration: {lecture.duration}
            </p>
          )}

          {lecture?.description && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                About this lesson
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {lecture.description}
              </p>
            </div>
          )}
        </div>

      
        {/* Course Information - Using correct data structure */}
        {course && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Course Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Course Name - Using courseName from your data */}
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Course</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {course?.courseName || course?.title || "N/A"}
                  </p>
                </div>
              </div>

              {/* Instructor */}
              {(course?.instructor || course?.author) && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <User size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Instructor</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {course?.instructor || course?.author?.name || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Category */}
              {course?.category && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Tag size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Category</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {course.category}
                    </p>
                  </div>
                </div>
              )}

              {/* Level */}
              {course?.level && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Tag size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Level</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {course.level}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Course Tags */}
        {course?.tags && course.tags.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Course Tags
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {course.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {course?.faqs && course.faqs.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {course.faqs.map((faq: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px] text-gray-500 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px] text-gray-500 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        {course?.author && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Author
            </h2>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User size={20} className="sm:w-[24px] sm:h-[24px] text-gray-500" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {course.author.name || "Instructor"}
                </p>
                {course.author.bio && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                    {course.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default VideoPlayerContent;