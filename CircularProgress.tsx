import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 40,
  strokeWidth = 3.5,
  showLabel = true,
  className = '',
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Determine stroke color based on fulfillment level
  let strokeColor = '#06B6D4'; // cyan default
  if (clampedPercentage === 100) {
    strokeColor = '#10B981'; // emerald for complete
  } else if (clampedPercentage === 0) {
    strokeColor = '#475569'; // muted slate for 0%
  } else if (clampedPercentage < 50) {
    strokeColor = '#F59E0B'; // amber for partial
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`${clampedPercentage}% Acceptance Criteria Fulfilled`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono tabular-nums leading-none"
          style={{ color: clampedPercentage === 100 ? '#34D399' : '#F1F5F9' }}
        >
          {clampedPercentage}%
        </span>
      )}
    </div>
  );
};
