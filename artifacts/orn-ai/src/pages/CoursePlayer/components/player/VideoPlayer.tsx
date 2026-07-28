import VideoControls from "./VideoControls";
import VideoProgress from "./VideoProgress";
import { useVideoPlayer } from "./useVideoPlayer";

interface VideoPlayerProps {
    videoUrl: string;
    lessonId: string;

    onPreviousLesson?: () => void;
    onNextLesson?: () => void;
    onLessonCompleted?: (lessonId: string) => void;
}

const VideoPlayer = ({
    videoUrl, lessonId, onPreviousLesson, onNextLesson, onLessonCompleted,
}: VideoPlayerProps) => {
    const {
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
    } = useVideoPlayer(lessonId, onLessonCompleted);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full bg-black"
        >
            <div className="aspect-video w-full bg-black">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    onClick={playPause}
                    onDoubleClick={handleVideoDoubleClick}
                    className="w-full h-full object-contain bg-black cursor-pointer"
                    playsInline
                    preload="metadata"
                />
            </div>


            {/* RESUME POPUP */}

            {showResumePrompt && (
                <div
                    className="
                absolute
                top-4
                right-4
                z-30
                bg-white
                rounded-xl
                shadow-xl
                border
                border-gray-200
                p-4
                w-[280px]
            "
                >
                    <h4 className="text-sm font-semibold text-gray-900">
                        Resume Lesson?
                    </h4>

                    <p className="text-xs text-gray-600 mt-1">
                        Continue where you left off.
                    </p>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={resumePlayback}
                            className="
                        flex-1
                        bg-red-600
                        text-white
                        py-2
                        rounded-md
                        text-sm
                    "
                        >
                            Resume
                        </button>

                        <button
                            onClick={startOver}
                            className="
                        flex-1
                        border
                        py-2
                        rounded-md
                        text-sm
                    "
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}


            <div
                className={`
    absolute
    bottom-0
    left-0
    right-0
    bg-gradient-to-t
    from-black/95
    via-black/80
    to-transparent
    transition-opacity
    duration-300
    ${showControls
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }
  `}
            >
                <VideoProgress
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                />

                <VideoControls
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    isMuted={isMuted}
                    isFullscreen={isFullscreen}
                    playbackRate={playbackRate}
                    onPlayPause={playPause}
                    onSkipForward={skipForward}
                    onSkipBackward={skipBackward}
                    onMuteToggle={toggleMute}
                    onFullscreen={toggleFullscreen}
                    onVolumeChange={changeVolume}
                    onPlaybackRateChange={
                        changePlaybackRate
                    }

                    onPreviousLesson={onPreviousLesson}
                    onNextLesson={onNextLesson}
                />
            </div>
        </div>


    );
};

export default VideoPlayer;
