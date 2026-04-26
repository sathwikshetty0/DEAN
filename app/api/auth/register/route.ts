import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, phone, skills, zone } = body;

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (skills) updates.skills = skills;
  if (zone) updates.zone = zone;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
