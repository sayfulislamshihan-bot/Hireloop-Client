'use client';

import React from 'react';
import { Table, Button, Badge } from '@heroui/react';
// Assuming gravity-ui/icons are installed and imported like this
import { CircleArrowDownFill } from '@gravity-ui/icons';
import { updateCompany } from '@/lib/actions/companies';

const CompanyTable = ({ companies }) => {

    const handleApprove = async (id) => {
        const result = await updateCompany(id, { status: 'Approved' })
        if (result.modifiedCount) {
            console.log(`Approved company with ID: ${id}`, result);
        }
    };

    const handleReject = async (id) => {
        const result = await updateCompany(id, { status: 'Rejected' })
    };

    // Helper to format date cleanly like "Oct 12, 2023"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    };

    // Status mapping for visual styling
    const getStatusDetails = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return { color: 'text-emerald-500', label: 'Approved' };
            case 'rejected':
                return { color: 'text-rose-500', label: 'Rejected' };
            case 'pending':
            default:
                return { color: 'text-amber-500', label: 'Pending' };
        }
    };

    // Helper to generate initials for the placeholder icon
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CO';
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416] p-4 text-zinc-200 sm:p-6">
            <Table
                className="w-full"
                classNames={{
                    base: 'bg-transparent',
                    table: 'border-collapse',
                    thead: '[&>tr]:border-b [&>tr]:border-zinc-800/80',
                    th: 'bg-transparent text-zinc-500 font-medium text-xs uppercase tracking-wide py-4 border-b border-zinc-800/80',
                    tr: 'border-b border-zinc-800/70 transition-colors last:border-none hover:bg-zinc-900/40',
                    td: 'py-4 align-middle text-sm text-zinc-300',
                }}
            >
                <Table.ScrollContainer>
                    <Table.Content aria-label="Company approval management table">
                        <Table.Header>
                            {/* Add the isRowHeader prop to your primary identifying column */}
                            <Table.Column isRowHeader className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80">
                                Company Name
                            </Table.Column>

                            <Table.Column className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80">
                                Recruiter Email
                            </Table.Column>

                            <Table.Column className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80">
                                Industry
                            </Table.Column>

                            <Table.Column className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80">
                                Status
                            </Table.Column>

                            <Table.Column className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80">
                                Date Submitted
                            </Table.Column>

                            <Table.Column className="text-zinc-500 font-medium pb-4 border-b border-zinc-800/80 text-right">
                                Actions
                            </Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {companies.map((company) => {
                                const companyId = company._id?.$oid || company._id;
                                const statusInfo = getStatusDetails(company.status);

                                return (
                                    <Table.Row key={companyId} className="border-b border-zinc-800/70 hover:bg-zinc-900/40 transition-colors">
                                        {/* Company Avatar & Name */}
                                        <Table.Cell className="py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-10 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-sm font-semibold tracking-wider text-blue-300">
                                                    {getInitials(company.name)}
                                                </div>
                                                <span className="font-medium text-zinc-100">{company.name}</span>
                                            </div>
                                        </Table.Cell>

                                        {/* Recruiter Email Placeholder */}
                                        <Table.Cell className="py-4 align-middle text-zinc-400">
                                            {company.recruiterEmail || `recruiter@${company.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                        </Table.Cell>

                                        {/* Industry Pill */}
                                        <Table.Cell className="py-4 align-middle">
                                            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs capitalize text-zinc-400">
                                                {company.industry}
                                            </span>
                                        </Table.Cell>

                                        {/* Status Dot */}
                                        <Table.Cell className="py-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <CircleArrowDownFill className={`w-2 h-2 ${statusInfo.color}`} />
                                                <span className={`text-sm font-medium ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </Table.Cell>

                                        {/* Date Submitted */}
                                        <Table.Cell className="py-4 align-middle text-neutral-400">
                                            {formatDate(company.createdAt?.$date || company.createdAt)}
                                        </Table.Cell>

                                        {/* Actions Panel */}
                                        <Table.Cell className="py-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                {company.status?.toLowerCase() !== 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        onClick={() => handleApprove(companyId)}
                                                        className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                {company.status?.toLowerCase() !== 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        onClick={() => handleReject(companyId)}
                                                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                                                    >
                                                        Reject
                                                    </Button>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </div>
    );
};

export default CompanyTable;
