/**
 * @fileoverview Utility module for client
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
