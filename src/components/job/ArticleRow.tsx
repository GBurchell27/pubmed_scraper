// ArticleRow component
// Following the clean architecture principle of single-responsibility components

import React from 'react';
import { Article, ArticleStatus } from '../../app/types/article.types';
import { formatArticleStatus, formatArticleTitle, formatFileSize } from '../../app/utils/formatting';
import StatusChip from '../ui/StatusChip';
import RetryButton from './RetryButton';
import Button from '../ui/Button';

interface ArticleRowProps {
  article: Article;
  onRetry?: (articleId: string) => void;
  onDownload?: (articleId: string) => void;
  onPreview?: (articleId: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const ArticleRow: React.FC<ArticleRowProps> = ({
  article,
  onRetry,
  onDownload,
  onPreview,
  isSelected = false,
  onSelectionChange
}) => {
  const statusInfo = formatArticleStatus(article.status);

  const handleRetry = () => {
    if (onRetry) {
      onRetry(article.id);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(article.id);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(article.id);
    }
  };

  return (
    <div className={`border-b border-gray-200 py-4 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        {onSelectionChange && (
          <div className="pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Article Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {formatArticleTitle(article.title)}
              </h4>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>PMID: {article.pmid}</span>
                {article.file_size && (
                  <span>Size: {formatFileSize(article.file_size)}</span>
                )}
                {article.chosen_pdf_url && (
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      article.chosen_pdf_url.includes('pmc') ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                    {article.chosen_pdf_url.includes('pmc') ? 'PMC' : 'External'}
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="ml-4">
              <StatusChip status={statusInfo.text} />
            </div>
          </div>

          {/* Error Message */}
          {article.failure_reason && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {article.failure_reason}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 flex items-center space-x-2">
            {article.status === ArticleStatus.DOWNLOADED && onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                Download PDF
              </Button>
            )}

            {(article.status === ArticleStatus.FAILED_SEARCH ||
              article.status === ArticleStatus.FAILED_PAYWALL ||
              article.status === ArticleStatus.FAILED_NOT_PDF ||
              article.status === ArticleStatus.FAILED_NETWORK ||
              article.status === ArticleStatus.FAILED_BLOCKED) && onRetry && (
              <RetryButton onRetry={handleRetry} />
            )}

            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
              >
                Preview
              </Button>
            )}

            {/* External Link */}
            {article.pubmed_url && (
              <a
                href={article.pubmed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View on PubMed
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleRow;
