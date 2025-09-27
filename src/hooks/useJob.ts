// useJob hook
// Following the clean architecture principle of single-responsibility hooks

import { useState, useEffect, useCallback } from 'react';
import { Job, CreateJobRequest, JobStatus } from '../app/types/job.types';
import { jobsApi } from '../app/api/jobsApi';

interface UseJobOptions {
  jobId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseJobReturn {
  job: Job | null;
  loading: boolean;
  error: string | null;
  createJob: (jobData: CreateJobRequest) => Promise<Job>;
  refreshJob: () => Promise<void>;
  startSearch: () => Promise<void>;
  startResolve: () => Promise<void>;
  startDownload: () => Promise<void>;
}

export function useJob(options: UseJobOptions = {}): UseJobReturn {
  const { jobId, autoRefresh = false, refreshInterval = 5000 } = options;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedJob = await jobsApi.getJob(jobId);
      setJob(fetchedJob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const createJob = useCallback(async (jobData: CreateJobRequest): Promise<Job> => {
    setLoading(true);
    setError(null);

    try {
      const newJob = await jobsApi.createJob(jobData);
      setJob(newJob);
      return newJob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startSearch = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      const updatedJob = await jobsApi.startJobSearch(jobId);
      setJob(updatedJob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start search';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const startResolve = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      const updatedJob = await jobsApi.startJobResolve(jobId);
      setJob(updatedJob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start resolve';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const startDownload = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      const updatedJob = await jobsApi.startJobDownload(jobId);
      setJob(updatedJob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start download';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const refreshJob = useCallback(async () => {
    await fetchJob();
  }, [fetchJob]);

  // Initial fetch
  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId, fetchJob]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !jobId) return;

    const interval = setInterval(() => {
      // Only auto-refresh if job is in progress
      if (job && [JobStatus.SEARCHING, JobStatus.RESOLVING, JobStatus.DOWNLOADING].includes(job.status)) {
        fetchJob();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, jobId, job, refreshInterval, fetchJob]);

  return {
    job,
    loading,
    error,
    createJob,
    refreshJob,
    startSearch,
    startResolve,
    startDownload
  };
}
