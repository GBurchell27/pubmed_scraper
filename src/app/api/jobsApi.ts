// Jobs API service
// Following the clean architecture principle of single-responsibility services

import {
  Job,
  CreateJobRequest,
  JobResponse,
  JobProgress,
  JobStats,
  JobStatus
} from '../types/job.types';
import {
  ApiSuccessResponse,
  ApiError,
  JobQueryParams
} from '../types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class JobsApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
        code: 'HTTP_ERROR'
      }));
      throw new Error(errorData.error);
    }
    return response.json();
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await this.handleResponse<JobResponse>(response);

      // For now, return a mock job object until backend is implemented
      return {
        id: result.id,
        created_at: new Date().toISOString(),
        name: jobData.name,
        query: jobData.query,
        max_results: jobData.max_results || 100,
        date_from: jobData.date_from,
        date_to: jobData.date_to,
        pmc_only: jobData.pmc_only || false,
        allow_external: jobData.allow_external !== false,
        concurrency: jobData.concurrency || 3,
        status: JobStatus.QUEUED
      };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async getJob(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Job>(response);
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }

  async getJobs(params?: JobQueryParams): Promise<{ jobs: Job[]; total: number }> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
      if (params?.sort_order) searchParams.append('sort_order', params.sort_order);

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/api/jobs${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await this.handleResponse<{ jobs: Job[]; total: number }>(response);
      return result;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async startJobSearch(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Job>(response);
    } catch (error) {
      console.error('Error starting job search:', error);
      throw error;
    }
  }

  async startJobResolve(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Job>(response);
    } catch (error) {
      console.error('Error starting job resolve:', error);
      throw error;
    }
  }

  async startJobDownload(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Job>(response);
    } catch (error) {
      console.error('Error starting job download:', error);
      throw error;
    }
  }

  async getJobProgress(jobId: string): Promise<JobProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<JobProgress>(response);
    } catch (error) {
      console.error('Error fetching job progress:', error);
      throw error;
    }
  }

  async getJobStats(jobId: string): Promise<JobStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<JobStats>(response);
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }

  async deleteJob(jobId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const jobsApi = new JobsApiService();
