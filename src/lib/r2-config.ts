import { S3Client} from '@aws-sdk/client-s3'
// Validate required environment variables (only on server-side)
function validateEnvVars() {
  // Only validate on server-side
  if (typeof window !== 'undefined') return
  
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Validate environment variables on module load (server-side only)
validateEnvVars()

// R2 Configuration (with fallbacks for client-side)
export const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '', // Your custom domain or R2 public URL
}

// Create S3 client for R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
})

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface PresignedUrlResult {
  success: boolean
  uploadUrl?: string
  key?: string
  error?: string
}

/**
 * Generate a unique file key for R2 storage
 */
export function generateFileKey(userId: string, originalName: string, type: 'cv' | 'logo' | 'document'): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()?.toLowerCase()
  
  return `${type}/${userId}/${timestamp}-${randomString}.${extension}`
}

// Server functions moved to lib/actions/r2-actions.ts

/**
 * Validate file for upload
 */
export function validateFile(file: File, type: 'cv' | 'logo' | 'document' = 'cv'): { valid: boolean; error?: string } {
  const maxSizes = {
    cv: 10 * 1024 * 1024, // 10MB for CVs
    logo: 2 * 1024 * 1024, // 2MB for logos
    document: 10 * 1024 * 1024, // 10MB for documents
  }

  const allowedTypes = {
    cv: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    logo: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  }

  // Check file size
  if (file.size > maxSizes[type]) {
    const maxSizeMB = maxSizes[type] / (1024 * 1024)
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    }
  }

  // Check file type
  if (!allowedTypes[type].includes(file.type)) {
    const typeNames = {
      cv: 'PDF or Word document',
      logo: 'JPEG, PNG, WebP, or SVG image',
      document: 'PDF, Word document, or text file',
    }
    
    return {
      valid: false,
      error: `File must be a ${typeNames[type]}`,
    }
  }

  return { valid: true }
}

/**
 * Extract file key from public URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.substring(1) // Remove leading slash
  } catch {
    return null
  }
} 