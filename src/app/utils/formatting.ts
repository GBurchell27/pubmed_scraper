// Formatting utility functions
// Following the clean architecture principle of single-responsibility utilities

import { JobStatus } from '../types/job.types';
import { ArticleStatus, Article } from '../types/article.types';

// Date formatting
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj);
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

// Job status formatting
export function formatJobStatus(status: JobStatus): { text: string; color: string } {
  const statusMap = {
    [JobStatus.QUEUED]: { text: 'Queued', color: 'gray' },
    [JobStatus.SEARCHING]: { text: 'Searching', color: 'blue' },
    [JobStatus.RESOLVING]: { text: 'Resolving', color: 'yellow' },
    [JobStatus.DOWNLOADING]: { text: 'Downloading', color: 'orange' },
    [JobStatus.COMPLETED]: { text: 'Completed', color: 'green' },
    [JobStatus.FAILED]: { text: 'Failed', color: 'red' }
  };

  return statusMap[status] || { text: status, color: 'gray' };
}

// Article status formatting
export function formatArticleStatus(status: ArticleStatus): { text: string; color: string } {
  const statusMap = {
    [ArticleStatus.PENDING_URLS]: { text: 'Pending', color: 'gray' },
    [ArticleStatus.RESOLVED]: { text: 'Resolved', color: 'blue' },
    [ArticleStatus.DOWNLOADING]: { text: 'Downloading', color: 'yellow' },
    [ArticleStatus.DOWNLOADED]: { text: 'Downloaded', color: 'green' },
    [ArticleStatus.FAILED_SEARCH]: { text: 'Search Failed', color: 'red' },
    [ArticleStatus.FAILED_PAYWALL]: { text: 'Paywall', color: 'orange' },
    [ArticleStatus.FAILED_NOT_PDF]: { text: 'Not PDF', color: 'red' },
    [ArticleStatus.FAILED_NETWORK]: { text: 'Network Error', color: 'red' },
    [ArticleStatus.FAILED_BLOCKED]: { text: 'Blocked', color: 'red' },
    [ArticleStatus.SKIPPED_NO_PMC]: { text: 'No PMC', color: 'gray' },
    [ArticleStatus.SKIPPED_ROBOTS]: { text: 'Robots.txt', color: 'gray' },
    [ArticleStatus.DUPLICATE]: { text: 'Duplicate', color: 'purple' }
  };

  return statusMap[status] || { text: status, color: 'gray' };
}

// Progress percentage formatting
export function formatProgress(current: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((current / total) * 100);
  return `${percentage}%`;
}

// Number formatting with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Query display formatting (truncate long queries)
export function formatQuery(query: string, maxLength: number = 100): string {
  if (query.length <= maxLength) return query;
  return query.substring(0, maxLength) + '...';
}

// File name sanitization
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

// Error message formatting
export function formatErrorMessage(error: string | Error): string {
  if (typeof error === 'string') return error;
  return error.message || 'An unknown error occurred';
}

// Article title formatting (truncate for display)
export function formatArticleTitle(title: string, maxLength: number = 80): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}
