import { AlertTriangle, Clock, Frown, Search, X } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function ProblemSection() {
  const problems = [
    {
      icon: Search,
      title: "Endless Job Searching",
      description: "Spending hours scrolling through generic job boards with no real connections",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: X,
      title: "Application Black Holes",
      description: "Submitting applications that disappear into the void with no feedback",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      icon: Clock,
      title: "Slow Response Times",
      description: "Waiting weeks or months for responses that may never come",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      icon: AlertTriangle,
      title: "Mismatched Opportunities",
      description: "Getting opportunities that don't match your skills or career goals",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            The Job Search Struggle is{" "}
            <span className="text-red-500">Real</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            We know the frustration. You're talented, motivated, and ready to make an impact. 
            But the traditional job search process is broken, leaving you feeling...
          </p>
        </div>

        {/* 3D Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((problem, index) => (
            <CardContainer key={index} className="inter-var" containerClassName="py-0">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-red-500/[0.1] dark:bg-gray-800 dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border hover:shadow-lg transition-all duration-300">
                <CardItem
                  translateZ="50"
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${problem.bgColor} flex items-center justify-center`}
                >
                  <problem.icon className={`w-8 h-8 ${problem.color}`} />
                </CardItem>
                
                <CardItem
                  translateZ="60"
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center"
                >
                  {problem.title}
                </CardItem>
                
                <CardItem
                  as="p"
                  translateZ="70"
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-center"
                >
                  {problem.description}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        {/* Emotional Impact Statement */}
        <div className="text-center max-w-4xl mx-auto">
          <CardContainer className="inter-var" containerClassName="py-0">
            <CardBody className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 dark:hover:shadow-2xl dark:hover:shadow-red-500/[0.1] dark:bg-gray-800 dark:border-white/[0.2] border-red-100 dark:border-red-800 w-auto h-auto rounded-2xl p-8 border">
              <CardItem translateZ="50" className="flex items-center justify-center mb-4">
                <Frown className="w-12 h-12 text-red-500 mr-4" />
                <div className="text-left">
                  <CardItem 
                    translateZ="60"
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    Sound Familiar?
                  </CardItem>
                  <CardItem 
                    translateZ="70"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    You're not alone in this struggle
                  </CardItem>
                </div>
              </CardItem>
              
              <CardItem
                translateZ="80"
                as="blockquote"
                className="text-xl italic text-gray-700 dark:text-gray-300 mb-6"
              >
                "I've sent over 100 applications and only heard back from 3 companies. 
                It feels like I'm shouting into the void."
              </CardItem>
              
              <CardItem 
                translateZ="90"
                className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">73%</div>
                  <div>of students feel overwhelmed by job searching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">2-4 months</div>
                  <div>average time to find a job</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">95%</div>
                  <div>of applications get no response</div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>
  );
} 