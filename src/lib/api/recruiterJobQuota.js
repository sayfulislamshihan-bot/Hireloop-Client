import { protectedFetch } from "../core/server";

export const getRecruiterJobQuota = async () =>
    protectedFetch('/api/recruiter/job-posting-quota');
