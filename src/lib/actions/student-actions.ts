'use server';

import { auth } from '../../../auth';
import db from '../../../db/drizzle';
import { users, students, waitlist } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { studentProfileSchema } from '../validation/schemas';
import { uploadToR2, deleteFromR2 } from './r2-actions';
import { extractKeyFromUrl } from '../r2-config';

interface FormState {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createStudentProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Authentication required' };
    }

    // Parse form data
    const rawData = {
      fullName: formData.get('fullName') as string,
      course: formData.get('course') as string,
      yearOfStudy: formData.get('yearOfStudy') as string,
      university: formData.get('university') as string,
      bio: formData.get('bio') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      portfolioUrl: formData.get('portfolioUrl') as string,
      githubUrl: formData.get('githubUrl') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      skills: JSON.parse(formData.get('skills') as string || '[]'),
      interests: JSON.parse(formData.get('interests') as string || '[]'),
      joinWaitlist: formData.get('joinWaitlist') === 'true',
    };

    // Validate the data
    const validatedData = studentProfileSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: 'Please check your input and try again',
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const data = validatedData.data;

    // Handle CV upload if provided
    const cvFile = formData.get('cv') as File;
    let cvUrl = '';
    
    if (cvFile && cvFile.size > 0) {
      // Upload CV to R2
      const uploadResult = await uploadToR2(cvFile, session.user.id, 'cv');
      
      if (!uploadResult.success) {
        return { 
          success: false, 
          error: uploadResult.error || 'Failed to upload CV' 
        };
      }
      
      cvUrl = uploadResult.url!;
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!currentUser) {
      return { success: false, error: 'User not found' };
    }

    // Check if student profile already exists
    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.userId, currentUser.id))
      .limit(1);

    // Create or update student profile in a transaction
    await db.transaction(async (tx) => {
      // Update user's name if provided
      if (data.fullName && data.fullName !== currentUser.name) {
        await tx
          .update(users)
          .set({ 
            name: data.fullName,
            updatedAt: new Date()
          })
          .where(eq(users.email, session.user.email));
      }

      if (existingStudent) {
        // Update existing student profile
        await tx
          .update(students)
          .set({
            fullName: data.fullName,
            course: data.course,
            yearOfStudy: data.yearOfStudy,
            university: data.university || null,
            bio: data.bio || null,
            linkedinUrl: data.linkedinUrl || null,
            portfolioUrl: data.portfolioUrl || null,
            githubUrl: data.githubUrl || null,
            phone: data.phone || null,
            location: data.location || null,
            skills: data.skills,
            interests: data.interests || [],
            cvUrl: cvUrl || existingStudent.cvUrl,
            profileCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(students.userId, currentUser.id));
      } else {
        // Create new student profile
        await tx.insert(students).values({
          userId: currentUser.id,
          fullName: data.fullName,
          course: data.course,
          yearOfStudy: data.yearOfStudy,
          university: data.university || null,
          bio: data.bio || null,
          linkedinUrl: data.linkedinUrl || null,
          portfolioUrl: data.portfolioUrl || null,
          githubUrl: data.githubUrl || null,
          phone: data.phone || null,
          location: data.location || null,
          skills: data.skills,
          interests: data.interests || [],
          cvUrl: cvUrl || null,
          profileCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Add to waitlist if requested
      if (data.joinWaitlist) {
        // Check if already in waitlist
        const [existingWaitlist] = await tx
          .select()
          .from(waitlist)
          .where(eq(waitlist.email, session.user.email))
          .limit(1);

        if (!existingWaitlist) {
          await tx.insert(waitlist).values({
            email: session.user.email,
            fullName: data.fullName,
            role: 'student',
            course: data.course,
            createdAt: new Date(),
          });
        }
      }
    });

    // Return success - let the client handle redirect
    return { 
      success: true,
      message: existingStudent ? 'Profile updated successfully!' : 'Profile created successfully!'
    };
  } catch (error) {
    console.error('Error creating student profile:', error);
    
    // Handle redirect errors (these are actually successful redirects)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      return { success: true };
    }

    // Handle specific database errors with user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return {
          success: false,
          error: 'A profile already exists for this account. Please try updating your profile instead.',
        };
      }
      
      if (error.message.includes('connection') || error.message.includes('network')) {
        return {
          success: false,
          error: 'Unable to connect to the server. Please check your internet connection and try again.',
        };
      }
      
      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: 'The request took too long. Please try again.',
        };
      }
    }
    
    return {
      success: false,
      error: 'Something went wrong while creating your profile. Please try again.',
    };
  }
}

export async function updateStudentProfileAction(
  profileId: string,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Authentication required' };
    }

    // Parse form data
    const rawData = {
      fullName: formData.get('fullName') as string,
      course: formData.get('course') as string,
      yearOfStudy: formData.get('yearOfStudy') as string,
      university: formData.get('university') as string,
      bio: formData.get('bio') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      portfolioUrl: formData.get('portfolioUrl') as string,
      githubUrl: formData.get('githubUrl') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      skills: JSON.parse(formData.get('skills') as string || '[]'),
      interests: JSON.parse(formData.get('interests') as string || '[]'),
    };

    // Validate the data
    const validatedData = studentProfileSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        error: 'Please check your input and try again',
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const data = validatedData.data;

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!currentUser) {
      return { success: false, error: 'User not found' };
    }

    // Check if the student profile belongs to the current user
    const [existingProfile] = await db
      .select()
      .from(students)
      .where(eq(students.userId, currentUser.id))
      .limit(1);

    if (!existingProfile) {
      return { success: false, error: 'Student profile not found' };
    }

    // Handle CV upload if provided
    const cvFile = formData.get('cv') as File;
    let cvUrl = existingProfile.cvUrl;
    
    if (cvFile && cvFile.size > 0) {
      // Delete old CV if it exists
      if (existingProfile.cvUrl) {
        const oldKey = extractKeyFromUrl(existingProfile.cvUrl);
        if (oldKey) {
          await deleteFromR2(oldKey);
        }
      }
      
      // Upload new CV to R2
      const uploadResult = await uploadToR2(cvFile, session.user.id, 'cv');
      
      if (!uploadResult.success) {
        return { 
          success: false, 
          error: uploadResult.error || 'Failed to upload CV' 
        };
      }
      
      cvUrl = uploadResult.url!;
    }

    // Update student profile
    await db
      .update(students)
      .set({
        fullName: data.fullName,
        course: data.course,
        yearOfStudy: data.yearOfStudy,
        university: data.university || null,
        bio: data.bio || null,
        linkedinUrl: data.linkedinUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        githubUrl: data.githubUrl || null,
        phone: data.phone || null,
        location: data.location || null,
        skills: data.skills,
        interests: data.interests || [],
        cvUrl: cvUrl,
        updatedAt: new Date(),
      })
      .where(eq(students.userId, currentUser.id));

    return { success: true };
  } catch (error) {
    console.error('Error updating student profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Update CV for an existing student profile
 */
export async function updateStudentCVAction(
  cvUrl: string
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Authentication required' };
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!currentUser) {
      return { success: false, error: 'User not found' };
    }

    // Check if the student profile exists
    const [existingProfile] = await db
      .select()
      .from(students)
      .where(eq(students.userId, currentUser.id))
      .limit(1);

    if (!existingProfile) {
      return { success: false, error: 'Student profile not found' };
    }

    // Delete old CV if it exists
    if (existingProfile.cvUrl) {
      const oldKey = extractKeyFromUrl(existingProfile.cvUrl);
      if (oldKey) {
        await deleteFromR2(oldKey);
      }
    }

    // Update student profile with new CV URL
    await db
      .update(students)
      .set({
        cvUrl: cvUrl,
        updatedAt: new Date(),
      })
      .where(eq(students.userId, currentUser.id));

    return { success: true };
  } catch (error) {
    console.error('Error updating student CV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function joinWaitlistAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Authentication required' };
    }

    const name = formData.get('name') as string;
    const userType = formData.get('userType') as 'student' | 'company';

    if (!name || !userType) {
      return { success: false, error: 'Name and user type are required' };
    }

    // Check if already in waitlist
    const [existingWaitlist] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, session.user.email))
      .limit(1);

    if (existingWaitlist) {
      return { success: false, error: 'You are already on the waitlist' };
    }

    // Add to waitlist
    await db.insert(waitlist).values({
      email: session.user.email,
      fullName: name,
      role: userType,
      createdAt: new Date(),
      course: formData.get('course') as string,
    });

    return { success: true };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
