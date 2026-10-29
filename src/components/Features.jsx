"use client";
import {
  Magnifier,
  ChartLine,
  ChartColumn,
  Bookmark,
  Sparkles,
  FileText,
  GeoPolygons,
  ArrowUpRight,
} from "@gravity-ui/icons";

export default function FeaturesPage() {
  const features = [
    {
      id: 1,
      icon: <Magnifier className="h-5 w-5" />,
      title: "Smart Search",
      description: "Find your ideal job with advanced filters.",
    },
    {
      id: 2,
      icon: <ChartLine className="h-5 w-5" />,
      title: "Salary Insights",
      description: "Get real salary data to negotiate confidently.",
    },
    {
      id: 3,
      icon: <ChartColumn className="h-5 w-5" />,
      title: "Top Companies",
      description: "Apply to vetted companies that are hiring.",
    },
    {
      id: 4,
      icon: <Bookmark className="h-5 w-5" />,
      title: "Saved Jobs",
      description: "Manage applications and favorites on your dashboard.",
    },
    {
      id: 5,
      icon: <Sparkles className="h-5 w-5" />,
      title: "One-Click Apply",
      description: "Simplify your job applications for an easier process!",
    },
    {
      id: 6,
      icon: <FileText className="h-5 w-5" />,
      title: "Resume Builder",
      description: "Create professional resumes with modern templates.",
    },
    {
      id: 7,
      icon: <GeoPolygons className="h-5 w-5" />,
      title: "Skill-Based Matching",
      description: "Discover jobs that match your skills and experience.",
    },
    {
      id: 8,
      icon: <ArrowUpRight className="h-5 w-5" />,
      title: "Career Growth Resources",
      description: "Boost your career with quick interview tips.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-[#141414] px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1 w-1 bg-violet-500" />

            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-300">
              Features&nbsp; Job
            </p>

            <span className="h-1 w-1 bg-violet-500" />
          </div>

          <h2 className="text-2xl font-medium leading-[1.15] tracking-tight sm:text-3xl">
            Everything you need
            <br />
            to succeed
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-x-7 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group flex items-start gap-3"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-gradient-to-br from-black via-[#080808] to-[#202020] text-[#e8b4f0] transition-colors duration-300 group-hover:border-violet-500/40 group-hover:text-violet-300">
                {feature.icon}
              </div>

              {/* Feature Content */}
              <div className="min-w-0 pt-0.5">
                <h3 className="mb-1 text-[11px] font-medium leading-4 text-white">
                  {feature.title}
                </h3>

                <p className="max-w-[190px] text-[10px] leading-[1.6] text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
