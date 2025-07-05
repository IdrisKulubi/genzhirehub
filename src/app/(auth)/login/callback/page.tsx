'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function LoginCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Redirect based on user's profile status
    if (!session.user.role) {
      router.push('/onboarding/role');
      return;
    }

    if (!session.user.hasProfile) {
      if (session.user.role === 'student') {
        router.push('/onboarding/student-profile');
      } else if (session.user.role === 'company') {
        router.push('/onboarding/company-profile');
      }
      return;
    }

    if (session.user.hasProfile && session.user.profileCompleted) {
      router.push('/onboarding/success');
      return;
    }

    if (session.user.hasProfile && !session.user.profileCompleted) {
      if (session.user.role === 'student') {
        router.push('/onboarding/student-profile');
      } else if (session.user.role === 'company') {
        router.push('/onboarding/company-profile');
      }
      return;
    }

    // Default fallback
    router.push('/onboarding/success');
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Setting up your account...</h2>
        <p className="text-muted-foreground">
          Please wait while we prepare your personalized experience
        </p>
      </div>
    </div>
  );
} 