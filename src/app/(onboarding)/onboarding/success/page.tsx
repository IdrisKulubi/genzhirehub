'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  FileText, 
  Users,
  Rocket,
  Clock
} from "lucide-react";

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

  const nextSteps = [
    {
      icon: Users,
      title: "You're on the Waitlist",
      description: "We'll notify you when GenzHireHub launches with exclusive early access",
      status: "completed"
    },
    {
      icon: FileText,
      title: "Profile Created",
      description: "Your profile is ready and will be visible to companies when we launch",
      status: "completed"
    },
    {
      icon: Rocket,
      title: "Launch Notification",
      description: "Get notified first when we go live and start connecting with employers",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to GenzHireHub, {getUserDisplayName()}! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your profile has been created successfully! You're now part of our exclusive early access community.
            </p>
            
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Profile Complete • {getUserRole()}
            </Badge>
          </div>

          {/* Profile Summary */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Your Profile Summary
              </CardTitle>
              <CardDescription>
                Here's what we have on file for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getUserRole()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {session?.user?.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Verified Email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    {session?.user?.role === 'student' ? (
                      <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Profile Complete
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Ready for launch
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Your Journey with GenzHireHub</CardTitle>
              <CardDescription>
                Here's what happens next
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <step.icon className={`w-5 h-5 ${
                        step.status === 'completed' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        {step.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {step.status === 'pending' && (
                          <Clock className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What Happens Next?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We're putting the finishing touches on GenzHireHub. You'll be among the first to know when we launch!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (session?.user?.role === 'student') {
                      router.push('/onboarding/student-profile');
                    } else {
                      router.push('/onboarding/company-profile');
                    }
                  }}
                >
                  Update Profile
                </Button>
                <Button
                  onClick={() => router.push('/landing')}
                >
                  Back to Home
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Questions? Email us at{" "}
                  <a href="mailto:hello@genzhirehub.com" className="text-blue-600 hover:underline">
                    hello@genzhirehub.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
