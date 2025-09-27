// usePolling hook
// Following the clean architecture principle of single-responsibility hooks

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  onPoll?: () => Promise<void> | void;
  onError?: (error: Error) => void;
}

interface UsePollingReturn {
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  pollOnce: () => Promise<void>;
  error: Error | null;
}

export function usePolling(options: UsePollingOptions = {}): UsePollingReturn {
  const {
    interval = 5000,
    enabled = false,
    onPoll,
    onError
  } = options;

  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPollRef = useRef(onPoll);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    onPollRef.current = onPoll;
    onErrorRef.current = onError;
  }, [onPoll, onError]);

  const executePoll = useCallback(async () => {
    if (!onPollRef.current) return;

    try {
      setError(null);
      await onPollRef.current();
    } catch (err) {
      const pollError = err instanceof Error ? err : new Error('Polling failed');
      setError(pollError);

      if (onErrorRef.current) {
        onErrorRef.current(pollError);
      }
    }
  }, []);

  const pollOnce = useCallback(async () => {
    await executePoll();
  }, [executePoll]);

  const startPolling = useCallback(() => {
    if (isPolling) return;

    setIsPolling(true);

    // Execute immediately
    executePoll();

    // Set up interval
    intervalRef.current = setInterval(() => {
      executePoll();
    }, interval);
  }, [isPolling, interval, executePoll]);

  const stopPolling = useCallback(() => {
    if (!isPolling) return;

    setIsPolling(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    isPolling,
    startPolling,
    stopPolling,
    pollOnce,
    error
  };
}

// Specialized hook for polling with backoff on errors
interface UsePollingWithBackoffOptions extends UsePollingOptions {
  maxInterval?: number;
  backoffFactor?: number;
  maxRetries?: number;
}

export function usePollingWithBackoff(options: UsePollingWithBackoffOptions = {}): UsePollingReturn & {
  retryCount: number;
  nextInterval: number;
} {
  const {
    maxInterval = 30000,
    backoffFactor = 2,
    maxRetries = 5,
    ...pollingOptions
  } = options;

  const [retryCount, setRetryCount] = useState(0);
  const [nextInterval, setNextInterval] = useState(options.interval || 5000);
  const [isBackingOff, setIsBackingOff] = useState(false);

  const basePolling = usePolling({
    ...pollingOptions,
    interval: nextInterval,
    onError: (error) => {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setIsBackingOff(true);

        // Calculate next interval with exponential backoff
        const newInterval = Math.min(
          (options.interval || 5000) * Math.pow(backoffFactor, retryCount + 1),
          maxInterval
        );
        setNextInterval(newInterval);

        // Reset after backoff period
        setTimeout(() => {
          setIsBackingOff(false);
          setRetryCount(0);
          setNextInterval(options.interval || 5000);
        }, newInterval);
      }

      if (options.onError) {
        options.onError(error);
      }
    }
  });

  return {
    ...basePolling,
    retryCount,
    nextInterval
  };
}
