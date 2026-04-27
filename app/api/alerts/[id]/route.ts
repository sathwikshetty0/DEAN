import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('alerts')
    .select(`
      *,
      triggered_by:profiles!alerts_triggered_by_fkey(*),
      assigned_responder:profiles!alerts_assigned_responder_fkey(*),
      timeline:alert_timeline(*)
    `)
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { status, responder_lat, responder_lng } = body;

  const updateData: any = {};
  if (status) {
    updateData.status = status;
    if (status === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
      updateData.assigned_responder = user.id;
    } else if (status === 'en_route') {
      updateData.en_route_at = new Date().toISOString();
    } else if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }
  }

  if (responder_lat !== undefined) updateData.responder_lat = responder_lat;
  if (responder_lng !== undefined) updateData.responder_lng = responder_lng;

  const { data, error } = await supabase
    .from('alerts')
    .update(updateData)
    .eq('id', params.id)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log action
  await supabase.from('logs').insert({
    alert_id: data.id,
    alert_code: data.alert_code,
    action: `STATUS_UPDATE_${status.toUpperCase()}`,
    actor_id: user.id,
    actor_role: 'responder',
    metadata: { status }
  });

  return NextResponse.json({ data });
}
