import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { saveLessonPositionStorage } from "../../utils/progressStorage";

const parseDuration = (val: any): number => {
    if (!val) return 0;
    if (typeof val === "number") {
        return val < 100 ? val * 60 : val;
    }
    const str = String(val).trim();
    if (str.includes(":")) {
        const parts = str.split(":");
        if (parts.length === 2) {
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        } else if (parts.length === 3) {
            return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
        }
    }
    const num = parseFloat(str);
    if (!isNaN(num)) {
        return num < 100 ? num * 60 : num;
    }
    return 0;
};

export const useVideoPlayer = (
    lessonId: string,
    onLessonCompleted?: (lessonId: string) => void,
    metadataDuration?: string | number
) => {
    const { user } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(() => parseDuration(metadataDuration));
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
            if (!videoRef.current || !duration || isNaN(duration) || !isFinite(duration)) return;

            const targetTime = (percentage / 100) * duration;
            if (isNaN(targetTime) || !isFinite(targetTime)) return;

            videoRef.current.currentTime = targetTime;
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

    // Double Click Seek

    const handleVideoDoubleClick = (
        e: React.MouseEvent<HTMLVideoElement>
    ) => {
        if (!videoRef.current) return;

        const rect =
            e.currentTarget.getBoundingClientRect();

        const clickX = e.clientX - rect.left;

        if (clickX < rect.width / 2) {
            videoRef.current.currentTime -= 10;
        } else {
            videoRef.current.currentTime += 10;
        }
    };

    // Resume Functions

    const resumePlayback = () => {
        if (
            videoRef.current &&
            resumeTime &&
            !isNaN(resumeTime) &&
            isFinite(resumeTime)
        ) {
            videoRef.current.currentTime =
                resumeTime;
        }

        setShowResumePrompt(false);
    };

    const startOver = () => {
        localStorage.removeItem(
            `lesson-progress-${lessonId}`
        );

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
                clearTimeout(
                    controlsTimeoutRef.current
                );
            }
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;


        const updateTime = () => {
            setCurrentTime(video.currentTime);

            localStorage.setItem(
                `lesson-progress-${lessonId}`,
                String(video.currentTime)
            );

            const effectiveDuration = (video.duration && isFinite(video.duration) && !isNaN(video.duration))
                ? video.duration
                : parseDuration(metadataDuration);

            if (
                effectiveDuration > 0 &&
                video.currentTime >= effectiveDuration - 1
            ) {
                localStorage.removeItem(
                    `lesson-progress-${lessonId}`
                );
                if (onLessonCompleted && lessonId) {
                    onLessonCompleted(lessonId);
                }
            }
        };

        const updateDuration = () => {
            if (video.duration && isFinite(video.duration) && !isNaN(video.duration)) {
                setDuration(video.duration);
            } else {
                const backup = parseDuration(metadataDuration);
                if (backup > 0) {
                    setDuration(backup);
                }
            }
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
        video.addEventListener("durationchange", updateDuration);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("ended", onEnded);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("durationchange", updateDuration);
            video.removeEventListener(
                "loadedmetadata",
                updateDuration
            );
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("ended", onEnded);
        };


    }, [lessonId, onLessonCompleted]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };


        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );


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

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        playPause,
        skipBackward,
        skipForward,
        toggleMute,
        toggleFullscreen,
    ]);

    // Auto Play Next Video

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        setCurrentTime(0);
        const backup = parseDuration(metadataDuration);
        setDuration(backup > 0 ? backup : 0);

        video.play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch(() => {
                setIsPlaying(false);
            });

    }, [lessonId]);

    // Restore Progress
    useEffect(() => {
        const savedTime =
            localStorage.getItem(
                `lesson-progress-${lessonId}`
            );

        if (
            savedTime &&
            Number(savedTime) > 10
        ) {
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