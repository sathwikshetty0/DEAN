import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AlertSyncSchema = z.object({
  alerts: z.array(
    z.object({
      location_lat: z.number(),
      location_lng: z.number(),
      emergency_type: z.string(),
      description: z.string().optional(),
      status: z.string().optional(),
      queued_at: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const result = AlertSyncSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid payload', details: result.error.format() }, { status: 400 });
  }

  const { alerts } = result.data;

  const inserts = alerts.map((a) => ({
    triggered_by: user.id,
    location_lat: a.location_lat,
    location_lng: a.location_lng,
    emergency_type: a.emergency_type,
    description: a.description || '',
    routing_mode: 'p2p' as const,
    status: (a.status || 'pending') as 'pending',
    is_synced: true,
    created_at: a.queued_at
      ? new Date(typeof a.queued_at === 'number' ? a.queued_at : a.queued_at).toISOString()
      : new Date().toISOString(),
  }));

  const { data, error } = await supabase.from('alerts').insert(inserts).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (data) {
    const logs = data.map((d) => ({
      alert_id: d.id,
      alert_code: d.alert_code,
      action: 'ALERT_SYNCED_P2P',
      actor_id: user.id,
      actor_role: 'user',
      routing_mode: 'p2p',
    }));
    await supabase.from('logs').insert(logs);
  }

  return NextResponse.json({ success: true, count: data?.length });
}
