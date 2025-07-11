import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-950">
      {/* Flowing Wave Shapes - Cloned from reference */}
      <div className="absolute inset-0">
        {/* Primary flowing wave */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wave3" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Main flowing wave shape */}
          <path
            d="M0,400 C200,200 400,600 600,300 C800,100 1000,500 1200,250 L1200,800 L0,800 Z"
            fill="url(#wave1)"
            className="animate-pulse"
            style={{ animationDuration: "4s" }}
          />

          {/* Secondary wave layer */}
          <path
            d="M0,500 C300,250 500,700 800,400 C900,300 1100,600 1200,350 L1200,800 L0,800 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />

          {/* Third wave layer for depth */}
          <path
            d="M0,600 C250,350 450,750 700,450 C850,300 1050,650 1200,400 L1200,800 L0,800 Z"
            fill="url(#wave3)"
            className="animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "2s" }}
          />
        </svg>

        {/* Top flowing wave */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="topWave1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="topWave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Top flowing shapes */}
          <path
            d="M0,0 C300,150 500,50 800,200 C1000,100 1100,250 1200,150 L1200,0 Z"
            fill="url(#topWave1)"
            className="animate-pulse"
            style={{ animationDuration: "7s" }}
          />

          <path
            d="M0,0 C200,100 600,200 900,80 C1050,150 1150,50 1200,100 L1200,0 Z"
            fill="url(#topWave2)"
            className="animate-pulse"
            style={{ animationDuration: "8s", animationDelay: "1.5s" }}
          />
        </svg>

        {/* Side flowing elements */}
        <div
          className="absolute left-0 top-1/4 w-64 h-96 bg-gradient-to-r from-rose-500/30 to-transparent rounded-full blur-3xl transform -rotate-45 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute right-0 top-1/3 w-80 h-80 bg-gradient-to-l from-pink-500/25 to-transparent rounded-full blur-2xl transform rotate-12 animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32 flex items-center min-h-screen z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Social Proof Badge */}
          <div className="flex justify-center mb-8">
            <Badge
              variant="secondary"
              className="bg-white/10 text-rose-100 border-rose-300/30 px-6 py-3 text-sm font-medium backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2 text-rose-300" />
              Launching Soon - Join 300+ Early Adopters
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
            Your Dream Job is Just{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300">
              One Click Away
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-rose-100/90 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
            Stop endless job hunting. Connect directly with companies that value your potential.{" "}
            <span className="text-rose-300 font-semibold">GenzHireHub</span> bridges the gap between ambitious students
            and forward-thinking employers.
          </p>

          {/* Value Proposition Points */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-rose-100/80">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-rose-300/20">
              <Users className="w-5 h-5 text-rose-300" />
              <span className="font-medium">Direct Company Access</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-rose-300/20">
              <TrendingUp className="w-5 h-5 text-rose-300" />
              <span className="font-medium">Higher Success Rate</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-rose-300/20">
              <Sparkles className="w-5 h-5 text-rose-300" />
              <span className="font-medium">AI-Powered Matching</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Signal */}
          <p className="text-sm text-rose-200/70 font-light">
            ✨ No spam, no fees, no BS. Just real opportunities for real students.
          </p>
        </div>
      </div>
    </section>
  )
}
