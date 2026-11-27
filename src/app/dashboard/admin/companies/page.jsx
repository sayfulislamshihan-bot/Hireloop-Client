import CompanyTable from '@/components/dashboard/CompanyTable';
import { getCompanies } from '@/lib/api/companies';
import { Building2 } from 'lucide-react';
import React from 'react';
const AdminCompaniesPage = async () => {
    const companies = await getCompanies();
    return (
        <main className="min-h-screen bg-[#0d0d0e] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#1a1b20] via-[#141416] to-[#101012] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-400">Admin workspace</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Companies</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Review organization profiles submitted by recruiters.</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-700/70 bg-black/20 p-3 pr-5">
                            <span className="grid size-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Building2 size={20} /></span>
                            <div>
                                <p className="text-xs text-zinc-500">Total submissions</p>
                                <p className="mt-0.5 text-lg font-semibold text-zinc-100">{companies.length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <CompanyTable companies={companies} />
            </div>
        </main>
    );
};

export default AdminCompaniesPage;
