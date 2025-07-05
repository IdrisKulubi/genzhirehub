import { Star, Quote, TrendingUp, Users, Building, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SocialProofSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineering Student",
      university: "University of Nairobi",
      avatar: "SC",
      content: "I got 3 interview calls in my first week! The direct connection with hiring managers made all the difference.",
      rating: 5
    },
    {
      name: "David Kimani",
      role: "Business Student",
      university: "Strathmore University",
      avatar: "DK",
      content: "Finally, a platform that understands what students actually need. No more generic job boards!",
      rating: 5
    },
    {
      name: "Grace Wanjiku",
      role: "Design Student",
      university: "USIU",
      avatar: "GW",
      content: "The AI matching is incredible. I only see opportunities that actually match my skills and interests.",
      rating: 5
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Students Registered",
      color: "text-blue-500"
    },
    {
      icon: Building,
      number: "50+",
      label: "Partner Companies",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      number: "89%",
      label: "Success Rate",
      color: "text-purple-500"
    },
    {
      icon: Award,
      number: "4.9/5",
      label: "User Rating",
      color: "text-orange-500"
    }
  ];

  const companies = [
    "Safaricom", "Equity Bank", "KCB", "Andela", "Twiga Foods", "M-Kopa"
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Join Students Who Are Already{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Winning
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Don't just take our word for it. See what students and companies are saying about GenzHireHub.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-50" />
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Testimonial Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8">
            Trusted by Leading Companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:opacity-100 transition-opacity duration-300"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-green-50 dark:bg-green-900/20 px-8 py-4 rounded-full border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Verified Platform</span>
            </div>
            <div className="w-1 h-6 bg-green-300 dark:bg-green-600" />
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Student-First Approach</span>
            </div>
            <div className="w-1 h-6 bg-green-300 dark:bg-green-600" />
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Proven Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 