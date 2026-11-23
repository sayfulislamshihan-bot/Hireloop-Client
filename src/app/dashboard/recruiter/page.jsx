'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Building2, CreditCard, Mail, Settings2, UserRound } from 'lucide-react';

const initialsFor = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'R';

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 border-b border-zinc-800/80 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
        <dt className="text-sm text-zinc-500">{label}</dt>
        <dd className="break-all text-sm font-medium text-zinc-200">{value || 'Not provided'}</dd>
    </div>
);

const RecruiterDashboardHomePage = () => {
    const { data: session, isPending } = useSession();
    const user = session?.user;

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#0d0d0e] text-zinc-400">
                <Spinner />
                <span className="text-sm">Loading your dashboard…</span>
            </div>
        );
    }

    const quickLinks = [
        { href: '/dashboard/recruiter/jobs/new', title: 'Post a job', description: 'Create a new opening for your team.', icon: BriefcaseBusiness },
        { href: '/dashboard/recruiter/company', title: 'Company profile', description: 'Review or update your company details.', icon: Building2 },
        { href: '/plans', title: 'Plans and billing', description: 'View the available Hireloop plans.', icon: CreditCard },
    ];

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-400">Recruiter workspace</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Manage your recruiter account and get to the tools you need to keep hiring moving.</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-700/70 bg-black/20 p-3 pr-5">
                            <div className="grid size-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-300">{initialsFor(user?.name)}</div>
                            <div className="min-w-0">
                                <p className="max-w-52 truncate font-medium text-zinc-100">{user?.name || 'Recruiter'}</p>
                                <p className="mt-0.5 text-sm capitalize text-zinc-400">{user?.role || 'Recruiter'} account</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><UserRound size={19} /></span>
                            <div>
                                <h2 className="font-semibold text-zinc-100">Personal information</h2>
                                <p className="mt-0.5 text-sm text-zinc-500">Details from your Hireloop account</p>
                            </div>
                        </div>
                        <dl className="mt-5">
                            <InfoRow label="Full name" value={user?.name} />
                            <InfoRow label="Email address" value={user?.email} />
                            <InfoRow label="Account type" value={user?.role} />
                            <InfoRow label="Plan" value={user?.plan} />
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400"><BadgeCheck size={19} /></span>
                            <div>
                                <h2 className="font-semibold text-zinc-100">Account overview</h2>
                                <p className="mt-0.5 text-sm text-zinc-500">Your current sign-in profile</p>
                            </div>
                        </div>
                        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Signed in as</p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-200"><Mail size={16} className="shrink-0 text-zinc-500" /><span className="break-all">{user?.email || 'Email unavailable'}</span></div>
                        </div>
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                            <CreditCard size={17} className="mt-0.5 shrink-0 text-zinc-500" />
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Current plan</p>
                                <p className="mt-1 text-sm text-zinc-500">{user?.plan || 'No plan is listed on this account yet.'}</p>
                            </div>
                        </div>
                        <Link href="/plans" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300">View plans <ArrowUpRight size={15} /></Link>
                    </article>
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-100">Quick actions</h2>
                            <p className="mt-1 text-sm text-zinc-500">Shortcuts to your recruiter tools</p>
                        </div>
                        <Settings2 size={18} className="text-zinc-600" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {quickLinks.map(({ href, title, description, icon: Icon }) => (
                            <Link key={href} href={href} className="group rounded-2xl border border-zinc-800 bg-[#141416] p-5 transition hover:border-zinc-700 hover:bg-[#19191c]">
                                <div className="flex items-center justify-between">
                                    <span className="grid size-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"><Icon size={19} /></span>
                                    <ArrowUpRight size={17} className="text-zinc-600 transition group-hover:text-blue-300" />
                                </div>
                                <h3 className="mt-5 font-medium text-zinc-100">{title}</h3>
                                <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default RecruiterDashboardHomePage;
