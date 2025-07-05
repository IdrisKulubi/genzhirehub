'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, Users, Building2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.push('/login');
      return;
    }

    // Authenticated user, check if they need onboarding
    if (!session.user.role) {
      // No role set, redirect to role selection
      router.push('/onboarding/role');
      return;
    }

    // User has role, check if they have completed profile
    if (!session.user.hasProfile) {
      // No profile, redirect to appropriate profile creation
      if (session.user.role === 'student') {
        router.push('/onboarding/student-profile');
      } else if (session.user.role === 'company') {
        router.push('/onboarding/company-profile');
      }
      return;
    }

    // User is fully set up, redirect to success page
    if (session.user.hasProfile && session.user.profileCompleted) {
      router.push('/onboarding/success');
    } else {
      // Profile incomplete, redirect to complete it
      if (session.user.role === 'student') {
        router.push('/onboarding/student-profile');
      } else if (session.user.role === 'company') {
        router.push('/onboarding/company-profile');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to GenzHireHub</CardTitle>
          <CardDescription>
            Connecting university students with employers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">For Students</p>
              <p className="text-xs text-muted-foreground">Find opportunities</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">For Companies</p>
              <p className="text-xs text-muted-foreground">Hire talent</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}