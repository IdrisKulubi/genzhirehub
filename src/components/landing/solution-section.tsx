import { CheckCircle, Zap, Target, Heart, Users, Rocket } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Badge } from "@/components/ui/badge";

export default function SolutionSection() {
  const solutions = [
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered algorithm connects you with companies that actually want your skills",
      benefit: "10x higher response rate",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Users,
      title: "Direct Access",
      description: "Skip the HR bottleneck and connect directly with hiring managers",
      benefit: "Faster decisions",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get real-time updates on your applications and profile views",
      benefit: "No more waiting",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Heart,
      title: "Quality First",
      description: "Curated opportunities from companies that value student potential",
      benefit: "Better job fit",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            The Solution
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            What if Job Searching was{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Actually Enjoyable?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            GenzHireHub transforms the job search experience from frustrating to fulfilling. 
            Here's how we make it happen:
          </p>
        </div>

        {/* 3D Solution Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {solutions.map((solution, index) => (
            <CardContainer key={index} className="inter-var" containerClassName="py-0">
              <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-green-500/[0.1] dark:bg-gray-800 dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border hover:shadow-xl transition-all duration-500">
                <CardItem
                  translateZ="50"
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${solution.bgColor} flex items-center justify-center`}
                >
                  <solution.icon className={`w-8 h-8 ${solution.color}`} />
                </CardItem>
                
                <CardItem
                  translateZ="60"
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center"
                >
                  {solution.title}
                </CardItem>
                
                <CardItem
                  as="p"
                  translateZ="70"
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 text-center"
                >
                  {solution.description}
                </CardItem>
                
                <CardItem
                  translateZ="80"
                  className="flex justify-center"
                >
                  <Badge 
                    variant="secondary" 
                    className={`${solution.color} bg-opacity-10 text-xs font-medium`}
                  >
                    {solution.benefit}
                  </Badge>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Three simple steps to your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Your Profile
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Showcase your skills, projects, and aspirations in minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Get Matched
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our AI finds companies that are perfect fits for your goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start Working
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect directly with hiring managers and land your dream role
              </p>
            </div>
          </div>
        </div>

        {/* Results Preview */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold">
            <Rocket className="w-5 h-5" />
            Result: From job search stress to career success
          </div>
        </div>
      </div>
    </section>
  );
} 