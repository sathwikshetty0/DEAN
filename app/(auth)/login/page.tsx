'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zap, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Fetch profile to redirect
      const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      toast.success('Welcome back!');
      
      const role = profile.role;
      if (role === 'admin') router.push('/admin');
      else if (role === 'responder') router.push('/responder');
      else router.push('/dashboard');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[40%] bg-[var(--bg-secondary)] border-r border-[var(--border-default)] relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-sos/5 blur-[100px] -z-10" />
        
        <div className="relative">
          <div className="text-sos mb-8">
            <Zap className="w-12 h-12 fill-sos" />
          </div>
          <h2 className="text-4xl font-extrabold font-syne mb-6 leading-tight">
            "Your safety shouldn't depend on a cell tower."
          </h2>
          <p className="text-[var(--text-secondary)] text-lg font-medium">
            Join the decentralized network built forMangaluru's community resilience.
          </p>
          
          <div className="mt-12 space-y-4">
             <div className="flex items-center gap-3 p-4 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)]">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                <span className="text-sm font-medium">Cloud Mode: Active</span>
             </div>
             <div className="flex items-center gap-3 p-4 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)]">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#F59E0B]" />
                <span className="text-sm font-medium">P2P Routing: Ready</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-8 right-8">
          <NetworkBadge />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4 lg:hidden">
               <Zap className="w-10 h-10 text-sos fill-sos" />
            </div>
            <h1 className="text-3xl font-extrabold font-syne mb-2">Welcome back</h1>
            <p className="text-[var(--text-secondary)]">Enter your details to access the network.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-sos transition-colors" />
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] focus:border-sos/50 focus:ring-1 focus:ring-sos/20 rounded-2xl py-4 pl-12 pr-4 text-sm transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-sos text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-sos transition-colors" />
                <input 
                  {...register('password')}
                  type="password"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] focus:border-sos/50 focus:ring-1 focus:ring-sos/20 rounded-2xl py-4 pl-12 pr-4 text-sm transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-sos text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sos to-[#CC0033] text-white font-bold py-4 rounded-2xl shadow-lg shadow-sos/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link href="/register" className="text-sos font-bold hover:underline">
              Join D-EAN
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
