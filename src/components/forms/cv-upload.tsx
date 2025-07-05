'use client'

import React, { useState, useRef, useCallback, useActionState } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadCVAction, generateUploadUrlAction, deleteFileAction } from '@/lib/actions/file-upload-actions'
import { formatFileSize, getFileTypeIcon } from '@/lib/utils'
import { validateFile } from '@/lib/r2-config'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  Trash2,
  Loader2,
  CloudUpload,
  File
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CVUploadProps {
  onUploadSuccess?: (url: string, key: string) => void
  onUploadError?: (error: string) => void
  onDelete?: () => void
  initialFileUrl?: string
  initialFileName?: string
  disabled?: boolean
  className?: string
}

interface UploadProgress {
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

const CVUpload: React.FC<CVUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onDelete,
  initialFileUrl,
  initialFileName,
  disabled = false,
  className,
}) => {
  const [uploadState, uploadAction] = useActionState(uploadCVAction, { success: false })
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  })
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialFileUrl || null)
  const [fileName, setFileName] = useState<string>(initialFileName || '')
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file drop and selection
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Validate file
    const validation = validateFile(file, 'cv')
    if (!validation.valid) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: validation.error
      })
      onUploadError?.(validation.error || 'Invalid file')
      return
    }

    setCurrentFile(file)
    setFileName(file.name)
    setUploadProgress({ progress: 0, status: 'uploading' })

    try {
      // Use presigned URL for better upload experience
      const presignedResult = await generateUploadUrlAction(
        file.name,
        file.type,
        file.size,
        'cv'
      )

      if (!presignedResult.success) {
        throw new Error(presignedResult.error || 'Failed to generate upload URL')
      }

      // Upload directly to R2 using presigned URL
      const uploadResult = await uploadWithProgress(
        presignedResult.uploadUrl!,
        file,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, progress }))
        }
      )

      if (uploadResult.success) {
        setUploadProgress({ progress: 100, status: 'success' })
        setPreviewUrl(presignedResult.publicUrl!)
        onUploadSuccess?.(presignedResult.publicUrl!, presignedResult.key!)
      } else {
        throw new Error(uploadResult.error || 'Upload failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: errorMessage
      })
      onUploadError?.(errorMessage)
    }
  }, [disabled, onUploadSuccess, onUploadError])

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive: dzIsDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled
  })

  // Upload with progress tracking
  const uploadWithProgress = async (
    uploadUrl: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve({ success: true })
        } else {
          resolve({ success: false, error: `Upload failed with status ${xhr.status}` })
        }
      })

      xhr.addEventListener('error', () => {
        resolve({ success: false, error: 'Network error during upload' })
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  // Handle file deletion
  const handleDelete = async () => {
    if (!previewUrl) return

    try {
      const result = await deleteFileAction(previewUrl)
      if (result.success) {
        setPreviewUrl(null)
        setFileName('')
        setCurrentFile(null)
        setUploadProgress({ progress: 0, status: 'idle' })
        onDelete?.()
      } else {
        throw new Error(result.error || 'Delete failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed'
      setUploadProgress({
        progress: 0,
        status: 'error',
        error: errorMessage
      })
    }
  }

  // Reset upload state
  const resetUpload = () => {
    setUploadProgress({ progress: 0, status: 'idle' })
    setCurrentFile(null)
    if (!previewUrl) {
      setFileName('')
    }
  }

  const isUploading = uploadProgress.status === 'uploading'
  const hasError = uploadProgress.status === 'error'
  const isSuccess = uploadProgress.status === 'success' || previewUrl

  return (
    <div className={cn('w-full', className)}>
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300',
        isDragActive && 'ring-2 ring-primary ring-offset-2',
        hasError && 'border-destructive',
        isSuccess && 'border-green-500',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        <CardContent className="p-6">
          {/* Upload Area */}
          {!previewUrl && (
            <div
              {...getRootProps()}
              className={cn(
                'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
                dzIsDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                disabled && 'cursor-not-allowed',
                hasError && 'border-destructive bg-destructive/5'
              )}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              
              <div className="flex flex-col items-center space-y-4">
                <div className={cn(
                  'relative p-4 rounded-full transition-all duration-300',
                  dzIsDragActive ? 'bg-primary/10' : 'bg-muted/50',
                  hasError && 'bg-destructive/10'
                )}>
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : hasError ? (
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  ) : (
                    <CloudUpload className={cn(
                      'h-8 w-8 transition-colors duration-300',
                      dzIsDragActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isUploading ? 'Uploading...' : 'Upload your CV'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dzIsDragActive 
                      ? 'Drop your CV here' 
                      : 'Drag and drop your CV here, or click to browse'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, or DOCX • Max 10MB
                  </p>
                </div>

                {!isUploading && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading {fileName}</span>
                      <span>{uploadProgress.progress}%</span>
                    </div>
                    <Progress value={uploadProgress.progress} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* File Preview */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      {fileName || 'CV uploaded'}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {currentFile && formatFileSize(currentFile.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={disabled}
                    className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Replace File Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreviewUrl(null)
                  setFileName('')
                  setCurrentFile(null)
                  setUploadProgress({ progress: 0, status: 'idle' })
                }}
                disabled={disabled}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Replace CV
              </Button>
            </div>
          )}

          {/* Error Message */}
          {hasError && uploadProgress.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {uploadProgress.error}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                  className="ml-2"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {isSuccess && uploadProgress.status === 'success' && (
            <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                CV uploaded successfully!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Type Information */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center space-x-1">
          <File className="h-3 w-3" />
          <span>Supported formats: PDF, DOC, DOCX</span>
        </p>
        <p className="flex items-center space-x-1 mt-1">
          <Upload className="h-3 w-3" />
          <span>Maximum file size: 10MB</span>
        </p>
      </div>
    </div>
  )
}

export default CVUpload 