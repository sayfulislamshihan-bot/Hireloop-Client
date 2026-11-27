import Link from 'next/link';
import { ArrowUpRight, Calendar, CreditCard, Receipt } from '@gravity-ui/icons';
import { getAllSubscriptions } from '@/lib/api/allSubscriptions';
import { getPlanById } from '@/lib/api/plans';
import { getUserSession } from '@/lib/core/session';

const getRecordUserId = (record) => {
    const value = record?.userId ?? record?.seekerId ?? record?.applicantId;
    return typeof value === 'object' ? value?.$oid ?? value?.toString?.() : value;
};

const formatDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value?.$date ?? value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const readablePlanName = (planId) => {
    if (!planId) return 'Plan';
    return planId.replace(/^seeker_/, '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default async function SeekerBillingPage() {
    const user = await getUserSession();
    const [subscriptionsResult, planResult] = await Promise.allSettled([
        getAllSubscriptions(),
        getPlanById(user?.plan || 'seeker_free'),
    ]);

    const allSubscriptions = subscriptionsResult.status === 'fulfilled' && Array.isArray(subscriptionsResult.value)
        ? subscriptionsResult.value
        : [];
    const userId = String(user?.id ?? '');
    const email = user?.email?.trim().toLowerCase();
    const subscriptions = allSubscriptions
        .filter((record) => {
            const recordUserId = getRecordUserId(record);
            if (recordUserId && userId && String(recordUserId) === userId) return true;
            return Boolean(email && record?.email?.trim().toLowerCase() === email);
        })
        .sort((a, b) => new Date(b.createdAt?.$date ?? b.createdAt ?? 0) - new Date(a.createdAt?.$date ?? a.createdAt ?? 0));

    const planData = planResult.status === 'fulfilled' ? planResult.value : null;
    const plan = planData && !planData.message ? planData : null;
    const planName = plan?.name || plan?.title || readablePlanName(user?.plan || 'seeker_free');
    const planPrice = plan?.price;
    const planPeriod = plan?.period;
    const features = Array.isArray(plan?.features) ? plan.features : [];

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <header>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Account</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">Billing</h1>
                    <p className="mt-2 text-sm text-zinc-400">Review your current plan and subscription activity.</p>
                </header>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6" aria-labelledby="current-plan-heading">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-blue-400"><CreditCard className="h-5 w-5" /></div>
                            <div>
                                <p className="text-sm text-zinc-400">Current plan</p>
                                <h2 id="current-plan-heading" className="mt-1 text-2xl font-semibold">{planName}</h2>
                                {planPrice != null && <p className="mt-1 text-sm text-zinc-300">{planPrice}{planPeriod ? ` ${planPeriod}` : ''}</p>}
                                {plan?.description && <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{plan.description}</p>}
                            </div>
                        </div>
                        <Link href="/plans" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500">
                            Change plan <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {features.length > 0 && (
                        <ul className="mt-6 grid gap-2 border-t border-zinc-800 pt-5 sm:grid-cols-2">
                            {features.map((feature, index) => <li key={`${feature}-${index}`} className="flex items-start gap-2 text-sm text-zinc-300"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />{feature}</li>)}
                        </ul>
                    )}
                    {!plan && <p className="mt-4 text-sm text-zinc-500">Plan details are unavailable right now. Your account plan is {planName}.</p>}
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6" aria-labelledby="subscription-history-heading">
                    <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-zinc-400" />
                        <div>
                            <h2 id="subscription-history-heading" className="text-lg font-semibold">Subscription history</h2>
                            <p className="mt-1 text-sm text-zinc-500">Plans recorded for your account.</p>
                        </div>
                    </div>
                    {subscriptions.length ? (
                        <ul className="mt-5 divide-y divide-zinc-800">
                            {subscriptions.map((subscription, index) => (
                                <li key={subscription._id?.$oid || subscription._id || `${subscription.planId}-${index}`} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-zinc-200">{readablePlanName(subscription.planId)}</p>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500"><Calendar className="h-4 w-4" />{formatDate(subscription.createdAt)}</p>
                                    </div>
                                    {index === 0 && <span className="rounded-full border border-emerald-900 bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-300">Latest</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-sm text-zinc-500">No subscription history is available for this account yet.</p>
                    )}
                </section>
            </div>
        </main>
    );
}
