
import JobListingContainer from "@/components/jobs/JobListingContainer";
import { getJobs } from "@/lib/api/jobs";

export default async function Page() {
  // Fetched server-side on the initial request
  const jobs = await getJobs();

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Open Positions</h1>
        <p className="text-zinc-400 mt-2">Discover your next engineering challenge.</p>
      </div>

      {/* Pass data to the Client Wrapper to handle filtering interactivity */}
      <JobListingContainer initialJobs={jobs || []} />
    </div>
  );
}




// import JobCard from "@/components/jobs/JobCard";
// import { getJobs } from "@/lib/api/jobs";



// const sampleData = {
//     _id: { $oid: "6a20319eaf8692fc9374958d" },
//     jobTitle: "Cloud Solutions Architect",
//     companyName: "Microsoft",
//     companyLogo: "https://i.ibb.co/kVBxB7cD/microsoft.png",
//     jobType: "full-time",
//     minSalary: "160000",
//     maxSalary: "220000",
//     location: "USA",
//     responsibilities: "Design enterprise cloud solutions.",
//     requirements: "Azure, AWS, architecture design",
//     benefits: "Stock options",
//     isRemote: false
// };

// export default async function Page() {

//     const jobs = await getJobs();

//     return (
//         <div className="p-8 bg-zinc-950 min-h-screen flex justify-center items-center">
//             <h2>jobs: {jobs.length}</h2>
//             <JobCard job={jobs[17]} />
//         </div>
//     );
// }