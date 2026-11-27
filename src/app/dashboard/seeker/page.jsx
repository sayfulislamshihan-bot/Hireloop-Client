import Link from 'next/link';
import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    FileText,
    MapPin,
    Search,
    Settings2,
    Sparkles,
} from 'lucide-react';
import { getApplicationsByApplicant } from '@/lib/api/applications';
import { getJobs } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';

const getList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.jobs)) return data.jobs;
    if (Array.isArray(data?.applications)) return data.applications;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const getId = (item) => item?._id?.$oid || item?._id || item?.jobId || item?.id;

const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value?.$date ?? value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
};

const MetricCard = ({ icon: Icon, label, value, hint, accent = 'blue' }) => {
    const accentClass = accent === 'emerald' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300';
    return (
        <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
                </div>
                <span className={`grid size-10 place-items-center rounded-xl ${accentClass}`}><Icon size={19} /></span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">{hint}</p>
        </article>
    );
};

const statusStyle = (status = 'Applied') => {
    const normalized = String(status).toLowerCase();
    if (normalized.includes('shortlist') || normalized.includes('offer')) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
    if (normalized.includes('reject')) return 'border-rose-500/20 bg-rose-500/10 text-rose-300';
    if (normalized.includes('review')) return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
    return 'border-zinc-700 bg-zinc-900 text-zinc-300';
};

const QuickAction = ({ href, icon: Icon, title, description }) => (
    <Link href={href} className="group rounded-2xl border border-zinc-800 bg-[#141416] p-5 transition hover:border-zinc-700 hover:bg-[#19191c]">
        <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"><Icon size={19} /></span>
            <ArrowUpRight size={17} className="text-zinc-600 transition group-hover:text-blue-300" />
        </div>
        <h3 className="mt-5 font-medium text-zinc-100">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
    </Link>
);

export default async function SeekerDashboardHomePage() {
    const user = await getUserSession();
    const [jobsResult, applicationsResult] = await Promise.allSettled([
        getJobs(),
        user?.id ? getApplicationsByApplicant(user.id) : Promise.resolve([]),
    ]);
    const jobs = jobsResult.status === 'fulfilled' ? getList(jobsResult.value) : [];
    const applications = applicationsResult.status === 'fulfilled' ? getList(applicationsResult.value) : [];
    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.createdAt?.$date ?? b.createdAt ?? 0) - new Date(a.createdAt?.$date ?? a.createdAt ?? 0))
        .slice(0, 3);
    const recentApplications = [...applications]
        .sort((a, b) => new Date(b.createdAt?.$date ?? b.createdAt ?? 0) - new Date(a.createdAt?.$date ?? a.createdAt ?? 0))
        .slice(0, 4);
    const applicationError = applicationsResult.status === 'rejected';

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-400">Seeker workspace</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Pick up your job search, keep track of your applications, and discover new opportunities.</p>
                            <Link href="/dashboard/seeker/jobs" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-500">Find a job <ArrowRight size={16} /></Link>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-700/70 bg-black/20 p-3 pr-5">
                            <div className="grid size-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-300">{user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'S'}</div>
                            <div className="min-w-0">
                                <p className="max-w-52 truncate font-medium text-zinc-100">{user?.name || 'Job seeker'}</p>
                                <p className="mt-0.5 text-sm capitalize text-zinc-400">{user?.role || 'Seeker'} account</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Job search overview">
                    <MetricCard icon={BriefcaseBusiness} label="Available jobs" value={jobs.length} hint="Open roles currently listed on Hireloop" />
                    <MetricCard icon={FileText} label="Your applications" value={applicationError ? '—' : applications.length} hint={applicationError ? 'Application activity is temporarily unavailable' : 'Applications linked to your account'} accent="emerald" />
                    <MetricCard icon={BadgeCheck} label="Email status" value={user?.emailVerified === true ? 'Verified' : user?.emailVerified === false ? 'Unverified' : '—'} hint="Keep your account contact details current" />
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-100">Quick actions</h2>
                            <p className="mt-1 text-sm text-zinc-500">Shortcuts for your job search</p>
                        </div>
                        <Settings2 size={18} className="text-zinc-600" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <QuickAction href="/dashboard/seeker/jobs" icon={Search} title="Browse jobs" description="Search roles and explore new opportunities." />
                        <QuickAction href="/dashboard/seeker/applications" icon={FileText} title="My applications" description="Check your application history and statuses." />
                        <QuickAction href="/dashboard/seeker/settings" icon={Settings2} title="Account settings" description="Review your account and subscription details." />
                    </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-2">
                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-semibold text-zinc-100">Recent applications</h2>
                                <p className="mt-1 text-sm text-zinc-500">A quick look at your latest activity</p>
                            </div>
                            <Link href="/dashboard/seeker/applications" className="inline-flex items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300">View all <ArrowUpRight size={15} /></Link>
                        </div>
                        {recentApplications.length ? (
                            <div className="mt-5 divide-y divide-zinc-800">
                                {recentApplications.map((application, index) => {
                                    const status = application.status || 'Applied';
                                    return <div key={getId(application) || `${application.jobTitle}-${index}`} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-400"><BriefcaseBusiness size={17} /></span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-zinc-100">{application.jobTitle || 'Job application'}</p>
                                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-zinc-500"><Building2 size={13} />{application.companyName || 'Company not listed'}{formatDate(application.createdAt) ? <><span>·</span><CalendarDays size={12} />{formatDate(application.createdAt)}</> : null}</p>
                                            </div>
                                        </div>
                                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${statusStyle(status)}`}>{status}</span>
                                    </div>;
                                })}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-7 text-center">
                                <p className="text-sm font-medium text-zinc-300">{applicationError ? 'Applications could not be loaded' : 'No applications yet'}</p>
                                <p className="mt-1 text-sm text-zinc-500">{applicationError ? 'Please try again shortly.' : 'Find a role that fits and your application activity will show here.'}</p>
                                {!applicationError && <Link href="/dashboard/seeker/jobs" className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300">Explore jobs <ArrowRight size={15} /></Link>}
                            </div>
                        )}
                    </article>

                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-semibold text-zinc-100">Recently posted jobs</h2>
                                <p className="mt-1 text-sm text-zinc-500">Some of the latest roles to explore</p>
                            </div>
                            <Link href="/dashboard/seeker/jobs" className="inline-flex items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300">Browse all <ArrowUpRight size={15} /></Link>
                        </div>
                        {recentJobs.length ? (
                            <div className="mt-5 divide-y divide-zinc-800">
                                {recentJobs.map((job, index) => <Link href={`/dashboard/seeker/jobs/${getId(job)}`} key={getId(job) || `${job.jobTitle}-${index}`} className="group flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><BriefcaseBusiness size={17} /></span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-zinc-100 transition group-hover:text-blue-300">{job.jobTitle || 'Untitled role'}</p>
                                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-zinc-500"><Building2 size={13} />{job.companyName || 'Company not listed'}{job.location && <><span>·</span><MapPin size={12} />{job.location}</>}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={16} className="shrink-0 text-zinc-600 transition group-hover:text-blue-300" />
                                </Link>)}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-7 text-center">
                                <p className="text-sm font-medium text-zinc-300">{jobsResult.status === 'rejected' ? 'Jobs could not be loaded' : 'No jobs are listed yet'}</p>
                                <p className="mt-1 text-sm text-zinc-500">Check back soon for new opportunities.</p>
                            </div>
                        )}
                    </article>
                </section>

                <aside className="flex items-start gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/[0.04] p-5">
                    <Sparkles size={18} className="mt-0.5 shrink-0 text-blue-300" />
                    <div>
                        <h2 className="text-sm font-medium text-zinc-200">Keep your search moving</h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-500">Check back regularly for fresh roles and revisit your applications to stay up to date on their progress.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
