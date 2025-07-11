import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  const benefits = [
    "Free forever for students",
    "No hidden fees or charges",
    "Direct access to hiring managers",
    "AI-powered job matching",
    "Real-time application updates",
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-rose-50/20 to-pink-50/20 dark:from-gray-900 dark:via-rose-950/10 dark:to-pink-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main CTA Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Ready to Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              Career Journey?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Join hundreds of students who have already discovered a better way to find their dream jobs. Your future
            starts with one click.
          </p>

          {/* Benefits List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-10 py-6 text-xl font-bold shadow-lg hover:shadow-xl hover:shadow-rose-300/50 transition-all duration-300 transform hover:scale-105 group border-0 rounded-full"
              >
                Start Free Today
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>

          {/* Trust Signal */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Setup in under 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              <span>Join 300+ students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
