import { BadgeCheck, Mail, Users, UserRound } from 'lucide-react';
import { getAllUsers } from '@/lib/api/allUsers';

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value?.$date ?? value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

const displayValue = (value) => value || '—';

export default async function AdminUsersPage() {
    let users = [];
    let hasError = false;

    try {
        const result = await getAllUsers();
        if (Array.isArray(result)) {
            users = result.filter((user) => ['seeker', 'recruiter'].includes(user?.role?.toLowerCase()));
        } else {
            hasError = true;
        }
    } catch {
        hasError = true;
    }

    const seekerCount = users.filter((user) => user.role?.toLowerCase() === 'seeker').length;
    const recruiterCount = users.filter((user) => user.role?.toLowerCase() === 'recruiter').length;

    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-sm font-medium text-blue-400">Admin workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Users</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">View registered seeker and recruiter accounts across Hireloop.</p>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-3" aria-label="User counts">
                    <StatCard icon={Users} label="Total accounts" value={users.length} />
                    <StatCard icon={UserRound} label="Seekers" value={seekerCount} />
                    <StatCard icon={BadgeCheck} label="Recruiters" value={recruiterCount} />
                </section>

                <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="font-semibold text-zinc-100">Registered accounts</h2>
                            <p className="mt-1 text-sm text-zinc-500">{users.length} seeker and recruiter{users.length === 1 ? '' : 's'}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400"><Users size={14} />Live account data</span>
                    </div>

                    {hasError ? (
                        <div className="px-6 py-12 text-center">
                            <p className="font-medium text-zinc-200">Could not load user accounts</p>
                            <p className="mt-1 text-sm text-zinc-500">The user service did not return account data. Please try again later.</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="font-medium text-zinc-200">No seeker or recruiter accounts found</p>
                            <p className="mt-1 text-sm text-zinc-500">Registered accounts will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Email status</th>
                                        <th className="px-6 py-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/80">
                                    {users.map((user, index) => {
                                        const role = user.role.toLowerCase();
                                        const name = user.name?.trim() || 'Unnamed user';
                                        const initial = name === 'Unnamed user' ? '?' : name.charAt(0).toUpperCase();
                                        const id = user._id?.$oid || user._id || user.id || user.email || `${role}-${index}`;
                                        return (
                                            <tr key={String(id)} className="transition hover:bg-zinc-900/40">
                                                <td className="px-6 py-4">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 font-semibold text-blue-300">{initial}</span>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-zinc-100">{name}</p>
                                                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-zinc-500"><Mail size={12} />{displayValue(user.email)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${role === 'recruiter' ? 'border-violet-500/20 bg-violet-500/10 text-violet-300' : 'border-blue-500/20 bg-blue-500/10 text-blue-300'}`}>{role}</span></td>
                                                <td className="px-6 py-4 text-sm text-zinc-300">{displayValue(user.plan)}</td>
                                                <td className="px-6 py-4"><span className={`text-sm ${user.emailVerified === true ? 'text-emerald-300' : user.emailVerified === false ? 'text-amber-300' : 'text-zinc-500'}`}>{user.emailVerified === true ? 'Verified' : user.emailVerified === false ? 'Unverified' : 'Unknown'}</span></td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">{formatDate(user.createdAt)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
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
