// Articles API service
// Following the clean architecture principle of single-responsibility services

import { Article, ArticleSummary, ArticleRetryRequest, ArticleCrawlRequest } from '../types/article.types';
import { ApiError, ArticleQueryParams } from '../types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ArticlesApiService {
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

  async getJobArticles(jobId: string, params?: Omit<ArticleQueryParams, 'job_id'>): Promise<{ articles: ArticleSummary[]; total: number }> {
    try {
      const searchParams = new URLSearchParams({ job_id: jobId });

      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/api/articles?${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await this.handleResponse<{ articles: ArticleSummary[]; total: number }>(response);
      return result;
    } catch (error) {
      console.error('Error fetching job articles:', error);
      throw error;
    }
  }

  async getArticle(articleId: string): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  async retryArticle(request: ArticleRetryRequest): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${request.article_id}/retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_url: request.new_url }),
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Error retrying article:', error);
      throw error;
    }
  }

  async crawlArticle(request: ArticleCrawlRequest): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${request.article_id}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depth: request.depth || 2,
          timeout: request.timeout || 30
        }),
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Error crawling article:', error);
      throw error;
    }
  }

  async downloadArticle(articleId: string): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<Article>(response);
    } catch (error) {
      console.error('Error downloading article:', error);
      throw error;
    }
  }

  async getArticlePdf(articleId: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}/pdf`, {
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
      console.error('Error fetching article PDF:', error);
      throw error;
    }
  }

  async deleteArticle(articleId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  async bulkRetryArticles(articleIds: string[], newUrl?: string): Promise<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/bulk-retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_ids: articleIds, new_url: newUrl }),
      });

      return await this.handleResponse<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }>(response);
    } catch (error) {
      console.error('Error bulk retrying articles:', error);
      throw error;
    }
  }

  async bulkDownloadArticles(articleIds: string[]): Promise<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/bulk-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_ids: articleIds }),
      });

      return await this.handleResponse<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }>(response);
    } catch (error) {
      console.error('Error bulk downloading articles:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const articlesApi = new ArticlesApiService();
