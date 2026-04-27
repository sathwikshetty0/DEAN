import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stats = searchParams.get('stats');

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'responder')
    .eq('is_active', true);

  if (stats !== 'true') {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
