import Link from 'next/link';
import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CreditCard,
    FileText,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { getAdminApplications } from '@/lib/api/applications';
import { getCompanies } from '@/lib/api/companies';
import { getAllSubscriptions } from '@/lib/api/allSubscriptions';
import { getAllUsers } from '@/lib/api/allUsers';
import { getJobs } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';

const asList = (value) => Array.isArray(value) ? value : [];
const getDate = (value) => value?.$date ?? value ?? null;

const formatDate = (value) => {
    const dateValue = getDate(value);
    if (!dateValue) return 'Date unavailable';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getId = (item) => item?._id?.$oid || item?._id || item?.id;

const AdminStat = ({ href, icon: Icon, label, value, detail, accent = 'blue' }) => (
    <Link href={href} className="group rounded-2xl border border-zinc-800 bg-[#141416] p-5 transition hover:border-zinc-700 hover:bg-[#19191c]">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm text-zinc-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
            </div>
            <span className={`grid size-10 place-items-center rounded-xl ${accent === 'amber' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'}`}><Icon size={19} /></span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">{detail}</p>
            <ArrowUpRight size={15} className="shrink-0 text-zinc-700 transition group-hover:text-blue-300" />
        </div>
    </Link>
);

const QuickLink = ({ href, icon: Icon, title, description }) => (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#141416] p-4 transition hover:border-zinc-700 hover:bg-[#19191c]">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"><Icon size={18} /></span>
        <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-zinc-100">{title}</span>
            <span className="mt-1 block text-xs leading-5 text-zinc-500">{description}</span>
        </span>
        <ArrowRight size={16} className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
    </Link>
);

export default async function AdminDashboardHomePage() {
    const [user, results] = await Promise.all([
        getUserSession(),
        Promise.allSettled([
            getAllUsers(),
            getCompanies(),
            getJobs(),
            getAdminApplications(),
            getAllSubscriptions(),
        ]),
    ]);
    const [usersResult, companiesResult, jobsResult, applicationsResult, subscriptionsResult] = results;

    const users = usersResult.status === 'fulfilled' ? asList(usersResult.value) : [];
    const companies = companiesResult.status === 'fulfilled' ? asList(companiesResult.value) : [];
    const jobs = jobsResult.status === 'fulfilled' ? asList(jobsResult.value) : [];
    const applications = applicationsResult.status === 'fulfilled' ? asList(applicationsResult.value) : [];
    const subscriptions = subscriptionsResult.status === 'fulfilled' ? asList(subscriptionsResult.value) : [];
    const seekers = users.filter((item) => item.role?.toLowerCase() === 'seeker').length;
    const recruiters = users.filter((item) => item.role?.toLowerCase() === 'recruiter').length;
    const pendingCompanies = companies.filter((item) => item.status?.toLowerCase() === 'pending').length;
    const activeJobs = jobs.filter((item) => !item.status || item.status.toLowerCase() === 'active').length;
    const recentJobs = [...jobs].sort((a, b) => new Date(getDate(b.createdAt) || 0) - new Date(getDate(a.createdAt) || 0)).slice(0, 4);
    const recentApplications = [...applications].sort((a, b) => new Date(getDate(b.createdAt) || 0) - new Date(getDate(a.createdAt) || 0)).slice(0, 4);
    const unavailable = [usersResult, companiesResult, jobsResult, applicationsResult, subscriptionsResult]
        .filter((result) => result.status === 'rejected' || !Array.isArray(result.value)).length;
    const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'A';

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-400">Hireloop administration</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Monitor platform activity and get to the tools you need to manage users, companies, jobs, and subscriptions.</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-700/70 bg-black/20 p-3 pr-5">
                            <span className="grid size-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-300">{initials}</span>
                            <div className="min-w-0">
                                <p className="max-w-52 truncate font-medium text-zinc-100">{user?.name || 'Administrator'}</p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-sm capitalize text-zinc-400"><ShieldCheck size={14} />{user?.role || 'Admin'} account</p>
                            </div>
                        </div>
                    </div>
                </header>

                {unavailable > 0 && <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-sm text-amber-200">Some dashboard data could not be loaded. The available counts are shown below.</p>}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Platform overview">
                    <AdminStat href="/dashboard/admin/users" icon={Users} label="Registered users" value={users.length} detail={`${seekers} seekers · ${recruiters} recruiters`} />
                    <AdminStat href="/dashboard/admin/companies" icon={Building2} label="Companies" value={companies.length} detail={`${pendingCompanies} awaiting review`} accent={pendingCompanies ? 'amber' : 'blue'} />
                    <AdminStat href="/dashboard/admin/jobs" icon={BriefcaseBusiness} label="Active jobs" value={activeJobs} detail={`${jobs.length} total listings`} />
                    <AdminStat href="/dashboard/admin/jobs" icon={FileText} label="Applications" value={applications.length} detail="Submitted across all jobs" />
                    <AdminStat href="/dashboard/admin/payments" icon={CreditCard} label="Subscriptions" value={subscriptions.length} detail="Recorded plan subscriptions" />
                    <AdminStat href="/dashboard/admin/settings" icon={BadgeCheck} label="Admin tools" value="Open" detail="Review account and settings" />
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-100">Management shortcuts</h2>
                        <p className="mt-1 text-sm text-zinc-500">Jump to a section of the admin workspace.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <QuickLink href="/dashboard/admin/users" icon={Users} title="Manage users" description="Review seeker and recruiter accounts." />
                        <QuickLink href="/dashboard/admin/companies" icon={Building2} title="Review companies" description="Handle submitted company profiles." />
                        <QuickLink href="/dashboard/admin/jobs" icon={BriefcaseBusiness} title="Jobs and applications" description="Inspect listings and applicant activity." />
                        <QuickLink href="/dashboard/admin/payments" icon={CreditCard} title="Payment history" description="Track recorded subscriptions and plan prices." />
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-2">
                    <RecentPanel title="Recently posted jobs" href="/dashboard/admin/jobs" linkLabel="View jobs" empty="No job listings are available." icon={BriefcaseBusiness}>
                        {recentJobs.map((job, index) => <div key={getId(job) || `${job.jobTitle}-${index}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-zinc-200">{job.jobTitle || 'Untitled position'}</p>
                                <p className="mt-1 truncate text-xs text-zinc-500">{job.companyName || 'Company not listed'}{job.jobType ? ` · ${job.jobType}` : ''}</p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500"><CalendarDays size={13} />{formatDate(job.createdAt)}</span>
                        </div>)}
                    </RecentPanel>

                    <RecentPanel title="Recent applications" href="/dashboard/admin/jobs" linkLabel="View applications" empty="No application records are available." icon={FileText}>
                        {recentApplications.map((application, index) => <div key={getId(application) || `${application.applicantEmail}-${index}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-zinc-200">{application.applicantName || 'Applicant'}</p>
                                <p className="mt-1 truncate text-xs text-zinc-500">{application.jobTitle || 'Job title unavailable'} · {application.companyName || 'Company not listed'}</p>
                            </div>
                            <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] capitalize text-zinc-400">{application.status || 'Applied'}</span>
                        </div>)}
                    </RecentPanel>
                </section>
            </div>
        </main>
    );
}

function RecentPanel({ title, href, linkLabel, empty, icon: Icon, children }) {
    const hasItems = Boolean(children?.length);
    return (
        <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><Icon size={17} /></span>
                    <h2 className="font-semibold text-zinc-100">{title}</h2>
                </div>
                <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300">{linkLabel}<ArrowUpRight size={15} /></Link>
            </div>
            {hasItems ? <div className="divide-y divide-zinc-800">{children}</div> : <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">{empty}</p>}
        </article>
    );
}
