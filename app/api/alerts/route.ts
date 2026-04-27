import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    if (!user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Basic validation
    if (!body.location_lat || !body.location_lng || !body.emergency_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error: insertError } = await supabase
      .from('alerts')
      .insert({ 
        triggered_by: user.id, 
        location_lat: body.location_lat,
        location_lng: body.location_lng,
        emergency_type: body.emergency_type,
        description: body.description,
        routing_mode: body.routing_mode || 'cloud',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Alert insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Failed to create alert record' }, { status: 500 });
    }

    // Log the action (non-blocking, don't crash if log fails)
    try {
      await supabase.from('logs').insert({
        alert_id: data.id,
        alert_code: data.alert_code,
        action: 'ALERT_CREATED',
        actor_id: user.id,
        actor_role: 'user',
        routing_mode: data.routing_mode,
      });
    } catch (logErr) {
      console.error('Logging error (non-fatal):', logErr);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error('Unexpected API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const mine = searchParams.get('mine');
  const active = searchParams.get('active');

  let query = supabase.from('alerts').select('*');

  if (mine === 'true') {
    query = query.eq('triggered_by', user.id);
  }

  if (active === 'true') {
    query = query.in('status', ['pending', 'accepted', 'en_route']);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
