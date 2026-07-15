import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-violet-500/30">
      <PublicNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-0 pb-6 lg:pt-0 lg:pb-8 mt-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start pt-8 lg:pt-12">
              <div className="max-w-2xl">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight">
                  Hire the best freelancers for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">any job, online.</span>
                </h1>
                
                <div className="bg-foreground/5 border border-border p-2 rounded-2xl flex items-center mb-6 shadow-2xl backdrop-blur-sm max-w-xl">
                  <div className="flex-1 px-4 text-muted-foreground flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    What service are you looking for today?
                  </div>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-foreground rounded-xl px-6 h-12">Search</Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mb-10 text-sm">
                  <span className="text-zinc-500 font-medium">Popular:</span>
                  {["Website Design", "WordPress", "Logo Design", "AI Services"].map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-foreground/5 cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-foreground font-semibold">
                    <Link href="/onboarding">Hire a Freelancer</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-zinc-700 text-foreground/80 hover:bg-zinc-900 font-semibold bg-transparent">
                    <Link href="/onboarding">Earn Money Freelancing</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
                <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-border">
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

        {/* Top Freelancers Section */}
        <section className="py-24 bg-muted/50 border-y border-border/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Top talent, ready to work.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Hire professionals that other clients absolutely love working with.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Elena R.", role: "Senior UX Designer", rate: "$85/hr", rating: "5.0", reviews: "124", skills: ["Figma", "Prototyping", "UI Design"] },
                { name: "James T.", role: "Full Stack Developer", rate: "$95/hr", rating: "4.9", reviews: "89", skills: ["React", "Node.js", "Next.js"] },
                { name: "Sofia M.", role: "Brand Strategist", rate: "$70/hr", rating: "5.0", reviews: "210", skills: ["Branding", "Marketing", "SEO"] },
                { name: "David K.", role: "Mobile App Dev", rate: "$110/hr", rating: "4.8", reviews: "65", skills: ["Swift", "Flutter", "React Native"] },
              ].map((freelancer, i) => (
                <div key={i} className="bg-background border border-border rounded-3xl p-6 hover:border-violet-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-900/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 p-[2px]">
                        <div className="w-full h-full bg-background rounded-full flex items-center justify-center text-lg font-bold text-foreground">
                          {freelancer.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-violet-400 transition-colors">{freelancer.name}</h3>
                        <p className="text-xs text-zinc-500">{freelancer.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                    <span className="text-sm font-semibold ml-1">{freelancer.rating}</span>
                    <span className="text-xs text-zinc-500">({freelancer.reviews} jobs)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {freelancer.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-foreground/5 rounded-md text-xs text-muted-foreground border border-border/50">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-bold text-foreground">{freelancer.rate}</span>
                    <Button variant="ghost" className="text-violet-400 hover:text-foreground hover:bg-violet-600 h-8 text-xs rounded-lg">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-background relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Loved by millions.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See what clients and freelancers are saying about Nova Lance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "I found an incredible designer for our startup within hours. The quality of work and communication was outstanding. Nova Lance is now our go-to.", author: "Michael Chen", title: "Founder, TechFlow" },
                { quote: "As a freelancer, this platform has completely changed my career. The clients are professional, and the payment protection gives me total peace of mind.", author: "Sarah Jenkins", title: "Top Rated Developer" },
                { quote: "We scaled our entire marketing team using freelancers from here. The talent pool is unmatched and the platform makes managing projects effortless.", author: "Emma Watson", title: "Marketing Director" }
              ].map((testimonial, i) => (
                <div key={i} className="bg-background/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative">
                  <svg className="w-10 h-10 text-violet-500/20 absolute top-6 left-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
                  <p className="text-lg text-zinc-300 relative z-10 mb-8 pt-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-bold text-foreground">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.author}</h4>
                      <p className="text-sm text-zinc-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
                  <Link href="/onboarding" className="text-violet-500 font-semibold text-lg hover:text-violet-400 transition-colors flex items-center gap-2">
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
