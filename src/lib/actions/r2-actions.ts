'use server'

import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_CONFIG, generateFileKey, UploadResult, PresignedUrlResult } from '@/lib/r2-config'

/**
 * Upload file directly to R2
 */
export async function uploadToR2(
  file: File,
  userId: string,
  type: 'cv' | 'logo' | 'document' = 'cv'
): Promise<UploadResult> {
  try {
    // Validate bucket name
    if (!R2_CONFIG.bucketName) {
      throw new Error('CLOUDFLARE_R2_BUCKET_NAME environment variable is not set')
    }
    
    const key = generateFileKey(userId, file.name, type)
    const buffer = await file.arrayBuffer()
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ContentLength: file.size,
      Metadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    })

    await r2Client.send(command)
    
    const publicUrl = `${R2_CONFIG.publicUrl}/${key}`
    
    return {
      success: true,
      url: publicUrl,
      key,
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Generate presigned URL for direct upload from client
 */
export async function generatePresignedUrl(
  userId: string,
  fileName: string,
  fileType: string,
  type: 'cv' | 'logo' | 'document' = 'cv'
): Promise<PresignedUrlResult> {
  try {
    // Validate bucket name
    if (!R2_CONFIG.bucketName) {
      throw new Error('CLOUDFLARE_R2_BUCKET_NAME environment variable is not set')
    }
    
    const key = generateFileKey(userId, fileName, type)
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      ContentType: fileType,
      Metadata: {
        originalName: fileName,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    })

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }) // 1 hour
    
    return {
      success: true,
      uploadUrl,
      key,
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
export async function deleteFromR2(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate bucket name
    if (!R2_CONFIG.bucketName) {
      throw new Error('CLOUDFLARE_R2_BUCKET_NAME environment variable is not set')
    }
    
    const command = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    await r2Client.send(command)
    
    return { success: true }
  } catch (error) {
    console.error('R2 delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * Get file download URL (presigned for private files)
 */
export async function getFileDownloadUrl(key: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate bucket name
    if (!R2_CONFIG.bucketName) {
      throw new Error('CLOUDFLARE_R2_BUCKET_NAME environment variable is not set')
    }
    
    const command = new GetObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 }) // 1 hour
    
    return {
      success: true,
      url,
    }
  } catch (error) {
    console.error('Download URL generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate download URL',
    }
  }
} 