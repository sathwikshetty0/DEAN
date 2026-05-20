'use client';

/**
 * @fileoverview UI Component for page
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Loader2, Save, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const SKILLS_OPTIONS = ['First Aid', 'CPR', 'Fire Safety', 'Search & Rescue', 'Trauma Care', 'Disaster Relief', 'Flood'];

const responderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).or(z.literal('')),
  zone: z.string().optional(),
});

type FormValues = z.infer<typeof responderSchema>;

export default function ResponderProfilePage() {
  const { profile, user } = useAuth();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(responderSchema),
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      zone: profile?.zone ?? '',
    },
  });

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ name: values.name, phone: values.phone, zone: values.zone, skills })
        .eq('id', user?.id ?? '');

      if (error) throw error;
      toast.success('Profile updated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-syne">Responder Profile</h1>
        <p className="text-[var(--text-secondary)]">Update your skills, zone, and contact info.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-8 flex items-center gap-6 border-b border-[var(--border-default)]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-500/20">
            {profile?.name?.charAt(0).toUpperCase() ?? 'R'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-syne">{profile?.name}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-full text-[10px] font-bold text-blue-400 border border-blue-500/20">
                <Shield className="w-3 h-3" /> RESPONDER
              </div>
              <div className={clsx(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border',
                profile?.is_available
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-default)]'
              )}>
                {profile?.is_available ? '⚡ Available' : '⏸ Away'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-[var(--border-default)]">
          <div className="bg-[var(--bg-secondary)] p-5 text-center">
            <div className="text-xl font-extrabold font-syne">{profile?.total_alerts_responded ?? 0}</div>
            <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Responses</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-5 text-center">
            <div className="text-xl font-extrabold font-syne text-green-400">98%</div>
            <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Success</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-5 text-center">
            <div className="text-xl font-extrabold font-syne">{profile?.zone ?? '—'}</div>
            <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Zone</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('name')} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors" />
              </div>
              {errors.name && <p className="text-[var(--red-sos)] text-[10px]">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('phone')} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Coverage Zone</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input {...register('zone')} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g. Mangaluru Central" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
              <Award className="w-3 h-3" /> Your Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    skills.includes(skill)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-blue-500/30'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
