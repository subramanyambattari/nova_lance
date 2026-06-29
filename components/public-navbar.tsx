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
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <Sparkles className="size-4" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Nova Lance
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
              <Link href="#" className="hover:text-white transition-colors">
                Hire freelancers
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Find work
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Solutions
              </Link>
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
            <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white border-0">
              <Link href="/post-project">Post a Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
