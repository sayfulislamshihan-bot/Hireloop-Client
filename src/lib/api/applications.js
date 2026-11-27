import { protectedFetch } from "../core/server";

export const getApplicationsByApplicant = async (applicantId) => {
    return protectedFetch(`/api/applications?applicantId=${applicantId}`);
}

export const getAdminApplications = async () => {
    return protectedFetch('/api/admin/applications');
}
