import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CreditCard,
    Mail,
    ShieldCheck,
    SlidersHorizontal,
    Users,
} from 'lucide-react';
import { getUserSession } from '@/lib/core/session';

const AdminTool = ({ href, icon: Icon, title, description, label }) => (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#141416] p-4 transition hover:border-zinc-700 hover:bg-[#19191c] sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"><Icon size={19} /></span>
        <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 font-medium text-zinc-100">{title}{label && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] font-normal text-zinc-400">{label}</span>}</span>
            <span className="mt-1 block text-sm leading-5 text-zinc-500">{description}</span>
        </span>
        <ArrowRight size={17} className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
    </Link>
);

export default async function AdminSettingsPage() {
    const user = await getUserSession();
    const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'A';
    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
    const joined = createdAt && !Number.isNaN(createdAt.getTime())
        ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(createdAt)
        : 'Not available';

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-sm font-medium text-blue-400">Admin workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review your administrator account and jump to the platform areas you manage.</p>
                    </div>
                </header>

                <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-zinc-100">Administrator account</h2>
                            <p className="mt-1 text-sm text-zinc-500">Current signed-in account details</p>
                        </div>
                        <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><ShieldCheck size={19} /></span>
                    </div>

                    <div className="mt-5 flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:p-5">
                        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-lg font-semibold text-blue-300">{initials}</span>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-semibold text-zinc-100">{user?.name || 'Administrator'}</h3>
                            <p className="mt-1 flex items-center gap-2 break-all text-sm text-zinc-400"><Mail size={15} className="shrink-0 text-zinc-500" />{user?.email || 'Email unavailable'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs capitalize text-violet-300"><ShieldCheck size={13} />{user?.role || 'Admin'} role</span>
                            {user?.emailVerified === true && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"><BadgeCheck size={13} />Email verified</span>}
                        </div>
                    </div>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <AccountDetail label="Account email" value={user?.email || 'Not available'} />
                        <AccountDetail label="Administrator since" value={joined} />
                    </dl>
                </section>

                <section>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={17} className="text-zinc-500" />
                            <h2 className="text-lg font-semibold text-zinc-100">Platform management</h2>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500">Open the admin tools for the main areas of Hireloop.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <AdminTool href="/dashboard/admin/users" icon={Users} title="User accounts" description="Review seeker and recruiter account information." />
                        <AdminTool href="/dashboard/admin/companies" icon={Building2} title="Company review" description="Review company profiles and their approval status." />
                        <AdminTool href="/dashboard/admin/jobs" icon={BriefcaseBusiness} title="Jobs and applications" description="Review job listings and submitted applications." />
                        <AdminTool href="/dashboard/admin/payments" icon={CreditCard} title="Payments and subscriptions" description="Review subscription history and plan prices." />
                    </div>
                </section>

                <aside className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-[#141416] p-5">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-zinc-500" />
                    <div>
                        <h2 className="text-sm font-medium text-zinc-200">Access and preferences</h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-500">Admin pages are available to signed-in administrator accounts. Account editing, notification preferences, and password controls are not currently provided in the admin settings area.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}

function AccountDetail({ label, value }) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-1 break-all text-sm font-medium text-zinc-200">{value}</dd>
        </div>
    );
}
