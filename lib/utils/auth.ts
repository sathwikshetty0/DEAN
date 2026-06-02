/**
 * @fileoverview Utility module for auth
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { createClient } from '@/lib/supabase/server';
import { apiError } from './api';

/**
 * Verifies if the current user has the 'admin' role.
 * Returns the profile if successful, otherwise throws an error response.
 */
export async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: apiError('Authentication required', 401), user: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Mock credentials fallback check updated
  if (error || profile?.role !== 'admin') {
    return { error: apiError('Administrative privileges required', 403), user: null };
  }

  return { error: null, user, profile };
}
