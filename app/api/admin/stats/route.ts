import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { count: activeAlerts } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'accepted', 'en_route']);
    
  const { count: resolvedToday } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  const { count: onlineResponders } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'responder')
    .eq('is_available', true);

  return NextResponse.json({
    activeAlerts: activeAlerts || 0,
    resolvedToday: resolvedToday || 0,
    onlineResponders: onlineResponders || 0,
    p2pEvents: 14 // Mock for now
  });
}
