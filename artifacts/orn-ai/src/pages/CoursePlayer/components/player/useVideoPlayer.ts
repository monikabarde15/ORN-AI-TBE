import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth"; // ✅ Import added
import { saveLessonPositionStorage } from "../../utils/progressStorage";
export const useVideoPlayer = (
    lessonId: string,
    onLessonCompleted?: (lessonId: string) => void,
    courseId?: string // ✅ Added courseId as parameter
) => {
    const { user } = useAuth(); // ✅ Get current user
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [resumeTime, setResumeTime] = useState<number | null>(null);
    const [showResumePrompt, setShowResumePrompt] = useState(false);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const playPause = useCallback(() => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, []);

    const skipForward = useCallback(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime += 10;
    }, []);

    const skipBackward = useCallback(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime -= 10;
    }, []);

    const seek = useCallback(
        (percentage: number) => {
            if (!videoRef.current || !duration) return;
            videoRef.current.currentTime = (percentage / 100) * duration;
        },
        [duration]
    );

    const changeVolume = useCallback((value: number) => {
        if (!videoRef.current) return;
        setVolume(value);
        videoRef.current.volume = value;

        if (value === 0) {
            setIsMuted(true);
            videoRef.current.muted = true;
        } else {
            setIsMuted(false);
            videoRef.current.muted = false;
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        videoRef.current.muted = nextMuted;
    }, [isMuted]);

    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    }, []);

    const changePlaybackRate = useCallback(
        (rate: number) => {
            if (!videoRef.current) return;
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        },
        []
    );

    const handleMouseMove = () => {
        setShowControls(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        if (isFullscreen) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 2500);
        }
    };

    const handleVideoDoubleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX < rect.width / 2) {
            videoRef.current.currentTime -= 10;
        } else {
            videoRef.current.currentTime += 10;
        }
    };

    const resumePlayback = () => {
        if (videoRef.current && resumeTime) {
            videoRef.current.currentTime = resumeTime;
        }
        setShowResumePrompt(false);
    };

    const startOver = () => {
        localStorage.removeItem(`lesson-progress-${lessonId}`);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
        setShowResumePrompt(false);
    };

    useEffect(() => {
        if (!isFullscreen) {
            setShowControls(true);
        }
    }, [isFullscreen]);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

                const updateTime = () => {
            setCurrentTime(video.currentTime);
            localStorage.setItem(`lesson-progress-${lessonId}`, String(video.currentTime));

            // ✅ SCORE LOGIC: Progress % ko directly score bana do (0 se 100)
            const watchPercent = video.duration ? (video.currentTime / video.duration) : 0;
            const videoScore = Math.min(100, Math.round(watchPercent * 100)); // 4% = 4, 100% = 100
console.log("🎯 [useVideoPlayer] Time:", Math.round(video.currentTime), "sec | Score:", videoScore);
            // ✅ Database mein save karo (Jaise hi video aage badhe, score update hoga)
            if (courseId && lessonId && user?.id) {
                saveLessonPositionStorage(user?.id, courseId, lessonId, video.currentTime, videoScore);
            }

            // ✅ Green Tick logic: Jab video 100% pahunch jaye
            if (video.duration && video.currentTime >= video.duration - 0.5) {
                localStorage.removeItem(`lesson-progress-${lessonId}`);
                if (onLessonCompleted && lessonId) {
                    onLessonCompleted(lessonId);
                }
            }
        };

        const updateDuration = () => {
            setDuration(video.duration || 0);
        };

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => {
            setIsPlaying(false);
            localStorage.removeItem(`lesson-progress-${lessonId}`);
            if (onLessonCompleted && lessonId) {
                onLessonCompleted(lessonId);
            }
        };

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("ended", onEnded);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("ended", onEnded);
        };
    }, [lessonId, onLessonCompleted, courseId, user?.id]); // ✅ Added dependencies

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key.toLowerCase()) {
                case " ":
                    e.preventDefault();
                    playPause();
                    break;
                case "arrowleft":
                    e.preventDefault();
                    skipBackward();
                    break;
                case "arrowright":
                    e.preventDefault();
                    skipForward();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playPause, skipBackward, skipForward, toggleMute, toggleFullscreen]);

    // Auto Play Next Video
    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;

        setCurrentTime(0);
        setDuration(0);

        video.play()
            .then(() => setIsPlaying(true))
            .catch((error) => {
                if (error.name === 'AbortError' || error.message.includes('interrupted')) {
                    console.warn("Video play was interrupted.");
                } else {
                    console.error("Video play error:", error);
                }
                setIsPlaying(false);
            });
    }, [lessonId]);

    // Restore Progress
    useEffect(() => {
        const savedTime = localStorage.getItem(`lesson-progress-${lessonId}`);
        if (savedTime && Number(savedTime) > 10) {
            setResumeTime(Number(savedTime));
            setShowResumePrompt(true);
        }
    }, [lessonId]);

    return {
        videoRef,
        containerRef,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isFullscreen,
        playbackRate,
        progress,
        showControls,
        playPause,
        skipForward,
        skipBackward,
        seek,
        changeVolume,
        toggleMute,
        toggleFullscreen,
        changePlaybackRate,
        handleMouseMove,
        handleVideoDoubleClick,
        showResumePrompt,
        resumeTime,
        resumePlayback,
        startOver,
    };
};