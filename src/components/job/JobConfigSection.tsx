// JobConfigSection component
// Following the clean architecture principle of single-responsibility components

import React from 'react';
import { Job } from '../../app/types/job.types';
import { formatDateTime } from '../../app/utils/formatting';

interface JobConfigSectionProps {
  job: Job;
  className?: string;
}

const JobConfigSection: React.FC<JobConfigSectionProps> = ({ job, className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Job Configuration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Job Name</dt>
            <dd className="text-sm text-gray-900">{job.name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="text-sm text-gray-900">{formatDateTime(job.created_at)}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Max Results</dt>
            <dd className="text-sm text-gray-900">{job.max_results.toLocaleString()}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Concurrency</dt>
            <dd className="text-sm text-gray-900">{job.concurrency}</dd>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">PubMed Query</dt>
            <dd className="text-sm text-gray-900 font-mono bg-white p-2 rounded border max-w-xs truncate">
              {job.query}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Date Range</dt>
            <dd className="text-sm text-gray-900">
              {job.date_from && job.date_to
                ? `${job.date_from} to ${job.date_to}`
                : 'No date filter'
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Source Preferences</dt>
            <dd className="text-sm text-gray-900">
              <div className="space-y-1">
                <div>PMC Only: {job.pmc_only ? 'Yes' : 'No'}</div>
                <div>External Crawling: {job.allow_external ? 'Allowed' : 'Disabled'}</div>
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobConfigSection;
