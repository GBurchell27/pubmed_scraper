// ResultsTable component
// Following the clean architecture principle of single-responsibility components

import React from 'react';
import { Article, ArticleStatus } from '../../app/types/article.types';
import { formatArticleStatus, formatArticleTitle, formatFileSize } from '../../app/utils/formatting';
import Table from '../ui/Table';
import StatusChip from '../ui/StatusChip';
import Button from '../ui/Button';

interface ResultsTableProps {
  articles: Article[];
  loading?: boolean;
  onRetry?: (articleId: string) => void;
  onDownload?: (articleId: string) => void;
  onPreview?: (articleId: string) => void;
  selectedArticles?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  articles,
  loading = false,
  onRetry,
  onDownload,
  onPreview,
  selectedArticles = [],
  onSelectionChange
}) => {
  const columns = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (article: Article) => (
        <div className="max-w-md">
          <div className="font-medium text-gray-900 truncate">
            {formatArticleTitle(article.title)}
          </div>
          <div className="text-sm text-gray-500">
            PMID: {article.pmid}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (article: Article) => (
        <StatusChip status={formatArticleStatus(article.status).text} />
      )
    },
    {
      key: 'pmid',
      header: 'PMID',
      sortable: true,
      className: 'w-32'
    },
    {
      key: 'chosen_pdf_url',
      header: 'Source',
      sortable: true,
      render: (article: Article) => {
        if (!article.chosen_pdf_url) return '-';

        const isPmc = article.chosen_pdf_url.includes('pmc');
        return (
          <span className={`text-xs px-2 py-1 rounded ${
            isPmc ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {isPmc ? 'PMC' : 'External'}
          </span>
        );
      }
    },
    {
      key: 'file_size',
      header: 'Size',
      sortable: true,
      render: (article: Article) => {
        if (!article.file_size) return '-';
        return formatFileSize(article.file_size);
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-48',
      render: (article: Article) => (
        <div className="flex space-x-2">
          {article.status === ArticleStatus.DOWNLOADED && onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(article.id)}
            >
              Download
            </Button>
          )}

          {(article.status === ArticleStatus.FAILED_SEARCH ||
            article.status === ArticleStatus.FAILED_PAYWALL ||
            article.status === ArticleStatus.FAILED_NOT_PDF ||
            article.status === ArticleStatus.FAILED_NETWORK) && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(article.id)}
            >
              Retry
            </Button>
          )}

          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(article.id)}
            >
              Preview
            </Button>
          )}
        </div>
      )
    }
  ];

  const getRowId = (article: Article) => article.id;

  const emptyMessage = loading ? 'Loading articles...' : 'No articles found';

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      {articles.length > 0 && (
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Total: {articles.length}</span>
          <span>Downloaded: {articles.filter(a => a.status === ArticleStatus.DOWNLOADED).length}</span>
          <span>Failed: {articles.filter(a => a.status.includes('failed')).length}</span>
          <span>Pending: {articles.filter(a => a.status === ArticleStatus.PENDING_URLS || a.status === ArticleStatus.RESOLVED).length}</span>
        </div>
      )}

      {/* Table */}
      <Table
        data={articles}
        columns={columns}
        loading={loading}
        emptyMessage={emptyMessage}
        selectable={!!onSelectionChange}
        selectedItems={selectedArticles}
        onSelectionChange={onSelectionChange}
        getRowId={getRowId}
      />
    </div>
  );
};

export default ResultsTable;
