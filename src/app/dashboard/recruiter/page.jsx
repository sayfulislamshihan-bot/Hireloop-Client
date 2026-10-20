'use client';
import React from 'react';
import { useSession } from "@/lib/auth-client";
import { Briefcase, Persons, Thunderbolt, CircleCheck } from '@gravity-ui/icons';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Spinner } from '@heroui/react';
const RecruiterDashboardHomePage = () => {

    const { data: session, isPending } = useSession();

    if (isPending) {
        return  <div className="flex flex-col items-center gap-2">
        <Spinner className="animate-[spin_0.4s_linear_infinite] motion-reduce:animate-none" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    }

    const recruiterStats = [
        { title: "Total Job Posts", value: "48", icon: Briefcase },
        { title: "Total Applicants", value: "1,284", icon: Persons },
        { title: "Active Jobs", value: "18", icon: Thunderbolt },
        { title: "Jobs Closed", value: "32", icon: CircleCheck },
    ];

    const user = session?.user;
    console.log("Session data in RecruiterDashboardHomePage:", session);

    return (
        <div>
            <h2 className="text-4xl">Welcome back, {user?.name}</h2>
            <DashboardStats statsData={recruiterStats} />
        </div>
    );
};

export default RecruiterDashboardHomePage;