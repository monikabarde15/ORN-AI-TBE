import {
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
} from "lucide-react";

import PlaybackMenu from "./PlaybackMenu";
// import VideoActions from "./VideoActions";
import { VideoControlsProps } from "./types";

const VideoControls = ({
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,

    onPlayPause,
    onSkipForward,
    onSkipBackward,
    onMuteToggle,
    onFullscreen,
    onVolumeChange,
    onPlaybackRateChange,
}: VideoControlsProps) => {
    return (<div
        className="
     flex
     items-center
     justify-between
     px-4
     py-3
     border-t
     border-white/10
   "
    > <div className="flex items-center gap-3"> <button
        onClick={onPlayPause}
        className="
         text-white
         hover:text-red-500
         transition-colors
       "
    >
        {isPlaying ? (<Pause className="w-5 h-5" />
        ) : (<Play className="w-5 h-5" />
        )} </button>


            <button
                onClick={onSkipBackward}
                className="
    flex items-center
    justify-center
    text-white
    font-medium
    text-sm
    hover:text-red-500
    transition-colors
  "
            >
                <div className="relative">
                    <RotateCcw className="w-5 h-5" />
                    <span
                        className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        text-[8px]
        font-bold
      "
                    >
                        10
                    </span>
                </div>
            </button>

            <button
                onClick={onSkipForward}
                className="
    flex items-center
    justify-center
    text-white
    font-medium
    text-sm
    hover:text-red-500
    transition-colors
  "
            >
                <div className="relative">
                    <RotateCw className="w-5 h-5" />
                    <span
                        className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        text-[8px]
        font-bold
      "
                    >
                        10
                    </span>
                </div>
            </button>

            <div className="hidden md:flex items-center gap-2">
                <button
                    onClick={onMuteToggle}
                    className="
          text-white
          hover:text-red-500
          transition-colors
        "
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </button>

                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) =>
                        onVolumeChange(
                            Number(e.target.value)
                        )
                    }
                    className="
          w-24
          accent-red-600
          cursor-pointer
        "
                />
            </div>
        </div>

        {/* <div className="hidden xl:block">
            <VideoActions />
        </div> */}

        <div className="flex items-center gap-4">
            <PlaybackMenu
                playbackRate={playbackRate}
                onPlaybackRateChange={
                    onPlaybackRateChange
                }
            />

            <button
                onClick={onFullscreen}
                className="
        text-white
        hover:text-red-500
        transition-colors
      "
            >
                {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                ) : (
                    <Maximize2 className="w-5 h-5" />
                )}
            </button>
        </div>
    </div>
    );
};

export default VideoControls;
