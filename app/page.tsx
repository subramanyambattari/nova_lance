import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
      <PublicNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                  Hire the best freelancers for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">any job, online.</span>
                </h1>
                
                <ul className="space-y-4 mb-10 text-lg text-zinc-300">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-pink-500 size-6" />
                    <span>World's largest freelance marketplace</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-pink-500 size-6" />
                    <span>Any job you can possibly think of</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-pink-500 size-6" />
                    <span>Save up to 90% & get quotes for free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-pink-500 size-6" />
                    <span>Pay only when you're 100% happy</span>
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                    <Link href="/onboarding">Hire a Freelancer</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-zinc-700 text-zinc-100 hover:bg-zinc-900 font-semibold bg-transparent">
                    <Link href="/onboarding">Earn Money Freelancing</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
                <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10">
                  <Image 
                    src="/images/hero_app_mockup.png" 
                    alt="Freelancer App Mockup" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 bg-zinc-950 border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="order-2 lg:order-1 relative w-full aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src="/images/vibrant_features_art.png" 
                  alt="Vibrant Features" 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="order-1 lg:order-2">
                <div className="mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">Make your dreams a reality.</h2>
                  <Link href="/onboarding" className="text-pink-500 font-semibold text-lg hover:text-pink-400 transition-colors flex items-center gap-2">
                    Get started now <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">The best talent</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Discover reliable professionals by exploring their portfolios and immersing yourself in the feedback shared on their profiles.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Fast bids</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Get quick, no-obligation quotes from skilled freelancers. 80% of jobs receive bids within 60 seconds. Your idea is just moments from reality.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Quality work</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      With Nova Lance's talent pool of top-tier professionals at your fingertips, you'll find quality talent to get what you need done.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Be in control</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Stay in the loop while on the move. Chat with your freelancers and get real time updates with our platform. Anytime, anywhere.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black py-12 border-t border-white/10 text-center text-zinc-500 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Nova Lance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
