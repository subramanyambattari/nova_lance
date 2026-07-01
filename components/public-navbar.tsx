"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <Sparkles className="size-4" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Nova Lance
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
              
              {/* Hire freelancers Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-1">
                  Hire freelancers
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">By Skill</div>
                      <div className="text-xs text-zinc-400 mt-1">Find top developers, designers, and more.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">By Project Type</div>
                      <div className="text-xs text-zinc-400 mt-1">E-commerce, mobile apps, branding.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors border border-violet-500/20 bg-violet-500/5 mt-1 relative overflow-hidden group/pro">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0 translate-x-[-100%] group-hover/pro:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        Nova Pro <span className="bg-violet-600 text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-bold tracking-wider">Vetted</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 relative z-10">Hire top 1% hand-picked talent.</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Find work Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-1">
                  Find work
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">Browse Jobs</div>
                      <div className="text-xs text-zinc-400 mt-1">Explore thousands of open projects.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">Freelancer Resources</div>
                      <div className="text-xs text-zinc-400 mt-1">Tips and guides to win more work.</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-1">
                  Solutions
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">Enterprise</div>
                      <div className="text-xs text-zinc-400 mt-1">Large-scale team solutions.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="font-semibold text-white">Agencies</div>
                      <div className="text-xs text-zinc-400 mt-1">Tools to manage multiple clients.</div>
                    </Link>
                  </div>
                </div>
              </div>

            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/onboarding"
              className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign Up
            </Link>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white border-0">
              <Link href="/post-project">Post a Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
