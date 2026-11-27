import { BadgeDollarSign, CalendarDays, CreditCard, Receipt, Users } from 'lucide-react';
import { getAllSubscriptions } from '@/lib/api/allSubscriptions';
import { getAllUsers } from '@/lib/api/allUsers';

const PLAN_PRICES = {
    seeker_free: 0,
    seeker_pro: 19,
    seeker_premium: 39,
    recruiter_free: 0,
    recruiter_growth: 49,
    recruiter_enterprise: 149,
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const formatDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value?.$date ?? value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

const readablePlanName = (planId = '') => planId
    .replace(/^(seeker|recruiter)_/, '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Unknown plan';

const formatMoney = (amount) => {
    if (amount == null) return 'Unavailable';
    return `$${amount}`;
};

export default async function AdminPaymentsPage() {
    const [subscriptionsResult, usersResult] = await Promise.allSettled([
        getAllSubscriptions(),
        getAllUsers(),
    ]);

    const subscriptions = subscriptionsResult.status === 'fulfilled' && Array.isArray(subscriptionsResult.value)
        ? subscriptionsResult.value
        : [];
    const users = usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)
        ? usersResult.value
        : [];
    const usersByEmail = new Map(users.map((user) => [normalizeEmail(user.email), user]));
    const history = subscriptions
        .map((record, index) => {
            const user = usersByEmail.get(normalizeEmail(record.email));
            const amount = Object.hasOwn(PLAN_PRICES, record.planId) ? PLAN_PRICES[record.planId] : null;
            return {
                ...record,
                rowKey: record._id?.$oid || record._id || `${record.email}-${record.planId}-${index}`,
                user,
                amount,
                planName: readablePlanName(record.planId),
            };
        })
        .sort((a, b) => new Date(b.createdAt?.$date ?? b.createdAt ?? 0) - new Date(a.createdAt?.$date ?? a.createdAt ?? 0));

    const calculableRecords = history.filter((record) => record.amount != null);
    const estimatedTotal = calculableRecords.reduce((total, record) => total + record.amount, 0);
    const paidSubscriptions = calculableRecords.filter((record) => record.amount > 0).length;
    const hasSubscriptionError = subscriptionsResult.status === 'rejected' || !Array.isArray(subscriptionsResult.value);
    const hasUserError = usersResult.status === 'rejected' || !Array.isArray(usersResult.value);

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-sm font-medium text-blue-400">Admin workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Payments and subscriptions</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review subscription history across seeker and recruiter accounts.</p>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-3" aria-label="Subscription totals">
                    <StatCard icon={BadgeDollarSign} label="Recorded plan total" value={formatMoney(estimatedTotal)} hint="Calculated using the fixed Hireloop plan prices" />
                    <StatCard icon={Receipt} label="Recorded subscriptions" value={history.length} hint="Subscription entries in Hireloop history" />
                    <StatCard icon={Users} label="Paid plan entries" value={paidSubscriptions} hint="Recorded entries with a non-zero plan price" />
                </section>

                <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="font-semibold text-zinc-100">Subscription history</h2>
                            <p className="mt-1 text-sm text-zinc-500">Plan and account details for each recorded subscription.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400"><CreditCard size={14} />{history.length} records</span>
                    </div>

                    {hasSubscriptionError ? (
                        <EmptyState title="Could not load subscription history" message="The subscription service did not return payment records. Please try again later." />
                    ) : history.length === 0 ? (
                        <EmptyState title="No subscriptions recorded" message="Successful subscription entries will appear here." />
                    ) : (
                        <>
                            {hasUserError && (
                                <p className="border-b border-amber-500/15 bg-amber-500/[0.04] px-5 py-3 text-sm text-amber-200 sm:px-6">
                                    Some account or plan details could not be loaded. Subscription entries are still shown where possible.
                                </p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                            <th className="px-6 py-4">Account</th>
                                            <th className="px-6 py-4">Plan</th>
                                            <th className="px-6 py-4">Plan price</th>
                                            <th className="px-6 py-4">Recorded</th>
                                            <th className="px-6 py-4">Entry</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/80">
                                        {history.map((record) => {
                                            const role = record.user?.role;
                                            const isRecruiter = role === 'recruiter';
                                            return (
                                                <tr key={String(record.rowKey)} className="transition hover:bg-zinc-900/40">
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-zinc-200">{record.user?.name || record.email || 'Account unavailable'}</p>
                                                        <p className="mt-1 text-xs text-zinc-500">{record.email || 'Email unavailable'}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-zinc-200">{record.planName}</p>
                                                        {role && <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] capitalize ${isRecruiter ? 'border-violet-500/20 bg-violet-500/10 text-violet-300' : 'border-blue-500/20 bg-blue-500/10 text-blue-300'}`}>{role}</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-zinc-200">{formatMoney(record.amount)}</td>
                                                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-sm text-zinc-400"><CalendarDays size={14} />{formatDate(record.createdAt)}</span></td>
                                                    <td className="px-6 py-4"><span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">Recorded</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="border-t border-zinc-800 px-5 py-4 text-xs leading-5 text-zinc-500 sm:px-6">
                                Plan prices are fixed here at seeker pro $19, seeker premium $39, recruiter growth $49, and recruiter enterprise $149. Free plans are $0. These values do not include refunds, taxes, or exact amounts charged at checkout.
                            </p>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

function StatCard({ icon: Icon, label, value, hint }) {
    return (
        <article className="rounded-2xl border border-zinc-800 bg-[#141416] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300"><Icon size={19} /></span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">{hint}</p>
        </article>
    );
}

function EmptyState({ title, message }) {
    return (
        <div className="px-6 py-12 text-center">
            <p className="font-medium text-zinc-200">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{message}</p>
        </div>
    );
}
