'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="progress-bar">
      <span className="label">{current} / {total}</span>
      <div className="track">
        <div className="fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}