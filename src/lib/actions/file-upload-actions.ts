'use server'

import { auth } from '../../../auth'
import { uploadToR2, generatePresignedUrl, deleteFromR2 } from './r2-actions'
import { validateFile, extractKeyFromUrl } from '../r2-config'
import { z } from 'zod'

export interface FileUploadState {
  success: boolean
  url?: string
  key?: string
  error?: string
  progress?: number
}

export interface PresignedUploadState {
  success: boolean
  uploadUrl?: string
  key?: string
  publicUrl?: string
  error?: string
}

// Validation schemas
const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  uploadType: z.enum(['cv', 'logo', 'document']).default('cv'),
})

const deleteFileSchema = z.object({
  fileUrl: z.string().url('Invalid file URL'),
})

/**
 * Upload CV file directly to R2
 */
export async function uploadCVAction(
  prevState: FileUploadState,
  formData: FormData
): Promise<FileUploadState> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    const file = formData.get('file') as File
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateFile(file, 'cv')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to R2
    const result = await uploadToR2(file, session.user.id, 'cv')
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      url: result.url,
      key: result.key,
    }
  } catch (error) {
    console.error('CV upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Generate presigned URL for direct client upload
 */
export async function generateUploadUrlAction(
  fileName: string,
  fileType: string,
  fileSize: number,
  uploadType: 'cv' | 'logo' | 'document' = 'cv'
): Promise<PresignedUploadState> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    // Validate input
    const validation = fileUploadSchema.safeParse({
      fileName,
      fileType,
      fileSize,
      uploadType,
    })

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid input',
      }
    }

    // Create a temporary file object for validation
    const tempFile = new File([], fileName, { type: fileType })
    Object.defineProperty(tempFile, 'size', { value: fileSize })

    const fileValidation = validateFile(tempFile, uploadType)
    if (!fileValidation.valid) {
      return { success: false, error: fileValidation.error }
    }

    // Generate presigned URL
    const result = await generatePresignedUrl(
      session.user.id,
      fileName,
      fileType,
      uploadType
    )

    if (!result.success) {
      return { success: false, error: result.error }
    }

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${result.key}`

    return {
      success: true,
      uploadUrl: result.uploadUrl,
      key: result.key,
      publicUrl,
    }
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate upload URL',
    }
  }
}

/**
 * Delete file from R2
 */
export async function deleteFileAction(fileUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    // Validate input
    const validation = deleteFileSchema.safeParse({ fileUrl })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || 'Invalid file URL',
      }
    }

    // Extract key from URL
    const key = extractKeyFromUrl(fileUrl)
    if (!key) {
      return { success: false, error: 'Invalid file URL format' }
    }

    // Verify the file belongs to the current user
    if (!key.includes(session.user.id)) {
      return { success: false, error: 'Unauthorized: File does not belong to you' }
    }

    // Delete from R2
    const result = await deleteFromR2(key)
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error('File deletion error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * Upload company logo
 */
export async function uploadLogoAction(
  prevState: FileUploadState,
  formData: FormData
): Promise<FileUploadState> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    const file = formData.get('file') as File
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateFile(file, 'logo')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to R2
    const result = await uploadToR2(file, session.user.id, 'logo')
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      url: result.url,
      key: result.key,
    }
  } catch (error) {
    console.error('Logo upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Upload general document
 */
export async function uploadDocumentAction(
  prevState: FileUploadState,
  formData: FormData
): Promise<FileUploadState> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    const file = formData.get('file') as File
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateFile(file, 'document')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to R2
    const result = await uploadToR2(file, session.user.id, 'document')
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      url: result.url,
      key: result.key,
    }
  } catch (error) {
    console.error('Document upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// Helper functions moved to @/lib/utils for client component compatibility 