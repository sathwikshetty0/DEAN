'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/** PWA shortcut: one-tap entry as citizen with SOS dashboard */
export default function QuickSOSPage() {
  const { loginAsRole, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (profile?.role === 'user') {
      router.replace('/dashboard?sos=1');
      return;
    }
    loginAsRole('user');
  }, [loading, profile, loginAsRole, router]);

  useEffect(() => {
    if (!loading && profile?.role === 'user') {
      router.replace('/dashboard?sos=1');
    }
  }, [loading, profile, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-primary)]">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-bold text-[var(--text-secondary)]">Opening emergency dashboard…</p>
    </div>
  );
}
