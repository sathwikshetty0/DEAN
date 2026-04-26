'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Loader2, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().min(10, 'Invalid phone').or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const { profile, user } = useAuth();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ name: values.name, phone: values.phone })
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
        <h1 className="text-3xl font-extrabold font-syne">My Profile</h1>
        <p className="text-[var(--text-secondary)]">Manage your account settings and personal info.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden"
      >
        {/* Avatar Header */}
        <div className="bg-gradient-to-r from-[var(--red-sos)]/20 to-transparent p-8 flex items-center gap-6 border-b border-[var(--border-default)]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--red-sos)] to-[#CC0033] flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-[var(--red-sos)]/20">
            {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-syne">{profile?.name}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full text-[10px] font-bold text-green-400 border border-green-500/20">
                <Shield className="w-3 h-3" />
                {profile?.role?.toUpperCase()}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">
                Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-[var(--border-default)]">
          <div className="bg-[var(--bg-secondary)] p-6 text-center">
            <div className="text-2xl font-extrabold font-syne">{profile?.total_alerts_sent ?? 0}</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Alerts Sent</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-6 text-center">
            <div className="text-2xl font-extrabold font-syne">{profile?.total_alerts_responded ?? 0}</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Responses</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                {...register('name')}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--red-sos)]/50 transition-colors"
              />
            </div>
            {errors.name && <p className="text-[var(--red-sos)] text-[10px]">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                value={profile?.email ?? ''}
                readOnly
                className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-muted)] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                {...register('phone')}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--red-sos)]/50 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.phone && <p className="text-[var(--red-sos)] text-[10px]">{errors.phone.message}</p>}
          </div>

          {profile?.location_lat && (
            <div className="flex items-center gap-2 p-4 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-default)]">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-xs text-[var(--text-secondary)]">
                Last location: {profile.location_lat.toFixed(4)}, {profile.location_lng?.toFixed(4)}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-[var(--red-sos)] to-[#CC0033] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
