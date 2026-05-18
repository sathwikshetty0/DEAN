/**
 * @fileoverview Utility module for route
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, phone, skills, zone, location_lat, location_lng } = body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (skills) updateData.skills = skills;
  if (zone) updateData.zone = zone;
  if (location_lat !== undefined) {
    updateData.location_lat = location_lat;
    updateData.location_updated_at = new Date().toISOString();
  }
  if (location_lng !== undefined) {
    updateData.location_lng = location_lng;
    updateData.location_updated_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
