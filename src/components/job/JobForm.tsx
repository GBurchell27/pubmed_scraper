// JobForm component
// Following the clean architecture principle of single-responsibility components

import React, { useState } from 'react';
import { CreateJobRequest } from '../../app/types/job.types';
import { validateJobForm } from '../../app/utils/validation';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface JobFormProps {
  onSubmit: (jobData: CreateJobRequest) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateJobRequest>;
}

const JobForm: React.FC<JobFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    name: '',
    query: '',
    max_results: 100,
    date_from: '',
    date_to: '',
    pmc_only: false,
    allow_external: true,
    concurrency: 3,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (field: keyof CreateJobRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateJobForm(formData);
    setErrors({});

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Name */}
      <Input
        label="Job Name"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="e.g., Atrial Fibrillation Research"
        error={errors.name}
        required
      />

      {/* PubMed Query */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          PubMed Query <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.query}
          onChange={(e) => handleInputChange('query', e.target.value)}
          placeholder="Enter your PubMed search query..."
          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          required
        />
        {errors.query && (
          <p className="text-sm text-red-600">{errors.query}</p>
        )}
        <p className="text-sm text-gray-500">
          Use PubMed syntax: (term[tiab]) AND (term[tiab])
        </p>
      </div>

      {/* Configuration Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max Results */}
          <Input
            label="Max Results"
            type="number"
            min="1"
            max="10000"
            value={formData.max_results}
            onChange={(e) => handleInputChange('max_results', parseInt(e.target.value))}
            error={errors.max_results}
          />

          {/* Concurrency */}
          <Input
            label="Concurrency"
            type="number"
            min="1"
            max="10"
            value={formData.concurrency}
            onChange={(e) => handleInputChange('concurrency', parseInt(e.target.value))}
            error={errors.concurrency}
            helperText="Number of parallel downloads (1-10)"
          />

          {/* Date From */}
          <Input
            label="Date From (optional)"
            type="date"
            value={formData.date_from}
            onChange={(e) => handleInputChange('date_from', e.target.value)}
            error={errors.date_from}
          />

          {/* Date To */}
          <Input
            label="Date To (optional)"
            type="date"
            value={formData.date_to}
            onChange={(e) => handleInputChange('date_to', e.target.value)}
            error={errors.date_to}
          />
        </div>

        {/* Checkboxes */}
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.pmc_only}
              onChange={(e) => handleInputChange('pmc_only', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              PMC only (faster, more reliable PDFs)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allow_external}
              onChange={(e) => handleInputChange('allow_external', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Allow external journal crawling (may be slower)
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Job...' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
