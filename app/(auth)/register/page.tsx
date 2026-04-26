'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zap, Loader2, Mail, Lock, User, Phone, MapPin, ChevronRight, Check, Activity, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';

const AlertMap = dynamic(() => import('@/components/alert/AlertMap').then(m => m.AlertMap), { ssr: false });

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  role: z.enum(['user', 'responder']),
  skills: z.array(z.string()).optional(),
  zone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const SKILLS_OPTIONS = ['First Aid', 'CPR', 'Fire Safety', 'Search & Rescue', 'Trauma Care', 'Disaster Relief'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (searchParams.get('role') as any) === 'responder' ? 'responder' : 'user',
      skills: [],
    }
  });

  const selectedRole = watch('role');

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location captured');
      }, (err) => {
        toast.error('Location permission denied');
      });
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    if (!location) {
      toast.error('Please capture your location');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: values.role,
            phone: values.phone,
            skills: values.skills,
            zone: values.zone,
            location_lat: location.lat,
            location_lng: location.lng,
          }
        }
      });

      if (error) throw error;

      toast.success('Registration successful! Redirecting...');
      
      setTimeout(() => {
        if (values.role === 'responder') router.push('/responder');
        else router.push('/dashboard');
      }, 2500);

    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-sos fill-sos" />
            <span className="text-xl font-extrabold font-syne">D-EAN</span>
          </div>
          <NetworkBadge />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--bg-tertiary)] -translate-y-1/2 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-sos -translate-y-1/2 -z-10 transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                step === s ? "bg-sos border-sos text-white shadow-lg shadow-sos/30 scale-110" : 
                step > s ? "bg-[var(--bg-primary)] border-sos text-sos" : "bg-[var(--bg-primary)] border-[var(--bg-tertiary)] text-[var(--text-muted)]"
              )}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-syne">Basic Information</h2>
                  <p className="text-[var(--text-secondary)]">Let's start with your contact details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input {...register('name')} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="Arjun Rao" />
                    </div>
                    {errors.name && <p className="text-sos text-[10px] mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input {...register('phone')} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="+91 98765 43210" />
                    </div>
                    {errors.phone && <p className="text-sos text-[10px] mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input {...register('email')} type="email" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="arjun@example.com" />
                  </div>
                  {errors.email && <p className="text-sos text-[10px] mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input {...register('password')} type="password" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="••••••••" />
                    </div>
                    {errors.password && <p className="text-sos text-[10px] mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input {...register('confirmPassword')} type="password" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="••••••••" />
                    </div>
                    {errors.confirmPassword && <p className="text-sos text-[10px] mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-sos to-[#CC0033] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Continue to Role Selection <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-syne">Choose Your Role</h2>
                  <p className="text-[var(--text-secondary)]">Are you seeking assistance or offering it?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'user')}
                    className={clsx(
                      "p-6 rounded-2xl border-2 transition-all text-left group",
                      selectedRole === 'user' ? "bg-sos/10 border-sos shadow-[0_0_20px_rgba(255,45,85,0.2)]" : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-sos/30"
                    )}
                  >
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      selectedRole === 'user' ? "bg-sos text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:text-sos"
                    )}>
                      <Activity className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold font-syne mb-1">🙋 I need help</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Quickly trigger SOS alerts and connect with nearby help.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('role', 'responder')}
                    className={clsx(
                      "p-6 rounded-2xl border-2 transition-all text-left group",
                      selectedRole === 'responder' ? "bg-sos/10 border-sos shadow-[0_0_20px_rgba(255,45,85,0.2)]" : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-sos/30"
                    )}
                  >
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      selectedRole === 'responder' ? "bg-sos text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:text-sos"
                    )}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold font-syne mb-1">🦺 I can help</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Receive emergency alerts and provide assistance to others.</p>
                  </button>
                </div>

                {selectedRole === 'responder' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Your Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_OPTIONS.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              const current = watch('skills') || [];
                              if (current.includes(skill)) {
                                setValue('skills', current.filter(s => s !== skill));
                              } else {
                                setValue('skills', [...current, skill]);
                              }
                            }}
                            className={clsx(
                              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                              (watch('skills') || []).includes(skill) ? "bg-sos border-sos text-white" : "bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-sos/30"
                            )}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Primary Zone</label>
                      <input {...register('zone')} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-3 px-4 text-sm outline-none focus:border-sos/50 transition-colors" placeholder="e.g. Mangaluru Central" />
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-[2] py-4 rounded-xl font-bold bg-sos hover:opacity-90 transition-opacity">Continue to Location</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-syne">Verify Location</h2>
                  <p className="text-[var(--text-secondary)]">This helps us route alerts to the right people.</p>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6 overflow-hidden">
                  {!location ? (
                    <div className="aspect-video bg-[var(--bg-tertiary)] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-default)]">
                       <MapPin className="w-10 h-10 text-[var(--text-muted)] mb-4" />
                       <button 
                         type="button" 
                         onClick={requestLocation}
                         className="px-6 py-2 bg-sos rounded-full text-sm font-bold shadow-lg shadow-sos/20"
                       >
                         Enable Location Access
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AlertMap userLocation={location} size="small" />
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-xs text-green-400">
                            <Check className="w-4 h-4" />
                            <span>Location Verified</span>
                         </div>
                         <button type="button" onClick={requestLocation} className="text-xs text-sos font-bold hover:underline">Change</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 accent-sos" />
                    <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      I agree to the Terms of Service and Privacy Policy. My location data will only be used for emergency response coordination.
                    </span>
                  </label>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 rounded-xl font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading || !location}
                      className="flex-[2] py-4 rounded-xl font-bold bg-sos hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-sos font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
