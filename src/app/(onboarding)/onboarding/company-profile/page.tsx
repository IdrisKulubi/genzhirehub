'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Clock } from "lucide-react";

export default function CompanyProfileCreation() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Company Profile Setup</h1>
        <p className="text-lg text-muted-foreground">
          Set up your company profile to start hiring
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Company Features Coming Soon!</CardTitle>
          <CardDescription>
            We're working hard to bring you amazing hiring tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              The company dashboard and profile setup is coming in the next update. 
              For now, you can join our waitlist to be notified when it's ready!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">What's coming for companies:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Complete company profile setup</li>
              <li>• Job posting and management</li>
              <li>• Browse and search student profiles</li>
              <li>• Application management system</li>
              <li>• Advanced hiring tools and analytics</li>
              <li>• Direct messaging with candidates</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/role')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={() => router.push('/onboarding/success')}
              className="flex-1"
            >
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 