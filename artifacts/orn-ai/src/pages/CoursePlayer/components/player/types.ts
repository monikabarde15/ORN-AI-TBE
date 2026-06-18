export interface VideoPlayerProps {
videoUrl: string;
lessonId: string;
}

export interface VideoState {
isPlaying: boolean;
currentTime: number;
duration: number;
volume: number;
isMuted: boolean;
isFullscreen: boolean;
playbackRate: number;
}

export interface VideoControlsProps {
isPlaying: boolean;
currentTime: number;
duration: number;
volume: number;
isMuted: boolean;
isFullscreen: boolean;
playbackRate: number;

onPlayPause: () => void;
onSkipForward: () => void;
onSkipBackward: () => void;
onMuteToggle: () => void;
onFullscreen: () => void;
onVolumeChange: (value: number) => void;
onPlaybackRateChange: (rate: number) => void;
}

export interface VideoProgressProps {
progress: number;
currentTime: number;
duration: number;
onSeek: (value: number) => void;
}
