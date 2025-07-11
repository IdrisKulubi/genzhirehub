import { AlertTriangle, Clock, Frown, Search, X } from "lucide-react"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"

export default function ProblemSection() {
  const problems = [
    {
      icon: Search,
      title: "Endless Job Searching",
      description: "Spending hours scrolling through generic job boards with no real connections",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: X,
      title: "Application Black Holes",
      description: "Submitting applications that disappear into the void with no feedback",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      icon: Clock,
      title: "Slow Response Times",
      description: "Waiting weeks or months for responses that may never come",
      color: "text-rose-600",
      bgColor: "bg-rose-100 dark:bg-rose-800/20",
    },
    {
      icon: AlertTriangle,
      title: "Mismatched Opportunities",
      description: "Getting opportunities that don't match your skills or career goals",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-800/20",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-gray-900 dark:via-rose-950/20 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            The Job Search Struggle is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Real</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            We know the frustration. You're talented, motivated, and ready to make an impact. But the traditional job
            search process is broken, leaving you feeling...
          </p>
        </div>

        {/* 3D Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((problem, index) => (
            <CardContainer key={index} className="inter-var" containerClassName="py-0">
              <CardBody className="bg-white/80 backdrop-blur-sm relative group/card dark:hover:shadow-2xl dark:hover:shadow-rose-500/[0.1] dark:bg-gray-800/80 dark:border-rose-200/[0.2] border-rose-100/[0.3] w-auto h-auto rounded-xl p-6 border hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-300">
                <CardItem
                  translateZ="50"
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${problem.bgColor} flex items-center justify-center shadow-sm`}
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
            <CardBody className="bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-rose-50/80 backdrop-blur-sm dark:from-rose-900/20 dark:via-pink-900/15 dark:to-rose-900/20 dark:hover:shadow-2xl dark:hover:shadow-rose-500/[0.1] dark:bg-gray-800/80 dark:border-rose-200/[0.2] border-rose-200/50 dark:border-rose-800/50 w-auto h-auto rounded-2xl p-8 border shadow-lg shadow-rose-100/50">
              <CardItem translateZ="50" className="flex items-center justify-center mb-4">
                <Frown className="w-12 h-12 text-rose-500 mr-4" />
                <div className="text-left">
                  <CardItem translateZ="60" className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sound Familiar?
                  </CardItem>
                  <CardItem translateZ="70" className="text-gray-600 dark:text-gray-300">
                    You're not alone in this struggle
                  </CardItem>
                </div>
              </CardItem>

              <CardItem
                translateZ="80"
                as="blockquote"
                className="text-xl italic text-gray-700 dark:text-gray-300 mb-6"
              >
                "I've sent over 100 applications and only heard back from 3 companies. It feels like I'm shouting into
                the void."
              </CardItem>

              <CardItem
                translateZ="90"
                className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-500">73%</div>
                  <div>of students feel overwhelmed by job searching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">2-4 months</div>
                  <div>average time to find a job</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">95%</div>
                  <div>of applications get no response</div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>
  )
}
