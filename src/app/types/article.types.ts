// Article-related TypeScript definitions
// Following the clean architecture principle of single-responsibility types

export interface Article {
  id: string;
  job_id: string;
  pmid: string;
  title: string;
  pubmed_url: string;
  pmc_id?: string;
  external_url?: string;
  chosen_pdf_url?: string;
  status: ArticleStatus;
  failure_reason?: string;
  retries: number;
  downloaded_at?: string;
  file_path?: string;
  file_size?: number;
}

export interface ArticleSummary {
  id: string;
  pmid: string;
  title: string;
  status: ArticleStatus;
  chosen_pdf_url?: string;
  failure_reason?: string;
}

export enum ArticleStatus {
  PENDING_URLS = 'pending_urls',
  RESOLVED = 'resolved',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  FAILED_SEARCH = 'failed_search',
  FAILED_PAYWALL = 'failed_paywall',
  FAILED_NOT_PDF = 'failed_not_pdf',
  FAILED_NETWORK = 'failed_network',
  FAILED_BLOCKED = 'failed_blocked',
  SKIPPED_NO_PMC = 'skipped_no_pmc',
  SKIPPED_ROBOTS = 'skipped_robots',
  DUPLICATE = 'duplicate'
}

export interface ArticleRetryRequest {
  article_id: string;
  new_url?: string;
}

export interface ArticleCrawlRequest {
  article_id: string;
  depth?: number;
  timeout?: number;
}

export interface ArticleDownload {
  id: string;
  article_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  checksum: string;
  downloaded_at: string;
}

export interface ExportOptions {
  format: 'csv' | 'json';
  include_failed?: boolean;
  include_skipped?: boolean;
  fields?: string[];
}
