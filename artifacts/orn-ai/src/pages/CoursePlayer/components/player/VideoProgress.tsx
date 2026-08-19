import { VideoProgressProps } from "./types";

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VideoProgress = ({
    progress,
    currentTime,
    duration,
    onSeek,
}: VideoProgressProps) => {
    return (<div className="px-4 pt-3 pb-2">
        <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="
w-full
h-1
cursor-pointer
accent-red-600
"
        />


        <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-white/80">
                {formatTime(currentTime)}
            </span>

            <span className="text-[11px] text-white/80">
                {formatTime(duration)}
            </span>
        </div>
    </div>


    );
};

export default VideoProgress;
