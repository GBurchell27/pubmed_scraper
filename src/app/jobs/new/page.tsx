"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateJobRequest } from '../../types/job.types';
import { jobsApi } from '../../api/jobsApi';
import Header from '../../../components/layout/Header';
import JobForm from '../../../components/job/JobForm';
import Button from '../../../components/ui/Button';

export default function NewJobPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleJobSubmit = async (jobData: CreateJobRequest) => {
    setIsCreating(true);
    try {
      const job = await jobsApi.createJob(jobData);

      // Redirect to job details page
      router.push(`/jobs/${job.id}`);
    } catch (error) {
      console.error('Failed to create job:', error);
      throw error; // Let JobForm handle the error display
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Create New Job"
        subtitle="Configure your PubMed scraping job"
        showBackButton={true}
        onBackClick={handleCancel}
      />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <JobForm
                onSubmit={handleJobSubmit}
                isLoading={isCreating}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
