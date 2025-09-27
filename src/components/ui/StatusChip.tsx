// StatusChip component
// Following the clean architecture principle of single-responsibility components

import React from 'react';

interface StatusChipProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  variant,
  size = 'md',
  className = ''
}) => {
  // Auto-determine variant based on status if not provided
  const getVariant = (status: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    if (variant) return variant;

    const statusLower = status.toLowerCase();

    if (statusLower.includes('success') || statusLower.includes('complete') || statusLower.includes('downloaded')) {
      return 'success';
    }
    if (statusLower.includes('error') || statusLower.includes('failed') || statusLower.includes('paywall')) {
      return 'error';
    }
    if (statusLower.includes('warning') || statusLower.includes('pending') || statusLower.includes('processing')) {
      return 'warning';
    }
    if (statusLower.includes('info') || statusLower.includes('queued') || statusLower.includes('searching')) {
      return 'info';
    }

    return 'default';
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const classes = [
    'inline-flex items-center font-medium rounded-full',
    variantClasses[getVariant(status)],
    sizeClasses[size],
    className
  ].join(' ');

  return (
    <span className={classes}>
      {status}
    </span>
  );
};

export default StatusChip;
