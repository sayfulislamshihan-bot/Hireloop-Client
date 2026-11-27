import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    Bell,
    BriefcaseBusiness,
    CreditCard,
    FileText,
    Mail,
    Search,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { getPlanById } from '@/lib/api/plans';
import { getUserSession } from '@/lib/core/session';

const SettingLink = ({ href, icon: Icon, title, description, detail }) => (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#141416] p-4 transition hover:border-zinc-700 hover:bg-[#19191c] sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"><Icon size={19} /></span>
        <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 font-medium text-zinc-100">{title}{detail && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] font-normal text-zinc-400">{detail}</span>}</span>
            <span className="mt-1 block text-sm leading-5 text-zinc-500">{description}</span>
        </span>
        <ArrowRight size={17} className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
    </Link>
);

const SummaryItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <Icon size={17} className="mt-0.5 shrink-0 text-zinc-500" />
        <div className="min-w-0">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 break-all text-sm font-medium text-zinc-200">{value || 'Not provided'}</p>
        </div>
    </div>
);

const readablePlanName = (planId) => planId
    ? planId.replace(/^seeker_/, '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    : 'Free';

export default async function SeekerSettingsPage() {
    const user = await getUserSession();
    const planId = user?.plan || 'seeker_free';
    const planResult = await Promise.allSettled([getPlanById(planId)]);
    const planData = planResult[0].status === 'fulfilled' ? planResult[0].value : null;
    const plan = planData && !planData.message ? planData : null;
    const planName = plan?.name || plan?.title || readablePlanName(planId);
    const verified = user?.emailVerified;
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
                        <p className="text-sm font-medium text-blue-400">Seeker workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review your account, subscription, and the tools connected to your job search.</p>
                    </div>
                </header>

                <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-zinc-100">Account snapshot</h2>
                            <p className="mt-1 text-sm text-zinc-500">Details from your signed-in Hireloop account</p>
                        </div>
                        <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><UserRound size={19} /></span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <SummaryItem icon={UserRound} label="Name" value={user?.name} />
                        <SummaryItem icon={Mail} label="Email" value={user?.email} />
                        <SummaryItem icon={ShieldCheck} label="Account role" value={user?.role || 'Seeker'} />
                        <SummaryItem icon={BadgeCheck} label="Member since" value={joined} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm">
                        <span className="flex items-center gap-2 text-zinc-400"><BadgeCheck size={16} className={verified ? 'text-emerald-400' : 'text-amber-400'} />Email status</span>
                        <span className={verified ? 'text-emerald-300' : 'text-amber-300'}>{verified === true ? 'Verified' : verified === false ? 'Not verified' : 'Status unavailable'}</span>
                    </div>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><CreditCard size={19} /></span>
                            <div>
                                <p className="text-sm text-zinc-500">Current subscription</p>
                                <h2 className="mt-1 text-xl font-semibold text-zinc-100">{planName}</h2>
                                {plan?.price != null && <p className="mt-1 text-sm text-zinc-400">{plan.price}{plan.period ? ` ${plan.period}` : ''}</p>}
                            </div>
                        </div>
                        <Link href="/dashboard/seeker/billing" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800">Manage billing <ArrowRight size={15} /></Link>
                    </div>
                    {plan?.description && <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{plan.description}</p>}
                    {!plan && <p className="mt-4 text-sm text-zinc-500">Plan details are unavailable right now. Your saved account plan is {planName}.</p>}
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-100">Your job search</h2>
                        <p className="mt-1 text-sm text-zinc-500">Quick access to the tools and activity that support your search.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <SettingLink href="/dashboard/seeker/applications" icon={FileText} title="Applications" description="Review roles you have applied to and their latest status." />
                        <SettingLink href="/dashboard/seeker/jobs" icon={Search} title="Browse jobs" description="Explore open roles and find your next opportunity." />
                        <SettingLink href="/dashboard/seeker/billing" icon={CreditCard} title="Plan and billing" description="Review your plan details and subscription history." detail={planName} />
                        <SettingLink href="/dashboard/seeker" icon={BriefcaseBusiness} title="Seeker dashboard" description="Return to your job seeker workspace." />
                    </div>
                </section>

                <aside className="flex gap-3 rounded-2xl border border-zinc-800 bg-[#141416] p-5">
                    <Bell size={18} className="mt-0.5 shrink-0 text-zinc-500" />
                    <div>
                        <h2 className="text-sm font-medium text-zinc-200">Profile and preferences</h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-500">Your account name and email are shown above. Profile editing, notification preferences, and password controls are not currently available in the seeker settings pages.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
