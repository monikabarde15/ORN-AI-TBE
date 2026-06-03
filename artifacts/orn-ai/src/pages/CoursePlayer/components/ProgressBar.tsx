interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({
  progress,
}: ProgressBarProps) => {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress || 0)
  );
  
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Progress
        </span>

        <span className="font-medium text-white">
          {progress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-700">
        <div
          className="
            h-full
            rounded-full
            bg-red-500
            transition-all
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;