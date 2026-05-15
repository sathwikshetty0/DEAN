import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

import { z } from 'zod';

const updateResponderSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean().optional(),
  is_available: z.boolean().optional(),
});

import { verifyAdmin } from '@/lib/utils/auth';
import { apiSuccess } from '@/lib/utils/api';

export async function GET(req: Request) {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  const supabase = createClient();

  const { searchParams } = new URL(req.url);
  const queryParam = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const start = (page - 1) * limit;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'responder');

  if (queryParam) {
    query = query.or(`name.ilike.%${queryParam}%,email.ilike.%${queryParam}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(start, start + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ 
    data, 
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    } 
  });
}

export async function PATCH(req: Request) {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  const supabase = createClient();

  try {
    const body = await req.json();
    const { id, ...updates } = updateResponderSchema.parse(body);

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

