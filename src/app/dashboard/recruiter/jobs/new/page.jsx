import React from 'react';
import PostJobForm from './PostJobForm';
import { getLoggedInRecruiterCompany } from '@/lib/api/companies';
import { getRecruiterJobQuota } from '@/lib/api/recruiterJobQuota';
import JobPostingQuota from './JobPostingQuota';

const PostJobPage = async () => {
    const [company, quotaResponse] = await Promise.all([
        getLoggedInRecruiterCompany(),
        getRecruiterJobQuota().catch(() => null),
    ]);
    const quota = quotaResponse?.limit ? quotaResponse : { error: true };
    const hasReachedLimit = !quota.error && quota.activeJobs >= quota.limit;

    return (
        <div className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <JobPostingQuota quota={quota} />
                {hasReachedLimit ? (
                    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center">
                        <h2 className="text-lg font-semibold text-zinc-100">Active posting limit reached</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">Close one of your active job posts or upgrade your plan to publish another position.</p>
                    </div>
                ) : (
                    <PostJobForm company={company} />
                )}
            </div>
        </div>
    );
};

export default PostJobPage;
