import { Factory, Globe, MapPin, Persons } from "@gravity-ui/icons";
import { getAllCompanies } from "@/lib/api/allCompanies";

function getCompanyId(company) {
  return company?._id?.$oid || company?._id || company?.id || company?.name;
}

export default async function CompaniesPage() {
  let companies = [];
  let hasError = false;

  try {
    const result = await getAllCompanies();
    if (Array.isArray(result)) {
      // Only approved companies belong in the public directory.
      companies = result.filter(
        (company) => company.status?.toLowerCase() === "approved",
      );
    } else {
      hasError = true;
    }
  } catch {
    hasError = true;
  }

  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Explore employers
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Companies
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Discover the companies hiring through HireLoop.
          </p>
        </header>

        {hasError ? (
          <div className="rounded-2xl border border-rose-900/60 bg-rose-950/20 p-6 text-sm text-rose-200">
            Company listings couldn’t be loaded. Please try again later.
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <Factory className="mx-auto h-8 w-8 text-zinc-500" />
            <h2 className="mt-4 text-lg font-semibold">No companies listed yet</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Approved company profiles will appear here.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-zinc-500">
              {companies.length} {companies.length === 1 ? "company" : "companies"}
            </p>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => {
                const companyId = getCompanyId(company);
                const website = company.websiteUrl
                  ? /^https?:\/\//i.test(company.websiteUrl)
                    ? company.websiteUrl
                    : `https://${company.websiteUrl}`
                  : null;

                return (
                  <li
                    key={companyId}
                    className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-zinc-700 hover:bg-zinc-900"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2">
                        {company.logo ? (
                          // Company logos come from the company profile API.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={company.logo}
                            alt={`${company.name || "Company"} logo`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Factory className="h-6 w-6 text-zinc-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-white">
                          {company.name || "Unnamed company"}
                        </h2>
                        {company.industry && (
                          <p className="mt-1 text-sm capitalize text-violet-300">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>

                    {(company.location || company.employeeCount) && (
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
                        {company.location && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-zinc-500" />
                            {company.location}
                          </span>
                        )}
                        {company.employeeCount && (
                          <span className="inline-flex items-center gap-2">
                            <Persons className="h-4 w-4 text-zinc-500" />
                            {company.employeeCount} employees
                          </span>
                        )}
                      </div>
                    )}

                    {company.description && (
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-400">
                        {company.description}
                      </p>
                    )}

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-violet-300 transition hover:text-violet-200"
                      >
                        <Globe className="h-4 w-4" />
                        Visit website
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
