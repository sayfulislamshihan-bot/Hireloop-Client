import Link from "next/link";
import { ArrowRight } from "@gravity-ui/icons";
import { getJobs } from "@/lib/api/jobs";
import JobCard from "@/components/jobs/JobCard";

export default async function LandingPageJobs() {
  let jobs = [];

  try {
    const result = await getJobs();
    if (Array.isArray(result)) {
      jobs = result.slice(0, 6);
    }
  } catch (error) {
    console.error("Unable to load jobs for the landing page:", error);
  }

  return (
    <section className="bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Find your next role
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Browse jobs
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Explore the latest opportunities from companies hiring on HireLoop.
            </p>
          </div>

          <Link
            href="/jobs"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-400 hover:bg-violet-400/10"
          >
            Browse all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <JobCard
                key={job._id?.$oid || job._id || job.id || `${job.jobTitle}-${index}`}
                job={job}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-zinc-200">
              No jobs are available right now
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Check back soon for new opportunities.
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
          >
            View all open positions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
