'use client';

import React, { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  User, 
  GraduationCap, 
  Briefcase, 
  Link,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { createStudentProfileAction, updateStudentCVAction } from '@/lib/actions/student-actions';
import CVUpload from '@/components/forms/cv-upload';
import { toast } from 'sonner';

interface FormState {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

const initialState: FormState = {
  success: false,
  error: undefined,
  fieldErrors: undefined,
};

export default function StudentProfileCreation() {
  const [state, formAction] = useActionState(createStudentProfileAction, initialState);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [cvUrl, setCvUrl] = useState<string>('');
  const [joinWaitlist, setJoinWaitlist] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state to preserve values during validation errors
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    yearOfStudy: '',
    university: '',
    bio: '',
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    phone: '',
    location: ''
  });
  
  const router = useRouter();
  const { data: session } = useSession();

  // Initialize form data with session values
  React.useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
      }));
    }
  }, [session]);

  // Handle form submission results with toast notifications
  React.useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Profile created successfully!', {
        description: 'Welcome to GenzHireHub! Redirecting...',
        duration: 3000,
      });
      
      // Small delay to show success message, then redirect
      const timer = setTimeout(() => {
        router.push('/onboarding/success');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    if (state.error) {
      toast.error('Profile Creation Failed', {
        description: state.error,
        duration: 5000,
      });
    }
  }, [state.success, state.error, state.message, router]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 10) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim()) && interests.length < 10) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleCvUploadSuccess = async (url: string, key: string) => {
    setCvUrl(url);
    toast.success('CV uploaded successfully!', {
      description: 'Your CV has been uploaded and saved.',
      duration: 3000,
    });
    
    // Update the student profile with the new CV URL
    try {
      await updateStudentCVAction(url);
    } catch (error) {
      console.error('Failed to update CV URL:', error);
      toast.error('Failed to save CV', {
        description: 'CV uploaded but failed to save to profile. Please try again.',
        duration: 5000,
      });
    }
  };

  const handleCvUploadError = (error: string) => {
    console.error('CV upload error:', error);
    toast.error('CV Upload Failed', {
      description: error,
      duration: 5000,
    });
  };

  const handleCvDelete = () => {
    setCvUrl('');
    toast.success('CV removed', {
      description: 'Your CV has been removed from your profile.',
      duration: 3000,
    });
  };

  const getFormProgress = () => {
    let progress = 0;
    
    // Check required fields
    if (formData.fullName.trim()) progress += 20;
    if (formData.course.trim()) progress += 20;
    if (formData.yearOfStudy) progress += 20;
    if (skills.length > 0) progress += 20;
    if (cvUrl) progress += 20;
    
    return progress;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enhanced form submission with client-side validation
  const handleFormSubmit = async (formDataSubmission: FormData) => {
    // Add controlled form data to FormData
    Object.entries(formData).forEach(([key, value]) => {
      formDataSubmission.set(key, value);
    });

    // Client-side validation for better UX
    if (!formData.fullName.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter your full name',
        duration: 4000,
      });
      return;
    }

    if (!formData.course.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter your course/major',
        duration: 4000,
      });
      return;
    }

    if (!formData.yearOfStudy) {
      toast.error('Missing Information', {
        description: 'Please select your year of study',
        duration: 4000,
      });
      return;
    }

    if (skills.length === 0) {
      toast.error('Missing Information', {
        description: 'Please add at least one skill',
        duration: 4000,
      });
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Submit the form
      await formAction(formDataSubmission);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            Step 2 of 3
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Create Your Profile
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Tell us about yourself to help employers discover your potential
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Profile Completion</span>
              <span>{getFormProgress()}%</span>
            </div>
            <Progress value={getFormProgress()} className="h-2" />
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form action={handleFormSubmit} className="space-y-8">
                {/* Hidden fields for skills and interests */}
                <input type="hidden" name="skills" value={JSON.stringify(skills)} />
                <input type="hidden" name="interests" value={JSON.stringify(interests)} />
                <input type="hidden" name="joinWaitlist" value={joinWaitlist.toString()} />

                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Basic information about yourself</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="h-12"
                      />
                      {state.fieldErrors?.fullName && (
                        <p className="text-sm text-red-500">{state.fieldErrors.fullName[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@university.edu"
                        value={session?.user?.email || ''}
                        disabled
                        className="h-12 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Education */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Education</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Your academic background</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">Course/Major *</Label>
                      <Input
                        id="course"
                        name="course"
                        placeholder="Computer Science"
                        required
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                        className="h-12"
                      />
                      {state.fieldErrors?.course && (
                        <p className="text-sm text-red-500">{state.fieldErrors.course[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy" className="text-sm font-medium">Year of Study *</Label>
                      <Select 
                        name="yearOfStudy" 
                        required 
                        value={formData.yearOfStudy}
                        onValueChange={(value) => handleInputChange('yearOfStudy', value)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.fieldErrors?.yearOfStudy && (
                        <p className="text-sm text-red-500">{state.fieldErrors.yearOfStudy[0]}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-sm font-medium">University</Label>
                    <Input
                      id="university"
                      name="university"
                      placeholder="University of Technology"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Skills & Interests */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Skills & Interests</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">What you're good at and passionate about</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Technical Skills *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill (e.g., React, Python)"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          className="h-12"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addSkill}
                          disabled={!newSkill.trim() || skills.length >= 10}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <p className={`text-sm ${skills.length === 0 ? 'text-red-500' : 'text-slate-500'}`}>
                        {skills.length === 0 
                          ? 'Please add at least 1 skill (0/10)' 
                          : `Add up to 10 skills (${skills.length}/10)`
                        }
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Interests</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add an interest (e.g., AI, Web Dev)"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                          className="h-12"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addInterest}
                          disabled={!newInterest.trim() || interests.length >= 10}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="flex items-center gap-1 px-3 py-1">
                            {interest}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent"
                              onClick={() => removeInterest(interest)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-slate-500">
                        Add up to 10 interests ({interests.length}/10)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* About You */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">About You</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Tell us more about yourself</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself, your goals, and what you're looking for..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="resize-none"
                      />
                      <p className="text-sm text-slate-500">
                        Optional - This will help employers understand your background and goals
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn Profile</Label>
                      <Input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* CV Upload */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">CV/Resume Upload</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Upload your CV to showcase your experience</p>
                    </div>
                  </div>

                  <CVUpload
                    onUploadSuccess={handleCvUploadSuccess}
                    onUploadError={handleCvUploadError}
                    onDelete={handleCvDelete}
                    initialFileUrl={cvUrl}
                  />
                </div>

                <Separator className="my-8" />

                {/* Waitlist */}
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                      GenzHireHub is launching soon! Join our waitlist to be among the first to access 
                      exclusive job opportunities and connect with top employers.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="waitlist"
                      checked={joinWaitlist}
                      onChange={(e) => setJoinWaitlist(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="waitlist" className="text-sm font-medium">
                      Yes, I want to join the waitlist and be notified when GenzHireHub launches
                    </Label>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {state.error && !state.success && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                {state.success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      Profile created successfully! Redirecting to welcome page...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/onboarding/role')}
                    className="flex-1 h-12"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100" 
                    disabled={isSubmitting || state.success}
                  >
                    {state.success ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Profile Created!
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        Create Profile & Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
