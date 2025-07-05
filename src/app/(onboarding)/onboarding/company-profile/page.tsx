'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle, ArrowLeft, ArrowRight, ListChecks } from "lucide-react";

export default function CompanyProfileCreation() {
  const router = useRouter();

  const comingSoonFeatures = [
    'Complete company profile setup',
    'Job posting and management tools',
    'Advanced student search and filtering',
    'Streamlined application management',
    'Direct messaging with candidates',
    'Hiring analytics and reporting'
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-slate-700">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Step 2 of 3
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Company Features
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            We're building a powerful hiring toolkit for you.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
           
            <h2 className="text-3xl font-bold mb-3">Launching Soon!</h2>
            <p className="text-slate-400 mb-8 max-w-lg">
              Our company dashboard is under construction. Join the waitlist to be the first to know when it's live.
            </p>

            <Alert className="text-left bg-slate-800 border-slate-700 text-slate-300 mb-10">
              <Clock className="h-5 w-5 text-green-400" />
              <AlertDescription>
                You've secured your spot! We'll notify you as soon as the company features are ready for launch.
              </AlertDescription>
            </Alert>
            
            <div className="text-left w-full max-w-md mx-auto mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <ListChecks className="h-6 w-6 text-green-400" />
                    What's coming for companies:
                </h3>
                <ul className="space-y-3 text-slate-400">
                    {comingSoonFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        {feature}
                    </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/role')}
                className="flex-1 h-12 bg-transparent text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={() => router.push('/onboarding/success')}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
              >
                Join Waitlist & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            Thank you for your patience. We're excited to have you on board!
          </p>
        </div>
      </div>
    </div>
  );
} 