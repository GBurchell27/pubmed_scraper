// ProgressBar component
// Following the clean architecture principle of single-responsibility components

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  total?: number;
  showPercentage?: boolean;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  showPercentage = true,
  showCount = false,
  size = 'md',
  color = 'blue',
  className = '',
  label
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  const containerClasses = [
    'w-full bg-gray-200 rounded-full overflow-hidden',
    sizeClasses[size],
    className
  ].join(' ');

  return (
    <div className="space-y-2">
      {(label || showPercentage || showCount) && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          {label && <span>{label}</span>}
          <div className="flex space-x-2">
            {showCount && total && (
              <span>{Math.round((clampedProgress / 100) * total)} / {total}</span>
            )}
            {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
          </div>
        </div>
      )}

      <div className={containerClasses}>
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${colorClasses[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
