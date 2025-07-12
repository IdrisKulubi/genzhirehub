"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Users } from "lucide-react"
import { joinWaitlistAction, getWaitlistCount } from "@/lib/actions/waitlist-actions"
import GridBackgroundDemo from "@/components/ui/grid-background-demo"

const initialState = {
  success: false,
  message: "",
}

export default function HeroSection() {
  const [state, formAction] = useActionState(joinWaitlistAction, initialState)
  const [waitlistCount, setWaitlistCount] = useState(300)

  useEffect(() => {
    async function fetchCount() {
      const { count } = await getWaitlistCount()
      setWaitlistCount(count)
    }
    fetchCount()
  }, [])
  
  // This effect will run when the form submission is successful
  // to refetch the count and show the latest number.
  useEffect(() => {
    if (state.success) {
      async function fetchCount() {
        const { count } = await getWaitlistCount();
        setWaitlistCount(count);
      }
      fetchCount();
    }
  }, [state.success]);


  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Subtle background texture */}
      <GridBackgroundDemo className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
          The Open-Source Job Board for Undergraduate Students
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
          Get early access to internships and jobs tailored for you. Join our waitlist and be the first to know when we launch.
        </p>

        {/* CTA Form */}
        <div className="flex flex-col gap-4 justify-center items-center w-full max-w-md">
          <form action={formAction} className="flex flex-col sm:flex-row gap-4 w-full">
            <Input
              type="email"
              name="email"
              placeholder="Enter your university email"
              className="flex-1 bg-gray-900 text-white border-gray-700 placeholder:text-gray-500 px-6 py-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 h-12"
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 h-12 font-semibold rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
            >
              Join Waitlist
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
          
          {/* Submission Message */}
          {state.message && (
             <p className={`text-sm ${state.success ? 'text-green-400' : 'text-red-400'}`}>
              {state.message}
            </p>
          )}

          {/* Waitlist Counter */}
          <div className="flex items-center gap-2 mt-4 text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span>{` ${waitlistCount} undergraduates already joined`}</span>
          </div>
        </div>

        {/* Trust Signal */}
        <p className="text-sm text-gray-500 font-light mt-8">
          No spam, no fees. Just real opportunities.
        </p>
      </div>
    </section>
  )
}
