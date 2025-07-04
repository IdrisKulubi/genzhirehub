import { z } from 'zod';

// User validation
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email(),
  role: z.enum(['student', 'company', 'admin']).default('student'),
  image: z.string().url().optional(),
});

// Student profile validation
export const studentProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  course: z.string().min(2, 'Course must be at least 2 characters').max(100),
  yearOfStudy: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Year of study is required',
  }),
  skills: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 skills allowed'),
  interests: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 interests allowed'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
});

// Company profile validation
export const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  industry: z.string().min(2, 'Industry must be at least 2 characters').max(100),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    required_error: 'Company size is required',
  }).optional(),
  founded: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  contactEmail: z.string().email('Invalid contact email').optional().or(z.literal('')),
  contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
});

const baseJobPostSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  requirements: z.string().max(1000, 'Requirements must be less than 1000 characters').optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100),
  type: z.enum(['internship', 'part-time', 'full-time'], {
    required_error: 'Job type is required',
  }),
  salaryMin: z.number().int().min(0, 'Minimum salary must be positive').optional(),
  salaryMax: z.number().int().min(0, 'Maximum salary must be positive').optional(),
  currency: z.string().default('KES'),
  skills: z.array(z.string().min(1).max(50)).max(15, 'Maximum 15 skills allowed'),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
  remote: z.boolean().default(false),
  applicationUrl: z.string().url('Invalid application URL').optional().or(z.literal('')),
});

// Job posting validation
export const jobPostSchema = baseJobPostSchema.refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin;
  }
  return true;
}, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salaryMax'],
});

// Job application validation
export const applicationSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters').max(1000),
  customCvUrl: z.string().url('Invalid CV URL').optional().or(z.literal('')),
});

// Update application status (for companies)
export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  status: z.enum(['pending', 'reviewed', 'interview', 'accepted', 'rejected'], {
    required_error: 'Application status is required',
  }),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  interviewDate: z.date().min(new Date(), 'Interview date must be in the future').optional(),
});

// Waitlist validation
export const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'company']).default('student'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  course: z.string().min(2, 'Course must be at least 2 characters').max(100).optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100).optional(),
});

// Notification validation
export const notificationSchema = z.object({
  userId: z.string(),
  type: z.string().min(1, 'Notification type is required'),
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(500),
  data: z.record(z.any()).default({}),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
}).refine((data) => {
  return data.file.size <= data.maxSize;
}, {
  message: 'File size must be less than 5MB',
  path: ['file'],
}).refine((data) => {
  return data.allowedTypes.includes(data.file.type);
}, {
  message: 'Invalid file type. Only PDF and Word documents are allowed',
  path: ['file'],
});

// Search and filter validation
export const jobSearchSchema = z.object({
  query: z.string().max(100).optional(),
  type: z.enum(['internship', 'part-time', 'full-time']).optional(),
  location: z.string().max(100).optional(),
  skills: z.array(z.string()).max(10).optional(),
  remote: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export const studentSearchSchema = z.object({
  query: z.string().max(100).optional(),
  course: z.string().max(100).optional(),
  skills: z.array(z.string()).max(10).optional(),
  yearOfStudy: z.enum(['1', '2', '3', '4', '5']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

// Form data validation helpers
export const createStudentProfileFormSchema = studentProfileSchema.extend({
  cvFile: z.instanceof(File).optional(),
});

export const createCompanyProfileFormSchema = companyProfileSchema.extend({
  logoFile: z.instanceof(File).optional(),
});

export const createJobPostFormSchema = baseJobPostSchema.extend({
  skills: z.string().transform((str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0)),
  tags: z.string().transform((str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0)),
});

// Type exports for TypeScript
export type UserSchema = z.infer<typeof userSchema>;
export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;
export type CompanyProfileSchema = z.infer<typeof companyProfileSchema>;
export type JobPostSchema = z.infer<typeof jobPostSchema>;
export type ApplicationSchema = z.infer<typeof applicationSchema>;
export type UpdateApplicationStatusSchema = z.infer<typeof updateApplicationStatusSchema>;
export type WaitlistSchema = z.infer<typeof waitlistSchema>;
export type NotificationSchema = z.infer<typeof notificationSchema>;
export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type JobSearchSchema = z.infer<typeof jobSearchSchema>;
export type StudentSearchSchema = z.infer<typeof studentSearchSchema>;
export type CreateStudentProfileFormSchema = z.infer<typeof createStudentProfileFormSchema>;
export type CreateCompanyProfileFormSchema = z.infer<typeof createCompanyProfileFormSchema>;
export type CreateJobPostFormSchema = z.infer<typeof createJobPostFormSchema>; 