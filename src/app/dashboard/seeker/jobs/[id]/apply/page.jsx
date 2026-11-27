import { getJobById } from '@/lib/api/jobs';
import { getApplicationsByApplicant } from '@/lib/api/applications';
import { getPlanById } from '@/lib/api/plans';
import { getUserSession } from '@/lib/core/session';
import JobApply from '@/app/jobs/[id]/apply/JobApply';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CircleInfo, Rocket } from '@gravity-ui/icons';

export default async function SeekerJobApplyPage({ params }) {
    const { id } = await params;
    const user = await getUserSession();
    const [job, applications, planResult] = await Promise.all([
        getJobById(id),
        getApplicationsByApplicant(user.id),
        getPlanById(user.plan || 'seeker_free'),
    ]);

    if (!job) notFound();

    const plan = planResult && !planResult.message ? planResult : {
        name: user.plan || 'Free',
        maxApplicationsPerMonth: 3,
    };
    const applicationCount = applications?.length || 0;
    const applicationLimit = Number(plan.maxApplicationsPerMonth) || 0;
    const hasReachedLimit = applicationCount >= applicationLimit;
    const usagePercentage = applicationLimit > 0
        ? Math.min((applicationCount / applicationLimit) * 100, 100)
        : 100;

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Monthly Quota Status</span>
                            <h2 className="text-lg font-bold text-zinc-100 mt-0.5">You have applied to <span className="text-blue-400">{applicationCount}</span> out of <span className="text-zinc-400">{plan.maxApplicationsPerMonth}</span> positions</h2>
                        </div>
                        <span className="self-start sm:self-center px-2.5 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">Current Plan: <strong className="text-white">{plan.name}</strong></span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-5">
                        <div className={`h-full rounded-full ${hasReachedLimit ? 'bg-red-500' : usagePercentage > 66 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${usagePercentage}%` }} />
                    </div>
                    <div className="flex items-start gap-3 bg-blue-950/30 border border-blue-900/50 rounded-xl p-4 text-sm text-blue-300/90">
                        <Rocket className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="flex-1 sm:flex sm:items-center sm:justify-between gap-4">
                            <p>Need to apply for more positions? Upgrade your account to unlock more job submissions.</p>
                            <Link href="/plans" className="inline-block mt-2 sm:mt-0 whitespace-nowrap text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg">View Plans</Link>
                        </div>
                    </div>
                </div>

                {hasReachedLimit ? (
                    <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center">
                        <div className="w-10 h-10 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-3"><CircleInfo className="w-5 h-5" /></div>
                        <h4 className="text-base font-semibold text-zinc-200">Application Limit Reached</h4>
                        <p className="text-sm text-zinc-500 max-w-sm mt-1">You have exhausted your application credits for this cycle. Upgrade your plan to submit more applications.</p>
                    </div>
                ) : (
                    <JobApply applicant={user} job={job} />
                )}
            </div>
        </div>
    );
}
