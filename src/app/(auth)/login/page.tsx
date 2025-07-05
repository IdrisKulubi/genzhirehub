"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Building2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"student" | "company">("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: "/login/callback",
        redirect: false,
      });
      
      if (result?.error) {
        console.error("Sign in error:", result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              GenzHireHub
            </h1>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            Where talent meets opportunity
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant={!isSignUp ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsSignUp(false)}
                className="rounded-full px-6"
              >
                Sign In
              </Button>
              <Button
                variant={isSignUp ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsSignUp(true)}
                className="rounded-full px-6"
              >
                Sign Up
              </Button>
            </div>
            
            <CardTitle className="text-xl">
              {isSignUp ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isSignUp 
                ? "Join thousands of students and companies" 
                : "Sign in to continue to your dashboard"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isSignUp ? "Join as" : "Continue as"}
              </Label>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={userType === "student" ? "default" : "outline"}
                  onClick={() => setUserType("student")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <GraduationCap className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Student</div>
                    <div className="text-xs opacity-70">Find opportunities</div>
                  </div>
                </Button>
                
                <Button
                  variant={userType === "company" ? "default" : "outline"}
                  onClick={() => setUserType("company")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Building2 className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Company</div>
                    <div className="text-xs opacity-70">Recruit talent</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                  {isSignUp ? "Get started with" : "Continue with"}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {isLoading ? (
                <Icons.spinner className="mr-3 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-3 h-4 w-4" />
              )}
              {isSignUp ? "Sign up with Google" : "Sign in with Google"}
            </Button>

            {/* Footer Text */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
              
              {isSignUp && (
                <p className="text-xs text-slate-400">
                  By signing up, you agree to our{" "}
                  <Link href="/" className="text-blue-600 hover:text-blue-500">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </div>

            {/* Launch Status */}
            <div className="text-center pt-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                🚀 Pre-launch • Join the waitlist
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
} 