import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
} from "lucide-react";

import PlaybackMenu from "./PlaybackMenu";
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

  onPreviousLesson,
  onNextLesson,
}: VideoControlsProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        px-4
        py-3
        border-t
        border-white/10
      "
    >
      {/* LEFT - Lesson Navigation + Play */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPreviousLesson}
          disabled={!onPreviousLesson}
          className="
            text-white
            hover:text-red-500
            transition-colors
            disabled:opacity-40
          "
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPause}
          className="
            text-white
            hover:text-red-500
            transition-colors
          "
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={onNextLesson}
          disabled={!onNextLesson}
          className="
            text-white
            hover:text-red-500
            transition-colors
            disabled:opacity-40
          "
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER - Video Seeking */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSkipBackward}
          className="
            text-white
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
            text-white
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
      </div>

      {/* RIGHT - Player Settings */}
      <div className="flex items-center gap-4">
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