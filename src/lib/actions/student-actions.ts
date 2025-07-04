'use server';

import { auth } from '../../../auth';
import db from '../../../db/drizzle';
import { users, students, waitlist } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { studentProfileSchema } from '../validation/schemas';

interface FormState {
  success: boolean;
  error?: string;
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
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (cvFile.size > maxSize) {
        return { success: false, error: 'CV file size must be less than 5MB' };
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(cvFile.type)) {
        return { success: false, error: 'CV must be a PDF or Word document' };
      }

      // For now, we'll store a placeholder URL
      // In production, you'd upload to a cloud storage service
      cvUrl = `cv-${session.user.email}-${Date.now()}.${cvFile.name.split('.').pop()}`;
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

    // Create student profile in a transaction
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

      // Create student profile
      await tx.insert(students).values({
        userId: currentUser.id,
        fullName: data.fullName,
        course: data.course,
        yearOfStudy: data.yearOfStudy,
        university: data.university || null,
        bio: data.bio || null,
        linkedinUrl: data.linkedinUrl || null,
        skills: data.skills,
        interests: data.interests || [],
        cvUrl: cvUrl || null,
        profileCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

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
            name: data.fullName,
            userType: 'student',
            source: 'onboarding',
            createdAt: new Date(),
          });
        }
      }
    });

    // Redirect to success page or dashboard
    redirect('/onboarding/success');
  } catch (error) {
    console.error('Error creating student profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
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
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (cvFile.size > maxSize) {
        return { success: false, error: 'CV file size must be less than 5MB' };
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(cvFile.type)) {
        return { success: false, error: 'CV must be a PDF or Word document' };
      }

      // For now, we'll store a placeholder URL
      // In production, you'd upload to a cloud storage service
      cvUrl = `cv-${session.user.email}-${Date.now()}.${cvFile.name.split('.').pop()}`;
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
      name: name,
      userType: userType,
      source: 'manual',
      createdAt: new Date(),
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
