// Job-related TypeScript definitions
// Following the clean architecture principle of single-responsibility types

export interface Job {
  id: string;
  created_at: string;
  name: string;
  query: string;
  max_results: number;
  date_from?: string;
  date_to?: string;
  pmc_only: boolean;
  allow_external: boolean;
  concurrency: number;
  status: JobStatus;
  error_msg?: string;
}

export interface CreateJobRequest {
  name: string;
  query: string;
  max_results?: number;
  date_from?: string;
  date_to?: string;
  pmc_only?: boolean;
  allow_external?: boolean;
  concurrency?: number;
}

export interface JobResponse {
  id: string;
  status: JobStatus;
  message?: string;
}

export enum JobStatus {
  QUEUED = 'queued',
  SEARCHING = 'searching',
  RESOLVING = 'resolving',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface JobProgress {
  total: number;
  completed: number;
  failed: number;
  current_stage: JobStatus;
  estimated_completion?: string;
}

export interface JobStats {
  total_articles: number;
  downloaded_articles: number;
  failed_articles: number;
  skipped_articles: number;
  total_size_bytes: number;
}
