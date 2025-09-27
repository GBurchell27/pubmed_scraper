"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job, JobStatus } from '../../types/job.types';
import { Article, ArticleStatus } from '../../types/article.types';
import { useJob } from '../../../hooks/useJob';
import { useArticles } from '../../../hooks/useArticles';
import { formatJobStatus, formatDateTime } from '../../utils/formatting';
import Header from '../../../components/layout/Header';
import Button from '../../../components/ui/Button';
import ProgressBar from '../../../components/ui/ProgressBar';
import StatusChip from '../../../components/ui/StatusChip';
import JobConfigSection from '../../../components/job/JobConfigSection';
import ResultsTable from '../../../components/job/ResultsTable';
import ExportMenu from '../../../components/job/ExportMenu';
import { exportApi } from '../../api/exportApi';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const {
    job,
    loading: jobLoading,
    error: jobError,
    startSearch,
    startResolve,
    startDownload
  } = useJob({ jobId, autoRefresh: true });

  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    retryArticle,
    downloadArticle
  } = useArticles({ jobId, autoRefresh: true });

  const handleStartSearch = async () => {
    try {
      await startSearch();
    } catch (error) {
      console.error('Failed to start search:', error);
    }
  };

  const handleStartResolve = async () => {
    try {
      await startResolve();
    } catch (error) {
      console.error('Failed to start resolve:', error);
    }
  };

  const handleStartDownload = async () => {
    try {
      await startDownload();
    } catch (error) {
      console.error('Failed to start download:', error);
    }
  };

  const handleRetryArticle = async (articleId: string) => {
    try {
      await retryArticle(articleId);
    } catch (error) {
      console.error('Failed to retry article:', error);
    }
  };

  const handleDownloadArticle = async (articleId: string) => {
    try {
      await downloadArticle(articleId);
    } catch (error) {
      console.error('Failed to download article:', error);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await exportApi.exportAndDownload(jobId, 'csv', `job_${jobId}_export.csv`);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = async () => {
    setIsExporting(true);
    try {
      await exportApi.exportAndDownload(jobId, 'json', `job_${jobId}_export.json`);
    } catch (error) {
      console.error('Failed to export JSON:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await exportApi.exportAndDownload(jobId, 'zip', `job_${jobId}_pdfs.zip`);
    } catch (error) {
      console.error('Failed to export ZIP:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/');
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton={true} onBackClick={handleBackToDashboard} />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton={true} onBackClick={handleBackToDashboard} />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">
              {jobError || 'Job not found'}
            </p>
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = formatJobStatus(job.status);
  const completedArticles = articles.filter(a => a.status === ArticleStatus.DOWNLOADED).length;
  const failedArticles = articles.filter(a =>
    a.status.includes('failed') || a.status === ArticleStatus.FAILED_SEARCH
  ).length;
  const totalArticles = articles.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={job.name}
        subtitle={`Job #${jobId.slice(-8)}`}
        showBackButton={true}
        onBackClick={handleBackToDashboard}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Job Status and Progress */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Job Status</h2>
                  <p className="text-sm text-gray-500">
                    Created {formatDateTime(job.created_at)}
                  </p>
                </div>
                <StatusChip status={statusInfo.text} />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <ProgressBar
                  progress={Math.round((completedArticles / Math.max(totalArticles, 1)) * 100)}
                  total={totalArticles}
                  showCount={true}
                  color={statusInfo.color as any}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {job.status === JobStatus.QUEUED && (
                  <Button onClick={handleStartSearch} variant="primary">
                    Start Search
                  </Button>
                )}

                {job.status === JobStatus.SEARCHING && (
                  <Button disabled variant="secondary">
                    Searching PubMed...
                  </Button>
                )}

                {job.status === JobStatus.RESOLVING && (
                  <Button disabled variant="secondary">
                    Resolving Sources...
                  </Button>
                )}

                {job.status === JobStatus.DOWNLOADING && (
                  <Button disabled variant="secondary">
                    Downloading PDFs...
                  </Button>
                )}

                {(job.status === JobStatus.SEARCHING || job.status === JobStatus.RESOLVING) && (
                  <Button onClick={handleStartResolve} variant="outline">
                    Skip to Resolve
                  </Button>
                )}

                {(job.status === JobStatus.RESOLVING || job.status === JobStatus.DOWNLOADING) && (
                  <Button onClick={handleStartDownload} variant="outline">
                    Skip to Download
                  </Button>
                )}

                {job.status === JobStatus.COMPLETED && (
                  <div className="flex gap-3">
                    <ExportMenu
                      onExportCsv={handleExportCsv}
                      onExportJson={handleExportJson}
                      onExportZip={handleExportZip}
                      disabled={isExporting}
                      isLoading={isExporting}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Configuration */}
          <JobConfigSection job={job} />

          {/* Results Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Results</h2>
                {job.status === JobStatus.COMPLETED && (
                  <ExportMenu
                    onExportCsv={handleExportCsv}
                    onExportJson={handleExportJson}
                    onExportZip={handleExportZip}
                    disabled={isExporting}
                    isLoading={isExporting}
                  />
                )}
              </div>

              <ResultsTable
                articles={articles}
                loading={articlesLoading}
                onRetry={handleRetryArticle}
                onDownload={handleDownloadArticle}
                selectedArticles={selectedArticles}
                onSelectionChange={setSelectedArticles}
              />

              {articlesError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{articlesError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
