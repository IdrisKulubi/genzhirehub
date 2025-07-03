'use server'

import { auth } from '../../../auth'
import db from '../../../db/drizzle'
import { users, students, companies } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Helper function to require authentication
export async function requireAuth(allowedRoles?: string[]) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  
  if (allowedRoles && session.user.role && !allowedRoles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}

// Get current user with profile status
export async function getCurrentUser() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return null
  }

  try {
    // Check by email first (primary unique constraint)
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)
    
    // Fallback to ID check if email lookup fails
    if (!user && session.user.id) {
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
    }

    if (!user) {
      return null
    }

    // Check if user has profile based on role
    let profileCompleted = false
    let hasProfile = false

    if (user.role === 'student') {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.userId, user.id))
        .limit(1)
      
      hasProfile = !!student
      profileCompleted = student?.profileCompleted || false
    } else if (user.role === 'company') {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.userId, user.id))
        .limit(1)
      
      hasProfile = !!company
      profileCompleted = company?.profileCompleted || false
    }

    return {
      ...user,
      hasProfile,
      profileCompleted,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Update user role
const updateUserRoleSchema = z.object({
  role: z.enum(['student', 'company', 'admin']),
})

export async function updateUserRoleAction(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    const data = {
      role: formData.get('role') as string,
    }

    const validatedFields = updateUserRoleSchema.safeParse(data)
    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid role',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Update user role in database (using email as primary identifier)
    await db
      .update(users)
      .set({ 
        role: validatedFields.data.role,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email))

    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Create or update user in database (called during sign in)
export async function createOrUpdateUser(userData: {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role?: 'student' | 'company' | 'admin'
}) {
  try {
    // Check if user exists by email first (primary unique constraint)
    const [existingUserByEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1)

    if (existingUserByEmail) {
      // Update existing user by email
      const [updatedUser] = await db
        .update(users)
        .set({
          id: userData.id, // Update ID in case it changed
          name: userData.name,
          image: userData.image,
          updatedAt: new Date(),
        })
        .where(eq(users.email, userData.email))
        .returning()
      
      return updatedUser
    } else {
      // Check if user exists by ID (secondary check)
      const [existingUserById] = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id))
        .limit(1)

      if (existingUserById) {
        // Update existing user by ID with new email
        const [updatedUser] = await db
          .update(users)
          .set({
            email: userData.email,
            name: userData.name,
            image: userData.image,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning()
        
        return updatedUser
      } else {
        // Create new user - neither email nor ID exists
        const [newUser] = await db
          .insert(users)
          .values({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            image: userData.image,
            role: userData.role || 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
        
        return newUser
      }
    }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}

// Check user onboarding status and redirect appropriately
export async function checkUserOnboardingStatus() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // If user doesn't have a role set, redirect to role selection
  if (!user.role) {
    redirect('/onboarding/role')
  }

  // If user has role but no profile, redirect to profile creation
  if (!user.hasProfile) {
    if (user.role === 'student') {
      redirect('/onboarding/student-profile')
    } else if (user.role === 'company') {
      redirect('/onboarding/company-profile')
    }
  }

  // If profile exists but not completed, redirect to complete profile
  if (user.hasProfile && !user.profileCompleted) {
    if (user.role === 'student') {
      redirect('/student/profile?complete=true')
    } else if (user.role === 'company') {
      redirect('/company/profile?complete=true')
    }
  }

  // User is fully onboarded, redirect to appropriate dashboard
  if (user.role === 'student') {
    redirect('/student/dashboard')
  } else if (user.role === 'company') {
    redirect('/company/dashboard')
  } else {
    redirect('/admin/dashboard')
  }
}

// Set user role and redirect to profile creation
export async function setUserRoleAction(role: 'student' | 'company') {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Update user role (using email as primary identifier)
    await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email))

    return { success: true, role }
  } catch (error) {
    console.error('Error setting user role:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
