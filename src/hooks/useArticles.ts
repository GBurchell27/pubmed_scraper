// useArticles hook
// Following the clean architecture principle of single-responsibility hooks

import { useState, useEffect, useCallback } from 'react';
import { Article, ArticleSummary } from '../app/types/article.types';
import { articlesApi } from '../app/api/articlesApi';

interface UseArticlesOptions {
  jobId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface UseArticlesReturn {
  articles: ArticleSummary[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  refreshArticles: () => Promise<void>;
  loadMore: () => Promise<void>;
  retryArticle: (articleId: string, newUrl?: string) => Promise<void>;
  downloadArticle: (articleId: string) => Promise<void>;
}

export function useArticles(options: UseArticlesOptions): UseArticlesReturn {
  const {
    jobId,
    autoRefresh = false,
    refreshInterval = 3000,
    page: initialPage = 1,
    limit: initialLimit = 50,
    status,
    search
  } = options;

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const fetchArticles = useCallback(async (pageNum: number = page) => {
    setLoading(true);
    setError(null);

    try {
      const result = await articlesApi.getJobArticles(jobId, {
        page: pageNum,
        limit,
        status,
        search
      });

      setArticles(result.articles);
      setTotal(result.total);
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobId, page, limit, status, search]);

  const refreshArticles = useCallback(async () => {
    await fetchArticles(page);
  }, [fetchArticles, page]);

  const loadMore = useCallback(async () => {
    if (loading || articles.length >= total) return;

    const nextPage = page + 1;
    await fetchArticles(nextPage);
  }, [loading, articles.length, total, page, fetchArticles]);

  const retryArticle = useCallback(async (articleId: string, newUrl?: string) => {
    try {
      await articlesApi.retryArticle({ article_id: articleId, new_url: newUrl });

      // Refresh articles to show updated status
      await refreshArticles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retry article';
      setError(errorMessage);
      throw err;
    }
  }, [refreshArticles]);

  const downloadArticle = useCallback(async (articleId: string) => {
    try {
      await articlesApi.downloadArticle(articleId);

      // Refresh articles to show updated status
      await refreshArticles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download article';
      setError(errorMessage);
      throw err;
    }
  }, [refreshArticles]);

  // Initial fetch
  useEffect(() => {
    if (jobId) {
      fetchArticles(1);
      setPage(1);
    }
  }, [jobId, status, search, fetchArticles]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !jobId) return;

    const interval = setInterval(() => {
      refreshArticles();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, jobId, refreshArticles, refreshInterval]);

  const hasNextPage = articles.length < total && (page * limit) < total;
  const hasPrevPage = page > 1;

  return {
    articles,
    total,
    loading,
    error,
    page,
    limit,
    hasNextPage,
    hasPrevPage,
    refreshArticles,
    loadMore,
    retryArticle,
    downloadArticle
  };
}
