'use server'

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const createJob = async (newJobData) => {
        const result = await serverMutation('/api/jobs', newJobData);

        if (result?.insertedId) {
            revalidatePath('/jobs');
            revalidatePath('/dashboard/recruiter/jobs');
        }

        return result;
}
// export const createJob = async (newJobData) => {
//     const res = await fetch(`${baseUrl}/api/jobs`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newJobData),
//     });

//     return res.json();
// }
