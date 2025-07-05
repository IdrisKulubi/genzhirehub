'use server';

import { auth } from '../../../auth';
import { getCurrentUser } from './user-actions';
import { redirect } from 'next/navigation';
import db from '../../../db/drizzle';
import { users, students, companies } from '../../../db/schema';
import { eq } from 'drizzle-orm';

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

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: string;
  hasProfile: boolean;
  profileCompleted: boolean;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }

    // Get user from database
    const [dbUser] = await db.select().from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!dbUser) {
      return null;
    }

    let hasProfile = false;
    let profileCompleted = false;

    // Check profile status based on role
    if (dbUser.role === 'student') {
      const [studentProfile] = await db.select().from(students)
        .where(eq(students.userId, dbUser.id))
        .limit(1);
      
      if (studentProfile) {
        hasProfile = true;
        profileCompleted = studentProfile.profileCompleted || false;
      }
    } else if (dbUser.role === 'company') {
      const [companyProfile] = await db.select().from(companies)
        .where(eq(companies.userId, dbUser.id))
        .limit(1);

      if (companyProfile) {
        hasProfile = true;
        profileCompleted = companyProfile.profileCompleted || false;
      }
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || undefined,
      role: dbUser.role || undefined,
      hasProfile,
      profileCompleted,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
} 