import Link from 'next/link';
import { ArrowRight, BadgeCheck, Bell, BriefcaseBusiness, Building2, CreditCard, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { getRecruiterCompany } from '@/lib/api/companies';
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

export default async function RecruiterSettingsPage() {
    const user = await getUserSession();
    const results = await Promise.allSettled([
        user?.id ? getRecruiterCompany(user.id) : Promise.resolve(null),
        user?.plan ? getPlanById(user.plan) : Promise.resolve(null),
    ]);
    const companyData = results[0].status === 'fulfilled' ? results[0].value : null;
    const planData = results[1].status === 'fulfilled' ? results[1].value : null;
    const company = companyData && !companyData.message ? companyData : null;
    const plan = planData && !planData.message ? planData : null;
    const planName = plan?.name || plan?.title || user?.plan || 'No plan selected';
    const verified = user?.emailVerified;

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-sm font-medium text-blue-400">Recruiter workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review your account and manage the recruiter settings available in Hireloop.</p>
                    </div>
                </header>

                <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-zinc-100">Account snapshot</h2>
                            <p className="mt-1 text-sm text-zinc-500">Current details from your signed-in account</p>
                        </div>
                        <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><UserRound size={19} /></span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <SummaryItem icon={UserRound} label="Name" value={user?.name} />
                        <SummaryItem icon={Mail} label="Email" value={user?.email} />
                        <SummaryItem icon={ShieldCheck} label="Account role" value={user?.role || 'Recruiter'} />
                        <SummaryItem icon={Building2} label="Company" value={company?.name || 'No company profile'} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm">
                        <span className="flex items-center gap-2 text-zinc-400"><BadgeCheck size={16} className={verified ? 'text-emerald-400' : 'text-amber-400'} />Email status</span>
                        <span className={verified ? 'text-emerald-300' : 'text-amber-300'}>{verified === true ? 'Verified' : verified === false ? 'Not verified' : 'Status unavailable'}</span>
                        {company?.status && <><span className="hidden text-zinc-700 sm:inline">•</span><span className="text-zinc-400">Company review: <span className="text-zinc-200">{company.status}</span></span></>}
                    </div>
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-100">Account and organization</h2>
                        <p className="mt-1 text-sm text-zinc-500">Open the pages where you can review or update your information.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <SettingLink href="/dashboard/recruiter/profile" icon={UserRound} title="Personal profile" description="Review the name, email, and account details on your profile." />
                        <SettingLink href="/dashboard/recruiter/company" icon={Building2} title="Company profile" description="Manage your company information and review status." detail={company?.status || 'Set up'} />
                    </div>
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-100">Hiring and subscription</h2>
                        <p className="mt-1 text-sm text-zinc-500">Manage the recruiter services connected to your account.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <SettingLink href="/dashboard/recruiter/jobs" icon={BriefcaseBusiness} title="Job posts" description="Review and manage your company’s hiring posts." />
                        <SettingLink href="/plans" icon={CreditCard} title="Plan and subscription" description="See available plans and checkout options." detail={planName} />
                    </div>
                </section>

                <aside className="flex gap-3 rounded-2xl border border-zinc-800 bg-[#141416] p-5">
                    <Bell size={18} className="mt-0.5 shrink-0 text-zinc-500" />
                    <div>
                        <h2 className="text-sm font-medium text-zinc-200">Notification preferences</h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-500">Notification preferences and password controls are not currently available in the recruiter settings data. This page only reflects information the app can read today.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
