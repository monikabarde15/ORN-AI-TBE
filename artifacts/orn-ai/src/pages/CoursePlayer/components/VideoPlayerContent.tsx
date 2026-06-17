import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Tag,
  FileText,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface VideoPlayerContentProps {
  course: any;
  lecture: any;
}

const VideoPlayerContent = ({ course, lecture }: VideoPlayerContentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    try {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = x * videoRef.current.duration;
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        handlePlayPause();
      }
      if (e.key === "f") handleFullscreen();
      if (e.key === "m") toggleMute();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, handleFullscreen, toggleMute]);

  return (
    <div ref={containerRef} className="bg-[#F7F8FA]">
      {/* Video Player */}
      <div 
        className="w-full bg-black relative overflow-hidden"
        style={{ 
          height: windowWidth < 640 ? "calc(100vh - 180px)" : 
                  windowWidth < 1024 ? "calc(100vh - 150px)" : 
                  "calc(100vh - 120px)"
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      >
        <video
          ref={videoRef}
          src={lecture?.videoUrl}
          className="w-full h-full object-cover"
          onClick={handlePlayPause}
          playsInline
          preload="metadata"
        />

        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <PlayCircle size={windowWidth < 640 ? 40 : 56} className="text-white drop-shadow-lg" />
            </div>
          </button>
        )}

        {/* Video Controls */}
        <div 
          className={`
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t from-black/90 via-black/40 to-transparent
            p-2 sm:p-3 md:p-4
            transition-opacity duration-300
            ${showControls ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className="w-full h-1 sm:h-1.5 bg-gray-600/60 rounded-full cursor-pointer mb-2 sm:mb-3 group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button 
                onClick={handlePlayPause} 
                className="text-white hover:text-red-500 transition-colors p-1"
              >
                {isPlaying ? 
                  <PauseCircle size={windowWidth < 640 ? 20 : 28} /> : 
                  <PlayCircle size={windowWidth < 640 ? 20 : 28} />
                }
              </button>

              <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="hidden sm:flex items-center gap-1 md:gap-2">
                <button 
                  onClick={toggleMute} 
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {isMuted ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 md:w-20 accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={handleFullscreen} 
              className="text-white hover:text-red-500 transition-colors p-1"
            >
              {isFullscreen ? 
                <Minimize2 size={windowWidth < 640 ? 16 : 22} /> : 
                <Maximize2 size={windowWidth < 640 ? 16 : 22} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Content Below Video */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
        <div className="w-full space-y-4 sm:space-y-6">
          
          {/* Lesson Info - Using correct data structure */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-red-600 uppercase tracking-wide">
                Lesson
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              {lecture?.title || "Untitled Lesson"}
            </h1>
            {lecture?.duration && (
              <p className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                <Clock size={14} className="sm:w-4 sm:h-4" />
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