/**
 * @fileoverview Utility module for route
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { lat, lng } = await req.json();
  if (lat == null || lng == null) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const { error } = await (supabase.from('profiles') as any)
    .update({
      location_lat: lat,
      location_lng: lng,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
