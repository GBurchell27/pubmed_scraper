// Export API service
// Following the clean architecture principle of single-responsibility services

import { ExportOptions } from '../types/article.types';
import { ApiError } from '../types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ExportApiService {
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

  async exportJobToCsv(jobId: string, options?: Partial<ExportOptions>): Promise<Blob> {
    try {
      const searchParams = new URLSearchParams({ format: 'csv' });

      if (options?.include_failed !== undefined) {
        searchParams.append('include_failed', options.include_failed.toString());
      }
      if (options?.include_skipped !== undefined) {
        searchParams.append('include_skipped', options.include_skipped.toString());
      }
      if (options?.fields) {
        searchParams.append('fields', options.fields.join(','));
      }

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/api/jobs/${jobId}/export?${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));
        throw new Error(errorData.error);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting job to CSV:', error);
      throw error;
    }
  }

  async exportJobToJson(jobId: string, options?: Partial<ExportOptions>): Promise<Blob> {
    try {
      const searchParams = new URLSearchParams({ format: 'json' });

      if (options?.include_failed !== undefined) {
        searchParams.append('include_failed', options.include_failed.toString());
      }
      if (options?.include_skipped !== undefined) {
        searchParams.append('include_skipped', options.include_skipped.toString());
      }
      if (options?.fields) {
        searchParams.append('fields', options.fields.join(','));
      }

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/api/jobs/${jobId}/export?${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));
        throw new Error(errorData.error);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting job to JSON:', error);
      throw error;
    }
  }

  async exportJobAsZip(jobId: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/export-zip`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));
        throw new Error(errorData.error);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting job as ZIP:', error);
      throw error;
    }
  }

  async getExportPreview(jobId: string, format: 'csv' | 'json', limit: number = 10): Promise<string> {
    try {
      const searchParams = new URLSearchParams({
        format,
        limit: limit.toString(),
        preview: 'true'
      });

      const url = `${API_BASE_URL}/api/jobs/${jobId}/export?${searchParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));
        throw new Error(errorData.error);
      }

      return await response.text();
    } catch (error) {
      console.error('Error getting export preview:', error);
      throw error;
    }
  }

  // Utility method to download a blob with a specific filename
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Convenience method to export and download in one call
  async exportAndDownload(
    jobId: string,
    format: 'csv' | 'json' | 'zip',
    filename?: string,
    options?: Partial<ExportOptions>
  ): Promise<void> {
    try {
      let blob: Blob;
      let defaultFilename: string;

      switch (format) {
        case 'csv':
          blob = await this.exportJobToCsv(jobId, options);
          defaultFilename = `job_${jobId}_export.csv`;
          break;
        case 'json':
          blob = await this.exportJobToJson(jobId, options);
          defaultFilename = `job_${jobId}_export.json`;
          break;
        case 'zip':
          blob = await this.exportJobAsZip(jobId);
          defaultFilename = `job_${jobId}_pdfs.zip`;
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      const finalFilename = filename || defaultFilename;
      this.downloadBlob(blob, finalFilename);
    } catch (error) {
      console.error('Error exporting and downloading:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const exportApi = new ExportApiService();
