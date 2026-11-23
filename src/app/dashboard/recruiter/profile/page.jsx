import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Building2, CreditCard, Globe2, Mail, MapPin, PencilLine } from 'lucide-react';
import { getRecruiterCompany } from '@/lib/api/companies';
import { getPlanById } from '@/lib/api/plans';
import { getUserSession } from '@/lib/core/session';

const initialsFor = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'R';
const display = (value) => value || 'Not provided';

const Detail = ({ label, value }) => (
    <div className="flex flex-col gap-1 border-b border-zinc-800/80 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <dt className="shrink-0 text-sm text-zinc-500">{label}</dt>
        <dd className="break-all text-sm font-medium text-zinc-200 sm:text-right">{display(value)}</dd>
    </div>
);

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><Icon size={19} /></span>
        <div>
            <h2 className="font-semibold text-zinc-100">{title}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>
        </div>
    </div>
);

export default async function RecruiterProfilePage() {
    const user = await getUserSession();
    const results = await Promise.allSettled([
        user?.id ? getRecruiterCompany(user.id) : Promise.resolve(null),
        user?.plan ? getPlanById(user.plan) : Promise.resolve(null),
    ]);
    const companyResult = results[0].status === 'fulfilled' ? results[0].value : null;
    const planResult = results[1].status === 'fulfilled' ? results[1].value : null;
    const company = companyResult && !companyResult.message ? companyResult : null;
    const plan = planResult && !planResult.message ? planResult : null;
    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
    const joinedLabel = createdAt && !Number.isNaN(createdAt.getTime())
        ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(createdAt)
        : 'Not available';
    const planName = plan?.name || plan?.title || user?.plan || 'No plan selected';
    const planFeatures = Array.isArray(plan?.features) ? plan.features : [];

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-400">Recruiter account</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your profile</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Review your personal details, company information, and the plan connected to your Hireloop account.</p>
                        </div>
                        <Link href="/dashboard/recruiter/company" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 sm:self-center">
                            <PencilLine size={16} /> Manage company profile
                        </Link>
                    </div>
                </header>

                <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <div className="flex items-center gap-4">
                            <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl font-semibold text-blue-300">{initialsFor(user?.name)}</div>
                            <div className="min-w-0">
                                <h2 className="truncate text-xl font-semibold text-zinc-100">{user?.name || 'Recruiter'}</h2>
                                <p className="mt-1 truncate text-sm text-zinc-400">{user?.email || 'Email unavailable'}</p>
                                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs capitalize text-emerald-300"><BadgeCheck size={13} />{user?.role || 'Recruiter'} account</span>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-zinc-800 pt-3">
                            <dl>
                                <Detail label="Full name" value={user?.name} />
                                <Detail label="Email address" value={user?.email} />
                                <Detail label="Account role" value={user?.role} />
                                <Detail label="Member since" value={joinedLabel} />
                            </dl>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <SectionHeading icon={Building2} title="Company information" subtitle="Company profile associated with your recruiter account" />
                        {company ? <>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-semibold text-zinc-100">{company.name || 'Company name not provided'}</h3>
                                {company.status && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">{company.status}</span>}
                            </div>
                            {company.description && <p className="mt-3 text-sm leading-6 text-zinc-400">{company.description}</p>}
                            <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                                <div className="flex items-start gap-2"><Globe2 size={15} className="mt-3.5 shrink-0 text-zinc-500" /><div className="min-w-0 flex-1"><Detail label="Website" value={company.websiteUrl} /></div></div>
                                <div className="flex items-start gap-2"><MapPin size={15} className="mt-3.5 shrink-0 text-zinc-500" /><div className="min-w-0 flex-1"><Detail label="Location" value={company.location} /></div></div>
                                <Detail label="Industry" value={company.industry} />
                                <Detail label="Company size" value={company.employeeCount} />
                            </dl>
                        </> : <div className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5">
                            <p className="text-sm font-medium text-zinc-200">No company profile found</p>
                            <p className="mt-1 text-sm leading-5 text-zinc-500">Add your organization details to complete your recruiter profile.</p>
                            <Link href="/dashboard/recruiter/company" className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300">Set up company profile <ArrowUpRight size={15} /></Link>
                        </div>}
                    </article>
                </section>

                <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <SectionHeading icon={CreditCard} title="Subscription and plan" subtitle="Plan details saved on your account" />
                        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-5">
                            <p className="text-xs font-medium uppercase tracking-wider text-blue-300/80">Current plan</p>
                            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                                <h3 className="text-2xl font-semibold text-zinc-50">{planName}</h3>
                                {plan?.price != null && <p className="text-lg font-medium text-zinc-200">{plan.price}<span className="ml-1 text-sm font-normal text-zinc-500">{plan.period || ''}</span></p>}
                            </div>
                            {plan?.description && <p className="mt-3 text-sm leading-6 text-zinc-400">{plan.description}</p>}
                            {!plan && <p className="mt-3 text-sm leading-6 text-zinc-400">This plan name comes from your account. Plan pricing and feature details aren’t available for this saved plan.</p>}
                        </div>
                        {planFeatures.length > 0 && <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                            {planFeatures.map((feature, index) => <li key={`${feature}-${index}`} className="flex items-start gap-2 text-sm text-zinc-300"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />{feature}</li>)}
                        </ul>}
                        <Link href="/plans" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300">Explore plans <ArrowUpRight size={15} /></Link>
                    </article>

                    <aside className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                        <SectionHeading icon={BriefcaseBusiness} title="Recruiter workspace" subtitle="Shortcuts for managing your hiring presence" />
                        <div className="mt-5 space-y-3">
                            <Link href="/dashboard/recruiter/jobs" className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900">
                                <span><span className="block text-sm font-medium text-zinc-200">Manage job posts</span><span className="mt-1 block text-xs text-zinc-500">Review roles published by your company</span></span><ArrowUpRight size={16} className="shrink-0 text-zinc-500" />
                            </Link>
                            <Link href="/dashboard/recruiter/jobs/new" className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900">
                                <span><span className="block text-sm font-medium text-zinc-200">Create a job post</span><span className="mt-1 block text-xs text-zinc-500">Add a new role to your hiring pipeline</span></span><ArrowUpRight size={16} className="shrink-0 text-zinc-500" />
                            </Link>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-zinc-500"><Mail size={14} className="mt-0.5 shrink-0" />Application history is not shown here because this account is a recruiter; candidate applications are not currently exposed as recruiter profile data.</p>
                    </aside>
                </section>
            </div>
        </main>
    );
}
