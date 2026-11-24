import Link from 'next/link';
import { Briefcase, Rocket } from '@gravity-ui/icons';

export default function JobPostingQuota({ quota }) {
    const limit = Number(quota?.limit) || 0;
    const activeJobs = Number(quota?.activeJobs) || 0;
    const reached = limit > 0 && activeJobs >= limit;
    const percentage = limit > 0 ? Math.min((activeJobs / limit) * 100, 100) : 0;

    return (
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg" aria-label="Job posting quota">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Job Postings</span>
                    <h2 className="mt-1 text-lg font-bold text-zinc-100">
                        {activeJobs} of {limit || 'N/A'} active positions
                    </h2>
                </div>
                <span className="self-start rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 sm:self-center">
                    Current Plan: <strong className="text-white">{quota?.planName || 'Recruiter plan'}</strong>
                </span>
            </div>

            <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-valuenow={activeJobs} aria-valuemin={0} aria-valuemax={limit || 0}>
                <div className={`h-full rounded-full transition-all duration-500 ${reached ? 'bg-red-500' : percentage > 66 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }} />
            </div>

            {quota?.error ? (
                <p className="text-sm text-amber-300">Posting availability could not be loaded. The server will still check your plan when you submit a job.</p>
            ) : (
                <div className="flex items-start gap-3 rounded-xl border border-blue-900/50 bg-blue-950/30 p-4 text-sm text-blue-200">
                    {reached ? <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /> : <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />}
                    <p className="flex-1">{reached ? 'You have reached the active job posting limit for this plan. Close an active post or upgrade to publish another.' : 'Your plan allows this many active job posts at one time. Closed posts no longer count toward the limit.'}</p>
                    <Link href="/plans" className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500">View Plans</Link>
                </div>
            )}
        </section>
    );
}
