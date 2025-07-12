'use server'

import { z } from 'zod'
import db from '../../../db/drizzle'
import { waitlist } from '../../../db/schema'
import { eq, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

interface WaitlistState {
  success: boolean
  message: string
}

const WaitlistSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

export async function joinWaitlistAction(
  prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const validatedFields = WaitlistSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid input.',
    }
  }

  const { email } = validatedFields.data

  try {
    const [existingEntry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email))
      .limit(1)

    if (existingEntry) {
      return {
        success: true,
        message: "You're already on the waitlist!",
      }
    }

    await db.insert(waitlist).values({ email })

    revalidatePath('/')

    return {
      success: true,
      message: "Thanks for joining! We'll keep you updated.",
    }
  } catch (error) {
    console.error('Waitlist error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    }
  }
}

export async function getWaitlistCount(): Promise<{ count: number }> {
  try {
    const [result] = await db.select({ value: count() }).from(waitlist)
    return { count: result.value }
  } catch (error) {
    console.error('Error getting waitlist count:', error)
    return { count: 0 }
  }
} 