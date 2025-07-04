'use client';

import { useState, useActionState } from 'react';
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
  AlertCircle
} from "lucide-react";
import { createStudentProfileAction } from '@/lib/actions/student-actions';

interface FormState {
  success: boolean;
  error?: string;
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
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [joinWaitlist, setJoinWaitlist] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

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

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setCvFile(file);
      setUploadProgress(100);
    }
  };

  const getFormProgress = () => {
    let progress = 0;
    const formData = new FormData();
    
    // Check required fields
    if (formData.get('fullName')) progress += 20;
    if (formData.get('course')) progress += 20;
    if (formData.get('yearOfStudy')) progress += 20;
    if (skills.length > 0) progress += 20;
    if (cvFile) progress += 20;
    
    return progress;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Your Student Profile</h1>
        <p className="text-lg text-muted-foreground">
          Tell us about yourself to help employers find you
        </p>
        <Progress value={getFormProgress()} className="w-full max-w-md mx-auto" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Basic information about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Hidden fields for skills and interests */}
            <input type="hidden" name="skills" value={JSON.stringify(skills)} />
            <input type="hidden" name="interests" value={JSON.stringify(interests)} />
            <input type="hidden" name="joinWaitlist" value={joinWaitlist.toString()} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  defaultValue={session?.user?.name || ''}
                />
                {state.fieldErrors?.fullName && (
                  <p className="text-sm text-red-500">{state.fieldErrors.fullName[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@university.edu"
                  defaultValue={session?.user?.email || ''}
                  disabled
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Major *</Label>
                  <Input
                    id="course"
                    name="course"
                    placeholder="Computer Science"
                    required
                  />
                  {state.fieldErrors?.course && (
                    <p className="text-sm text-red-500">{state.fieldErrors.course[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study *</Label>
                  <Select name="yearOfStudy" required>
                    <SelectTrigger>
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
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  name="university"
                  placeholder="University of Technology"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Skills & Interests
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Technical Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addSkill}
                      disabled={!newSkill.trim() || skills.length >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
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
                  <p className="text-sm text-muted-foreground">
                    Add up to 10 skills ({skills.length}/10)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest (e.g., AI, Web Dev)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addInterest}
                      disabled={!newInterest.trim() || interests.length >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="flex items-center gap-1">
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
                  <p className="text-sm text-muted-foreground">
                    Add up to 10 interests ({interests.length}/10)
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About You</h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself, your goals, and what you're looking for..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Optional - This will help employers understand your background and goals
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CV/Resume Upload
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="cv">Upload your CV/Resume</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    id="cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvUpload}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('cv')?.click()}
                      >
                        Choose File
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        PDF, DOC, or DOCX (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                {cvFile && (
                  <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      {cvFile.name} uploaded successfully
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Join Our Waitlist</h3>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  GenzHireHub is launching soon! Join our waitlist to be among the first to access 
                  exclusive job opportunities and connect with top employers.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="waitlist"
                  checked={joinWaitlist}
                  onChange={(e) => setJoinWaitlist(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="waitlist" className="text-sm">
                  Yes, I want to join the waitlist and be notified when GenzHireHub launches
                </Label>
              </div>
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Profile created successfully! Welcome to GenzHireHub.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/role')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Create Profile & Join Waitlist
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
