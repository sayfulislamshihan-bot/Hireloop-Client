"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  Person,
  Briefcase,
  Rocket,
  Star,
  Check,
  ArrowRight,
} from "@gravity-ui/icons";

export default function Plans() {
  const [billingTarget, setBillingTarget] = useState("seeker");

  const seekerPlans = [
    {
      id: "seeker_free",
      name: "Free",
      price: "$0",
      period: "/forever",
      description: "Get started with your job search.",
      icon: <Person className="h-4 w-4" />,
      features: [
        "Browse and save up to 10 jobs",
        "Apply to 3 jobs per month",
        "Basic profile page",
      ],
      popular: false,
    },
    {
      id: "seeker_pro",
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Accelerate your job search.",
      icon: <Star className="h-4 w-4" />,
      features: [
        "Apply to 30 jobs per month",
        "Unlimited saved jobs",
        "Advanced application tracking",
      ],
      popular: true,
    },
    {
      id: "seeker_premium",
      name: "Premium",
      price: "$39",
      period: "/month",
      description: "Get more visibility and support.",
      icon: <Rocket className="h-4 w-4" />,
      features: [
        "Unlimited applications",
        "Profile boost for recruiters",
        "Priority customer support",
      ],
      popular: false,
    },
  ];

  const recruiterPlans = [
    {
      id: "recruiter_free",
      name: "Free",
      price: "$0",
      period: "/forever",
      description: "Start hiring for your company.",
      icon: <Briefcase className="h-4 w-4" />,
      features: [
        "3 active job posts",
        "Basic applicant management",
        "Standard job listing visibility",
      ],
      popular: false,
    },
    {
      id: "recruiter_growth",
      name: "Growth",
      price: "$49",
      period: "/month",
      description: "Grow your hiring operations.",
      icon: <Rocket className="h-4 w-4" />,
      features: [
        "10 active job posts",
        "Applicant tracking workflow",
        "Listing analytics",
      ],
      popular: true,
    },
    {
      id: "recruiter_enterprise",
      name: "Enterprise",
      price: "$149",
      period: "/month",
      description: "Scale hiring across your teams.",
      icon: <Star className="h-4 w-4" />,
      features: [
        "50 active job posts",
        "Advanced analytics",
        "Team collaboration",
      ],
      popular: false,
    },
  ];

  const plans =
    billingTarget === "seeker" ? seekerPlans : recruiterPlans;

  return (
    <section className="relative isolate overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-30 blur-sm"
        style={{
          backgroundImage: "url('/images/globe.png')",
        }}
      />

      {/* Dark Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/75"
      />

      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-20 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-1 w-1 bg-violet-500" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300">
              Pricing Plans
            </span>
            <span className="h-1 w-1 bg-violet-500" />
          </div>

          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Pay for the leverage,
            <br />
            not the listings
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
            Simple plans for ambitious job seekers and growing
            companies. Find the right fit for your goals.
          </p>
        </div>

        {/* Audience Toggle */}
        <div className="mt-8 flex justify-center">
          <div
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900 p-1"
            role="group"
            aria-label="Choose pricing audience"
          >
            <button
              type="button"
              onClick={() => setBillingTarget("seeker")}
              aria-pressed={billingTarget === "seeker"}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                billingTarget === "seeker"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Job Seekers
            </button>

            <button
              type="button"
              onClick={() => setBillingTarget("recruiter")}
              aria-pressed={billingTarget === "recruiter"}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                billingTarget === "recruiter"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Recruiters
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`group flex flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-violet-500/50 bg-zinc-900 shadow-[0_0_40px_rgba(139,92,246,0.08)]"
                  : "border-white/10 bg-black/80 hover:border-white/20"
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-fuchsia-300">
                    {plan.icon}
                  </div>

                  <h3 className="text-sm font-medium text-zinc-100">
                    {plan.name}
                  </h3>
                </div>

                {plan.popular && (
                  <span className="rounded-full bg-violet-500/15 px-2 py-1 text-[9px] font-medium text-violet-300">
                    Popular
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {plan.period}
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-400">
                {plan.description}
              </p>

              <div className="my-5 border-t border-white/10" />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs leading-5 text-zinc-300"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/10 text-fuchsia-300">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Navigate to Existing Pricing Page */}
              <Button
                as={Link}
                href="/plans"
                variant={plan.popular ? "solid" : "secondary"}
                className={`mt-7 flex h-10 w-full items-center justify-between rounded-lg px-3 text-xs font-medium ${
                  plan.popular
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-white/10 bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <span>Choose This Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </article>
          ))}
        </div>

        {/* View All Plans */}
        <div className="mt-8 text-center">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            View all plans and details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
