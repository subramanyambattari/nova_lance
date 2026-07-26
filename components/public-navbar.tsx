"use client";

import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
                Nova Lance
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
              
              {/* Hire freelancers Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                  Hire freelancers
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-background border border-border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">By Skill</div>
                      <div className="text-xs text-muted-foreground mt-1">Find top developers, designers, and more.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">By Project Type</div>
                      <div className="text-xs text-muted-foreground mt-1">E-commerce, mobile apps, branding.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors border border-violet-500/20 bg-violet-500/5 mt-1 relative overflow-hidden group/pro">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0 translate-x-[-100%] group-hover/pro:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        Nova Pro <span className="bg-violet-600 text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-bold tracking-wider">Vetted</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 relative z-10">Hire top 1% hand-picked talent.</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Find work Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                  Find work
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-background border border-border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">Browse Jobs</div>
                      <div className="text-xs text-muted-foreground mt-1">Explore thousands of open projects.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">Freelancer Resources</div>
                      <div className="text-xs text-muted-foreground mt-1">Tips and guides to win more work.</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div className="relative group py-4">
                <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                  Solutions
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-background border border-border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">Enterprise</div>
                      <div className="text-xs text-muted-foreground mt-1">Large-scale team solutions.</div>
                    </Link>
                    <Link href="#" className="p-3 hover:bg-foreground/5 rounded-lg transition-colors">
                      <div className="font-semibold text-foreground">Agencies</div>
                      <div className="text-xs text-muted-foreground mt-1">Tools to manage multiple clients.</div>
                    </Link>
                  </div>
                </div>
              </div>

            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            
            {/* Desktop Auth Links */}
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/onboarding"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
            
            <Button asChild className="hidden sm:inline-flex bg-violet-600 hover:bg-violet-700 text-foreground border-0">
              <Link href="/post-project">Post a Project</Link>
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <nav className="flex flex-col gap-6 mt-8">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                      <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-foreground">
                        <Sparkles className="size-4" />
                      </span>
                      <span className="text-xl font-bold tracking-tight">Nova Lance</span>
                    </Link>
                    
                    <div className="flex flex-col gap-3">
                      <div className="font-semibold text-lg pb-2 border-b">Explore</div>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Hire freelancers</Link>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Find work</Link>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <div className="font-semibold text-lg pb-2 border-b">Account</div>
                      <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
                      <Link href="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-foreground border-0">
                        <Link href="/post-project">Post a Project</Link>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
