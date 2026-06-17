interface ProgressBarProps {
  progress: number;
  label?: string;
}

const ProgressBar = ({ progress, label = "Progress" }: ProgressBarProps) => {
  const safeProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs lg:text-sm">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-semibold">{Math.round(safeProgress)}%</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
        <div
          className="h-full rounded-full bg-blue-900 transition-all duration-500 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;