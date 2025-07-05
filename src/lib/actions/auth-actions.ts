'use server';

import { auth } from '../../../auth';
import { getCurrentUser } from './user-actions';
import { redirect } from 'next/navigation';

/**
 * Handle post-login redirect based on user profile status
 */
export async function handlePostLoginRedirect() {
  try {
    const session = await auth();
    if (!session?.user) {
      redirect('/login');
    }

    // Get current user with profile status
    const user = await getCurrentUser();
    
    if (!user) {
      redirect('/login');
    }

    // Check user's profile completion status and redirect accordingly
    if (!user.role) {
      // No role set, redirect to role selection
      redirect('/onboarding/role');
    }

    if (!user.hasProfile) {
      // No profile created, redirect to profile creation
      if (user.role === 'student') {
        redirect('/onboarding/student-profile');
      } else if (user.role === 'company') {
        redirect('/onboarding/company-profile');
      }
    }

    if (user.hasProfile && user.profileCompleted) {
      // Profile complete, redirect to success page
      redirect('/onboarding/success');
    }

    // Profile exists but not completed, redirect to complete it
    if (user.hasProfile && !user.profileCompleted) {
      if (user.role === 'student') {
        redirect('/onboarding/student-profile');
      } else if (user.role === 'company') {
        redirect('/onboarding/company-profile');
      }
    }

    // Default fallback
    redirect('/onboarding/success');
  } catch (error) {
    console.error('Error in post-login redirect:', error);
    redirect('/login');
  }
}

/**
 * Get the appropriate redirect URL for a user after login
 */
export async function getLoginRedirectUrl(): Promise<string> {
  try {
    const session = await auth();
    if (!session?.user) {
      return '/login';
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return '/login';
    }

    // Check user's profile completion status
    if (!user.role) {
      return '/onboarding/role';
    }

    if (!user.hasProfile) {
      return user.role === 'student' 
        ? '/onboarding/student-profile' 
        : '/onboarding/company-profile';
    }

    if (user.hasProfile && user.profileCompleted) {
      return '/onboarding/success';
    }

    if (user.hasProfile && !user.profileCompleted) {
      return user.role === 'student' 
        ? '/onboarding/student-profile' 
        : '/onboarding/company-profile';
    }

    return '/onboarding/success';
  } catch (error) {
    console.error('Error getting login redirect URL:', error);
    return '/login';
  }
} 