import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { alerts } = await req.json();
  if (!alerts || !Array.isArray(alerts)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const inserts = alerts.map((a: any) => ({
    triggered_by: user.id,
    location_lat: a.location_lat,
    location_lng: a.location_lng,
    emergency_type: a.emergency_type,
    description: a.description,
    routing_mode: 'p2p',
    status: a.status || 'pending',
    is_synced: true,
    created_at: a.queued_at ? new Date(a.queued_at).toISOString() : new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('alerts')
    .insert(inserts)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log the sync
  if (data) {
    const logs = data.map(d => ({
      alert_id: d.id,
      alert_code: d.alert_code,
      action: 'ALERT_SYNCED_P2P',
      actor_id: user.id,
      actor_role: 'user',
      routing_mode: 'p2p'
    }));
    await supabase.from('logs').insert(logs);
  }

  return NextResponse.json({ success: true, count: data?.length });
}
