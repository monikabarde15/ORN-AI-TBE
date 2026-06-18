interface PlaybackMenuProps {
    playbackRate: number;
    onPlaybackRateChange: (rate: number) => void;
}

const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PlaybackMenu = ({
    playbackRate,
    onPlaybackRateChange,
}: PlaybackMenuProps) => {
    return (
        <select
            value={playbackRate}
            onChange={(e) =>
                onPlaybackRateChange(Number(e.target.value))
            }
            className="
bg-transparent
text-white
text-sm
outline-none
cursor-pointer
"
        >
            {rates.map((rate) => (<option
                key={rate}
                value={rate}
                className="text-black"
            >
                {rate}x </option>
            ))} </select>
    );
};

export default PlaybackMenu;
