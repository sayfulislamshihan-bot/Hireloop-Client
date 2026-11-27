"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user;
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

    const handleSignOut = async () => {
    await signOut();

  }

  const navLinks = [
    {
      label: "Browse Jobs",
      href: "/jobs",
    },
    {
      label: "Companies",
      href: "/companies",
    },
    {
      label: "Pricing",
      href: "/plans",
    },
  ];

  const dashboardLinks = {
    seeker: '/dashboard/seeker',
    recruiter: '/dashboard/recruiter',
    admin: '/dashboard/admin'
  }

  if (user?.email) {
    navLinks.push(
      {
        label: 'Dashboard',
        href: dashboardLinks[user?.role || 'seeker']
      }
    )
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="HireLoop Logo"
            width={120} // Adjust width as needed
            height={40} // Adjust height as needed
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Nav Links */}
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-white/20" />

            {/* Auth Links */}
            <div className="flex items-center gap-4">

              {
                user ? 
                <>
                    <span className="inline-flex items-center gap-2.5 text-sm font-medium text-gray-200">
                      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border border-violet-400/30 bg-violet-500/15 text-sm font-semibold text-violet-200">
                        {userInitial}
                      </span>
                      <span>Hi {user.name}</span>
                    </span>
                    <Button onClick={handleSignOut}
                      variant="ghost">SignOut</Button>
                </>
                :
                <Link
                href="/auth/signin"
                className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
              >
                Sign In
              </Link>}

              <Link
                href="/auth/signup"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0B0B0F] md:hidden">
          <div className="space-y-3 px-4 py-6">
            {/* Nav Links */}
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-200">
                      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border border-violet-400/30 bg-violet-500/15 text-sm font-semibold text-violet-200">
                        {userInitial}
                      </span>
                      <span className="text-sm font-medium">Hi, {user.name}!</span>
                    </div>
                    <Button onClick={handleSignOut} variant="ghost" className="justify-start" >Sign Out</Button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="rounded-xl px-4 py-3 text-base font-medium text-violet-400 transition hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}

                {!user && <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
