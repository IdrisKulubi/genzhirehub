'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Building2, Users, Briefcase } from "lucide-react";
import { setUserRoleAction } from '@/lib/actions/user-actions';

export default function RoleSelection() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleRoleSelect = async (role: 'student' | 'company') => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setSelectedRole(role);

    try {
      const result = await setUserRoleAction(role);
      
      if (result.success) {
        if (role === 'student') {
          router.push('/onboarding/student-profile');
        } else {
          router.push('/onboarding/company-profile');
        }
      } else {
        console.error('Failed to set role:', result.error);
        setLoading(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error setting role:', error);
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to GenzHireHub! 🚀</h1>
        <p className="text-lg text-muted-foreground">
          Let's get you set up. Are you a student looking for opportunities or a company looking to hire?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === 'student' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => !loading && handleRoleSelect('student')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">I'm a Student</CardTitle>
            <CardDescription>
              Looking for internships, part-time jobs, or graduate opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What you'll do:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create your profile with skills and interests</li>
                <li>• Upload your CV or resume</li>
                <li>• Browse and apply for opportunities</li>
                <li>• Connect with employers</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                Join 10,000+ students
              </Badge>
            </div>
            <Button 
              className="w-full" 
              disabled={loading}
              variant={selectedRole === 'student' ? 'default' : 'outline'}
            >
              {loading && selectedRole === 'student' ? 'Setting up...' : 'Continue as Student'}
            </Button>
          </CardContent>
        </Card>

        {/* Company Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === 'company' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => !loading && handleRoleSelect('company')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">I'm a Company</CardTitle>
            <CardDescription>
              Looking to hire talented students and fresh graduates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What you'll do:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set up your company profile</li>
                <li>• Post job opportunities</li>
                <li>• Browse student profiles</li>
                <li>• Connect with top talent</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Briefcase className="h-3 w-3 mr-1" />
                Join 500+ companies
              </Badge>
            </div>
            <Button 
              className="w-full" 
              disabled={loading}
              variant={selectedRole === 'company' ? 'default' : 'outline'}
            >
              {loading && selectedRole === 'company' ? 'Setting up...' : 'Continue as Company'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Don't worry, you can always change this later in your settings.</p>
      </div>
    </div>
  );
}
