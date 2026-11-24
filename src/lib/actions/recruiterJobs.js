'use server';

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const createRecruiterJob = async (jobData) => {
    const result = await serverMutation('/api/recruiter/jobs', jobData);

    if (result?.insertedId) {
        revalidatePath('/jobs');
        revalidatePath('/dashboard/recruiter/jobs');
    }

    return result;
};
