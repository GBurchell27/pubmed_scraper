// API-related TypeScript definitions
// Following the clean architecture principle of single-responsibility types

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  version?: string;
  timestamp: string;
  services?: {
    database?: 'connected' | 'disconnected';
    pubmed?: 'available' | 'unavailable';
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BulkOperationResponse {
  success_count: number;
  failure_count: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// Query parameter types for better type safety
export interface JobQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ArticleQueryParams {
  job_id: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// Request/Response wrapper types
export type ApiRequest<T = any> = T;
export type ApiSuccessResponse<T = any> = ApiResponse<T>;
export type ApiFailureResponse = ApiError;
