'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function OnboardingSuccess() {
  const router = useRouter();
  const { data: session } = useSession();

  const getUserDisplayName = () => {
    if (session?.user?.name) return session.user.name;
    if (session?.user?.email) return session.user.email.split('@')[0];
    return 'User';
  };

  const getUserRole = () => {
    if (!session?.user?.role) return 'Getting started...';
    return session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1);
  };

  const journeySteps = [
    {
      title: "Profile Created",
      description: "Your profile is complete and ready for launch",
      status: "completed",
    },
    {
      title: "Waitlist Joined",
      description: "You're secured for exclusive early access",
      status: "completed", 
    },
    {
      title: "Launch Ready",
      description: "We'll notify you the moment we go live",
      status: "pending",
    }
  ];

  const profileData = [
    {
      label: "Name",
      value: getUserDisplayName(),
    },
    {
      label: "Email",
      value: session?.user?.email || "Not provided",
    },
    {
      label: "Role",
      value: getUserRole(),
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">
                You're All Set, {getUserDisplayName()}!
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Your profile is live and you're officially part of our exclusive early access community. 
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-3 py-1 text-sm rounded-full border dark:border-gray-700">
                Profile Complete
              </div>
              <div className="px-3 py-1 text-sm rounded-full border dark:border-gray-700">
                {getUserRole()}
              </div>
              <div className="px-3 py-1 text-sm rounded-full border dark:border-gray-700">
                Early Access
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-12 border dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <p className="text-gray-600 dark:text-gray-400">Everything looks perfect</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {profileData.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                  <p className="font-semibold truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Steps */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-12 border dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Your Journey</h2>
              <p className="text-gray-600 dark:text-gray-400">Here's what happens next</p>
            </div>
            
            <div className="space-y-3">
              {journeySteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`
                    p-4 rounded-lg border transition-all
                    ${step.status === 'completed' 
                      ? "border-green-500/20 dark:border-green-500/30" 
                      : "border-gray-300 dark:border-gray-700"}
                  `}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    {step.status === 'completed' && (
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Section */}
          <div className="rounded-xl p-6 text-center border dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                We're putting the finishing touches on our platform. You'll be among the first to experience it.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  if (session?.user?.role === 'student') {
                    router.push('/onboarding/student-profile');
                  } else {
                    router.push('/onboarding/company-profile');
                  }
                }}
                className="h-12"
              >
                Update Profile
              </Button>
              <Button
                onClick={() => router.push('/landing')}
                className="h-12"
              >
                Back to Home
              </Button>
            </div>
            
            <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                Questions or feedback? We'd love to hear from you.
              </p>
              <a 
                href="mailto:hello@genzhirehub.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                hello@genzhirehub.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}