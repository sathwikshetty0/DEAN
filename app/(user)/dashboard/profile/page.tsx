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

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-[var(--bg-tertiary)] rounded-xl mb-2" />
        <div className="h-4 w-64 bg-[var(--bg-tertiary)] rounded-lg" />
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl h-[600px]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-extrabold font-syne tracking-tight">My Profile</h1>
        <p className="text-[var(--text-secondary)] mt-2">Manage your account settings and personal info.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20"
      >
        {/* Avatar Header */}
        <div className="bg-gradient-to-br from-[var(--red-sos)]/10 via-transparent to-transparent p-10 flex items-center gap-8 border-b border-[var(--border-default)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--red-sos)]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--red-sos)] to-[#CC0033] flex items-center justify-center text-4xl font-extrabold shadow-2xl shadow-[var(--red-sos)]/30 relative z-10"
          >
            {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
          </motion.div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold font-syne">{profile?.name}</h2>
            <p className="text-[var(--text-secondary)] font-medium">{profile?.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full text-[10px] font-black text-green-400 border border-green-500/20 uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                {profile?.role}
              </div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                Member since {profile?.created_at ? new Date(profile.created_at).getFullYear() : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-px bg-[var(--border-default)]">
          <motion.div 
            whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
            className="bg-[var(--bg-secondary)] p-8 text-center transition-colors"
          >
            <div className="text-3xl font-extrabold font-syne text-[var(--red-sos)]">{profile?.total_alerts_sent ?? 0}</div>
            <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">Alerts Sent</div>
          </motion.div>
          <motion.div 
            whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
            className="bg-[var(--bg-secondary)] p-8 text-center transition-colors"
          >
            <div className="text-3xl font-extrabold font-syne text-green-500">{profile?.total_alerts_responded ?? 0}</div>
            <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">Responses</div>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--red-sos)] transition-colors" />
                <input
                  {...register('name')}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-[var(--red-sos)]/50 focus:ring-4 focus:ring-[var(--red-sos)]/5 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <p className="text-[var(--red-sos)] text-[10px] font-bold mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--red-sos)] transition-colors" />
                <input
                  {...register('phone')}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-[var(--red-sos)]/50 focus:ring-4 focus:ring-[var(--red-sos)]/5 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.phone && <p className="text-[var(--red-sos)] text-[10px] font-bold mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]/50" />
              <input
                value={profile?.email ?? ''}
                readOnly
                className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-[var(--text-muted)] cursor-not-allowed opacity-60"
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] italic">Email cannot be changed manually.</p>
          </div>

          {profile?.location_lat && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400/70">Last Known Location</div>
                <div className="text-xs font-bold text-[var(--text-secondary)]">
                  {profile.location_lat.toFixed(6)}, {profile.location_lng?.toFixed(6)}
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="w-full py-5 bg-gradient-to-r from-[var(--red-sos)] to-[#CC0033] rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[var(--red-sos)]/40 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
