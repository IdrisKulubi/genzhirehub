'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GraduationCap, Building2, CheckCircle, Loader2 } from "lucide-react";
import { setUserRoleAction } from '@/lib/actions/user-actions';
import { cn } from '@/lib/utils';

export default function RoleSelection() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleRoleSelect = async (role: 'student' | 'company') => {
    if (!session?.user || loading) {
      return;
    }

    setLoading(true);
    setSelectedRole(role);

    try {
      const result = await setUserRoleAction(role);
      if (result.success) {
        router.push(`/onboarding/${role}-profile`);
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

  const roles = [
    {
      id: 'student',
      title: 'Student',
      subtitle: 'Find your next opportunity',
      description: 'Access internships, part-time jobs, and graduate positions.',
      icon: GraduationCap,
      features: [
        'Create your professional profile',
        'Showcase skills and projects',
        'Connect with top employers'
      ],
      colorClasses: {
        iconContainer: 'bg-blue-900/30',
        icon: 'text-blue-400',
        hoverBorder: 'hover:border-blue-500/50',
        ring: 'ring-blue-500',
        bullet: 'bg-blue-500',
      },
    },
    {
      id: 'company',
      title: 'Company',
      subtitle: 'Discover top talent',
      description: 'Connect with skilled students and fresh graduates.',
      icon: Building2,
      features: [
        'Build out your company profile',
        'Post job opportunities',
        'Browse and filter candidates'
      ],
      colorClasses: {
        iconContainer: 'bg-green-900/30',
        icon: 'text-green-400',
        hoverBorder: 'hover:border-green-500/50',
        ring: 'ring-green-500',
        bullet: 'bg-green-500',
      },
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-2 sm:p-6 lg:p-4">
      <div className="w-full max-w-5xl text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-slate-700">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            Step 1 of 3
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Welcome to GenzHireHub
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Choose your path to get started with your personalized experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isLoading = loading && isSelected;

            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id as 'student' | 'company')}
                className={cn(
                  'bg-[#161B22] border border-slate-800 rounded-2xl p-8 cursor-pointer group transition-all duration-300 relative',
                  role.colorClasses.hoverBorder,
                  isSelected && `ring-2 ring-offset-4 ring-offset-[#0D1117] ${role.colorClasses.ring}`,
                  loading && !isSelected && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-[#161B22]/50 flex items-center justify-center rounded-2xl z-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                <div className={cn("flex flex-col items-center text-center", isLoading && "opacity-50")}>
                  <div className={cn("h-20 w-20 rounded-2xl flex items-center justify-center mb-6", role.colorClasses.iconContainer)}>
                    <Icon className={cn("h-10 w-10", role.colorClasses.icon)} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{role.title}</h2>
                  <p className="text-slate-400 mb-4">{role.subtitle}</p>
                  <p className="text-slate-500 text-sm mb-8 h-10">{role.description}</p>
                  
                  <ul className="text-left space-y-3 text-slate-400 text-sm w-full">
                    {role.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className={cn("h-1.5 w-1.5 rounded-full", role.colorClasses.bullet)}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            You can change your account type later in settings.
          </p>
        </div>
      </div>
    </div>
  );
}
