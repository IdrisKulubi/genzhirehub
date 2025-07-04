'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Mail, 
  Users, 
  Rocket,
  Trophy,
  Star,
  Clock
} from "lucide-react";

export default function OnboardingSuccess() {
  const [confetti, setConfetti] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Connect with Employers",
      description: "Get discovered by top companies looking for your skills"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Exclusive Opportunities",
      description: "Access internships and jobs posted exclusively on GenzHireHub"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Smart Matching",
      description: "Our AI matches you with opportunities that fit your profile"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Early Access",
      description: "Be among the first to use our platform when it launches"
    }
  ];

  return (
    <div className="space-y-6 text-center">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-green-100/20 animate-pulse" />
        </div>
      )}

      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-green-600">
          Welcome to GenzHireHub! 🎉
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your profile has been created successfully and you've joined our exclusive waitlist.
        </p>
      </div>

      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-green-700">
            <Mail className="h-5 w-5" />
            You're on the Waitlist!
          </CardTitle>
          <CardDescription>
            We'll notify you at <strong>{session?.user?.email}</strong> when we launch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              Early Access Member
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Rocket className="h-3 w-3 mr-1" />
              Profile Complete
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Position: <strong>#2,847</strong> in the waitlist
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
          <CardDescription>
            Here's what you can expect while we prepare for launch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-700">Stay Connected</h3>
            <p className="text-sm text-blue-600">
              Follow us on social media for updates and tips on landing your dream job
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" className="border-blue-200">
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="border-blue-200">
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="border-blue-200">
                Instagram
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push('/login')}
            className="flex-1 sm:flex-initial"
          >
            Return to Login
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = 'mailto:hello@genzhirehub.com'}
            className="flex-1 sm:flex-initial"
          >
            Contact Support
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Have questions? We're here to help at{" "}
          <a href="mailto:hello@genzhirehub.com" className="underline">
            hello@genzhirehub.com
          </a>
        </p>
      </div>
    </div>
  );
}
