import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      
      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-500" />
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Social Proof Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              variant="secondary" 
              className="bg-white/80 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Launching Soon - Join 500+ Early Adopters
            </Badge>
          </div>
          
          {/* Main Headline - Psychological Hook */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Your Dream Job is Just{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              One Click Away
            </span>
          </h1>
          
          {/* Subheadline - Problem & Solution */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Stop endless job hunting. Connect directly with companies that value your potential. 
            <span className="text-blue-600 font-semibold"> GenzHireHub</span> bridges the gap between 
            ambitious students and forward-thinking employers.
          </p>
          
          {/* Value Proposition Points */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Direct Company Access</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-medium">Higher Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-medium">AI-Powered Matching</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
            <Button>
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </Link>
            
          
          </div>
          
          {/* Trust Signal */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            ✨ No spam, no fees, no BS. Just real opportunities for real students.
          </p>
        </div>
      </div>
    </section>
  );
} 