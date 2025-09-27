// Application constants
// Following the clean architecture principle of single-responsibility constants

export const APP_CONFIG = {
  name: 'PubMed PDF Scraper',
  version: '1.0.0',
  description: 'Efficiently download PDF articles from PubMed'
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
} as const;

export const JOB_CONFIG = {
  maxResults: {
    min: 1,
    max: 10000,
    default: 100
  },
  concurrency: {
    min: 1,
    max: 10,
    default: 3
  },
  timeout: {
    search: 60000,
    resolve: 30000,
    download: 120000
  }
} as const;

export const UI_CONFIG = {
  pagination: {
    defaultPageSize: 50,
    maxPageSize: 100
  },
  polling: {
    interval: 3000,
    fastInterval: 1000
  },
  export: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    chunkSize: 1024 * 1024 // 1MB
  }
} as const;

export const VALIDATION_RULES = {
  jobName: {
    minLength: 3,
    maxLength: 100
  },
  query: {
    maxLength: 1000
  },
  url: {
    maxLength: 2000
  }
} as const;

export const FILE_TYPES = {
  pdf: 'application/pdf',
  zip: 'application/zip',
  csv: 'text/csv',
  json: 'application/json'
} as const;

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  tooManyRequests: 429,
  internalServerError: 500
} as const;
