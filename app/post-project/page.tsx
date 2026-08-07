"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { postJob } from "./actions";
import { toast } from "sonner";

export default function PostProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Phase 2 State
  const [projectNature, setProjectNature] = useState("");
  const [projectPurpose, setProjectPurpose] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  // Phase 3 State
  const [projectName, setProjectName] = useState("");

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleNextPhase1 = () => setPhase(2);
  const handleSkipToPhase3 = () => {
    setProjectName("My Custom Project");
    setPhase(3);
  };
  
  const handleNextPhase2 = () => {
    // Generate name based on selections
    const name = projectNature ? `${projectNature} Project` : "New Project";
    setProjectName(name);
    setPhase(3);
  };

  const toggleFeature = (feat: string) => {
    setFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const getFeaturesList = () => {
    switch (projectPurpose) {
      case "Informational":
        return ["Contact form", "Blog/News section", "Newsletter signup", "SEO optimization", "Social media integration"];
      case "Portfolio/Showcase":
        return ["Image gallery", "Project case studies", "Client testimonials", "Resume download", "Contact form"];
      case "E-commerce":
        return ["Product catalog", "Shopping cart", "Payment gateway integration", "User authentication", "Order tracking"];
      default:
        return ["User authentication", "Database integration", "API development", "Admin dashboard", "Payment gateway integration"];
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (description.length < 30) {
      toast.error("Please enter a longer description.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, we would upload the files first and get their URLs
      // For now, we'll just pass the description and title
      const result = await postJob({
        title: projectName || "New Custom Project",
        description: description,
        budget: null, // Let the user negotiate later
        skills: features, // Using selected features as skills for now
      });

      if (result.success) {
        toast.success("Project posted successfully!");
        router.push("/client-dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to post project.");
      setIsSubmitting(false);
    }
  };

  const handleAIImprovement = () => {
    if (description.trim().length > 0) {
      setDescription(prev => prev + "\n\nKey Requirements:\n- High quality and responsive design\n- Modern technology stack\n- Fast delivery");
    } else {
      setDescription("I am looking for a talented professional to help me build a modern, high-quality solution for my business.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Left Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 max-h-screen overflow-y-auto">
        
        {/* Minimal Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl font-bold tracking-tight text-black dark:text-white">
              Nova Lance
            </span>
          </Link>
        </div>

        {/* Content Area */}
        <div className="max-w-xl w-full mx-auto flex-1">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Tell us what you <br /> need <span className="text-violet-600">done.</span>
          </h1>

          {phase === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                We'll guide you to create the perfect brief. The more detail the better.
              </p>
              <Textarea 
                placeholder="Enter a few bullet points or a full description."
                className="min-h-[200px] text-lg p-6 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 rounded-xl mb-6 shadow-sm focus-visible:ring-violet-600"
                value={description}
                onChange={handleDescriptionChange}
              />
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleNextPhase1} 
                  disabled={description.trim().length < 10}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 text-lg font-bold rounded-xl disabled:opacity-50"
                >
                  Next
                </Button>
                <span className="text-zinc-500 text-sm font-semibold">Press CTRL + ENTER</span>
              </div>
              {description.trim().length > 0 && description.trim().length < 10 && (
                 <p className="text-xs text-red-500 font-semibold mt-2 flex items-center gap-1">
                   <span className="rounded-full bg-red-100 text-red-500 size-4 flex items-center justify-center font-bold text-[10px]">!</span>
                   Please enter at least 10 characters to proceed
                 </p>
              )}
              
              {/* Trust badges / stats */}
              <div className="mt-16 space-y-4 text-zinc-600 dark:text-zinc-400 font-medium">
                <p className="text-black dark:text-white font-semibold">Nova Lance connects over 89 million professionals globally</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">✓</div>
                    From $10 tasks to $100k projects, we've got you covered
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">✓</div>
                    Connect with skilled freelancers in seconds
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">✓</div>
                    Only pay freelancers once you are happy with their work
                  </li>
                </ul>
              </div>
            </div>
          )}

          {phase === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10 pb-20">
              {/* Minimized description preview */}
              <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm text-zinc-700 dark:text-zinc-300">
                <p className="truncate max-w-[80%] italic">"{description}"</p>
                <button onClick={() => setPhase(1)} className="text-blue-600 hover:underline">Edit</button>
              </div>

              {/* Q1 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="font-bold text-lg">Can you provide more details about the nature of your project?</h3>
                  <span className="text-xs text-zinc-500">1 of 3</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["It's a website project", "It's a mobile app project", "It's a software development project", "Other (please specify)"].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setProjectNature(opt)}
                      className={`p-4 text-left border rounded-lg transition-all ${projectNature === opt ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600" : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-4 rounded-full border flex items-center justify-center ${projectNature === opt ? "border-blue-600" : "border-zinc-400"}`}>
                          {projectNature === opt && <div className="size-2 rounded-full bg-blue-600" />}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="font-bold text-lg">What is the main purpose of the project?</h3>
                  <span className="text-xs text-zinc-500">2 of 3</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["E-commerce", "Informational", "Portfolio/Showcase"].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setProjectPurpose(opt)}
                      className={`p-4 text-left border rounded-lg transition-all ${projectPurpose === opt ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600" : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-4 rounded-full border flex items-center justify-center ${projectPurpose === opt ? "border-blue-600" : "border-zinc-400"}`}>
                          {projectPurpose === opt && <div className="size-2 rounded-full bg-blue-600" />}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="font-bold text-lg">What key features do you need?</h3>
                  <span className="text-xs text-zinc-500">3 of 3</span>
                </div>
                <div className="flex flex-col gap-3">
                  {getFeaturesList().map(opt => (
                    <button 
                      key={opt}
                      onClick={() => toggleFeature(opt)}
                      className={`p-4 text-left border rounded-lg transition-all flex items-center gap-3 ${features.includes(opt) ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-300 dark:border-zinc-800"}`}
                    >
                      <div className={`size-5 rounded flex items-center justify-center border ${features.includes(opt) ? "bg-blue-600 border-blue-600" : "border-zinc-400"}`}>
                        {features.includes(opt) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <Button 
                  onClick={handleNextPhase2} 
                  className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 text-lg font-bold rounded-xl"
                >
                  Next
                </Button>
                <button onClick={handleSkipToPhase3} className="text-zinc-600 dark:text-zinc-400 font-bold hover:underline">
                  Skip
                </button>
                <button onClick={handleSkipToPhase3} className="text-zinc-600 dark:text-zinc-400 font-bold hover:underline underline-offset-4">
                  Use my description above
                </button>
              </div>

            </div>
          )}

          {phase === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8 pb-20">
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Create your brief. The more detail the better.
              </p>

              <div className="space-y-3">
                <Label className="text-lg font-bold">Project name</Label>
                <Input 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                  className="p-4 h-auto text-lg border-zinc-300 dark:border-zinc-800"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-bold flex justify-between">
                  Project description
                </Label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`min-h-[200px] p-4 text-lg focus-visible:ring-violet-600 shadow-sm ${
                    description.length < 30 ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300 dark:border-zinc-800"
                  }`}
                />
                {description.length < 30 && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                    <span className="rounded-full bg-red-100 text-red-500 size-4 flex items-center justify-center font-bold text-[10px]">!</span>
                    Please enter at least 30 characters
                  </p>
                )}
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                  isDragging 
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" 
                    : "border-zinc-300 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <UploadCloud className={`size-10 mb-3 transition-colors ${isDragging ? "text-violet-500" : "text-zinc-400 group-hover:text-blue-500"}`} />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Drag & drop or <span className="text-blue-600 hover:underline">click to upload</span> any images or documents that might be helpful in explaining your brief.
                </p>
                <p className="text-xs text-zinc-500 mt-2">(Max 25 MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange}
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-zinc-400">Attached Files</Label>
                  <div className="grid gap-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-md bg-zinc-200 dark:bg-zinc-800 shrink-0">
                            <FileText className="size-4 text-zinc-600 dark:text-zinc-400" />
                          </div>
                          <div className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {file.name}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="shrink-0 size-8 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || description.length < 30}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 text-lg font-bold rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Project"}
                </Button>
                <button 
                  onClick={handleAIImprovement}
                  className="text-zinc-600 dark:text-zinc-400 font-bold hover:text-violet-500 transition-colors flex items-center gap-2 group"
                >
                  <Sparkles className="size-4 group-hover:animate-pulse" /> I want AI assistance
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Right Column (Image & Overlays) */}
      <div className="hidden lg:block w-1/2 relative bg-black border-l border-white/10">
        <Image 
          src="/images/vibrant_features_art.png" 
          alt="Creative Abstract Background" 
          fill 
          className="object-cover opacity-90"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        
        {/* Dynamic Overlay */}
        {phase > 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
            <div className="animate-in zoom-in-95 fade-in duration-500 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl p-8 shadow-2xl shadow-violet-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-violet-500 size-6" />
                <h3 className="text-xl font-bold text-white">Let's add some details</h3>
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed">
                Answer three quick questions and we'll craft you the perfect project description!
              </p>
            </div>
          </div>
        )}

        {/* Branding */}
        <div className="absolute bottom-12 right-12">
          <h2 className="text-5xl font-extrabold text-white tracking-tighter mix-blend-overlay opacity-80" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            make it real.
          </h2>
        </div>
      </div>
    </div>
  );
}
