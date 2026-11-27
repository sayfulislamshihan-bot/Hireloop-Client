import {
    ArrowUpRight,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    FileText,
    MapPin,
    Users,
} from 'lucide-react';
import { getAdminApplications } from '@/lib/api/applications';
import { getJobs } from '@/lib/api/jobs';

const asList = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.jobs)) return result.jobs;
    if (Array.isArray(result?.applications)) return result.applications;
    return [];
};

const idValue = (value) => {
    if (value == null) return '';
    if (typeof value === 'object') return String(value.$oid || value._id?.$oid || value._id || value.toString?.() || '');
    return String(value);
};

const formatDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value?.$date ?? value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

const statusClass = (status = 'Applied') => {
    const value = String(status).toLowerCase();
    if (value.includes('shortlist') || value.includes('offer') || value.includes('approve')) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
    if (value.includes('reject')) return 'border-rose-500/20 bg-rose-500/10 text-rose-300';
    if (value.includes('review')) return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
    return 'border-zinc-700 bg-zinc-900 text-zinc-300';
};

export default async function AdminJobsPage() {
    const [jobsResult, applicationsResult] = await Promise.allSettled([
        getJobs(),
        getAdminApplications(),
    ]);
    const jobs = jobsResult.status === 'fulfilled' ? asList(jobsResult.value) : [];
    const applications = applicationsResult.status === 'fulfilled' ? asList(applicationsResult.value) : [];
    const jobsError = jobsResult.status === 'rejected' || !Array.isArray(jobsResult.value);
    const applicationsError = applicationsResult.status === 'rejected' || !Array.isArray(applicationsResult.value);
    const applicationsByJob = new Map();

    for (const application of applications) {
        const jobId = idValue(application.jobId);
        if (!jobId) continue;
        const existing = applicationsByJob.get(jobId) || [];
        existing.push(application);
        applicationsByJob.set(jobId, existing);
    }

    const totalApplications = applications.reduce((total, application) => total + (application.jobId ? 1 : 0), 0);

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-sm font-medium text-blue-400">Admin workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Jobs and applications</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review published job details alongside the applications submitted for each role.</p>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2" aria-label="Jobs overview">
                    <StatCard icon={BriefcaseBusiness} label="Listed jobs" value={jobs.length} />
                    <StatCard icon={FileText} label="Applications" value={applicationsError ? '—' : totalApplications} />
                </section>

                {jobsError ? (
                    <EmptyState title="Could not load jobs" message="The jobs service did not return job data. Please try again later." />
                ) : jobs.length === 0 ? (
                    <EmptyState title="No jobs found" message="Published jobs will appear here with their submitted applications." />
                ) : (
                    <section className="space-y-5" aria-label="Jobs and their applications">
                        {jobs.map((job, index) => {
                            const jobId = idValue(job._id || job.id);
                            const jobApplications = applicationsByJob.get(jobId) || [];
                            const jobKey = jobId || `${job.jobTitle || 'job'}-${index}`;
                            return (
                                <article key={jobKey} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416]">
                                    <div className="flex flex-col gap-5 border-b border-zinc-800 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                                        <div className="flex min-w-0 items-start gap-4">
                                            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><BriefcaseBusiness size={20} /></span>
                                            <div className="min-w-0">
                                                <h2 className="text-lg font-semibold text-zinc-100">{job.jobTitle || 'Untitled position'}</h2>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                                                    <span className="inline-flex items-center gap-1.5"><Building2 size={14} />{job.companyName || 'Company not listed'}</span>
                                                    {job.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>}
                                                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />Posted {formatDate(job.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                                            {job.jobType && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">{job.jobType}</span>}
                                            {job.status && <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs capitalize text-blue-300">{job.status}</span>}
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"><Users size={13} />{applicationsError ? '—' : jobApplications.length} applicants</span>
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-200">Submitted applications</h3>
                                                <p className="mt-1 text-xs text-zinc-500">Applicant details and materials submitted for this job</p>
                                            </div>
                                            {job.salary && <span className="text-xs text-zinc-500">Salary: <span className="text-zinc-300">{job.salary}</span></span>}
                                        </div>

                                        {applicationsError ? (
                                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-5 text-sm text-amber-200">Applications could not be loaded.</div>
                                        ) : jobApplications.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center">
                                                <p className="text-sm text-zinc-400">No applications submitted for this role yet.</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto rounded-xl border border-zinc-800">
                                                <table className="w-full min-w-[720px] text-left">
                                                    <thead>
                                                        <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                                            <th className="px-4 py-3">Applicant</th>
                                                            <th className="px-4 py-3">Submitted</th>
                                                            <th className="px-4 py-3">Status</th>
                                                            <th className="px-4 py-3">Application links</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-zinc-800/80">
                                                        {jobApplications.map((application, applicationIndex) => {
                                                            const applicationKey = idValue(application._id || application.id) || `${jobKey}-application-${applicationIndex}`;
                                                            return (
                                                                <tr key={applicationKey} className="transition hover:bg-zinc-900/30">
                                                                    <td className="px-4 py-3.5">
                                                                        <p className="text-sm font-medium text-zinc-200">{application.applicantName || 'Applicant'}</p>
                                                                        <p className="mt-1 text-xs text-zinc-500">{application.applicantEmail || 'Email not provided'}</p>
                                                                    </td>
                                                                    <td className="px-4 py-3.5 text-sm text-zinc-400">{formatDate(application.createdAt)}</td>
                                                                    <td className="px-4 py-3.5"><span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusClass(application.status)}`}>{application.status || 'Applied'}</span></td>
                                                                    <td className="px-4 py-3.5">
                                                                        <div className="flex flex-wrap gap-3">
                                                                            {application.resumeLink && <a href={application.resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-300 hover:text-blue-200">Resume <ArrowUpRight size={13} /></a>}
                                                                            {application.portfolioLink && <a href={application.portfolioLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-300 hover:text-blue-200">Portfolio <ArrowUpRight size={13} /></a>}
                                                                            {!application.resumeLink && !application.portfolioLink && <span className="text-xs text-zinc-600">No links</span>}
                                                                        </div>
                                                                        {application.additionalNotes && <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">{application.additionalNotes}</p>}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </main>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><Icon size={19} /></span>
            </div>
        </article>
    );
}

function EmptyState({ title, message }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#141416] px-6 py-12 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-zinc-800 text-zinc-400"><BriefcaseBusiness size={21} /></span>
            <p className="mt-4 font-medium text-zinc-200">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{message}</p>
        </div>
    );
}
