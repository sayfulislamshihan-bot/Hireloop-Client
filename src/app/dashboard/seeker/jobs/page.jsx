import JobListingContainer from '@/components/jobs/JobListingContainer';
import { getJobs } from '@/lib/api/jobs';

export default async function SeekerJobsPage() {
    const jobs = await getJobs();

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Browse Jobs</h1>
                <p className="text-zinc-400 mt-2">Discover your next opportunity.</p>
            </div>
            <JobListingContainer initialJobs={jobs || []} basePath="/dashboard/seeker/jobs" />
        </div>
    );
}
