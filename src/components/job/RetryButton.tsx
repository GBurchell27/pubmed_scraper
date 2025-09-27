// RetryButton component
// Following the clean architecture principle of single-responsibility components

import React, { useState } from 'react';
import Button from '../ui/Button';

interface RetryButtonProps {
  onRetry: () => Promise<void>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  disabled = false,
  variant = 'outline',
  size = 'sm',
  className = '',
  children = 'Retry'
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying || disabled) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRetry}
      disabled={disabled || isRetrying}
      isLoading={isRetrying}
      className={className}
    >
      {children}
    </Button>
  );
};

export default RetryButton;
