import { getAuthenticatedUser } from '@/lib/auth-server';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/utils/api';
import { alertCreateSchema } from '@/lib/validations/alerts';

export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    if (!user || !supabase) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    
    // Zod validation
    const validation = alertCreateSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.errors[0].message, 400);
    }

    const data_input = validation.data;

    const getPriority = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
      switch (type) {
        case 'medical': return 'critical';
        case 'fire': return 'critical';
        case 'accident': return 'high';
        case 'flood': return 'high';
        case 'crime': return 'high';
        default: return 'medium';
      }
    };

    const priority = getPriority(data_input.emergency_type);

    const { data, error: insertError } = await supabase
      .from('alerts')
      .insert({ 
        triggered_by: user.id, 
        location_lat: data_input.location_lat,
        location_lng: data_input.location_lng,
        emergency_type: data_input.emergency_type,
        description: data_input.description,
        routing_mode: data_input.routing_mode,
        status: 'pending',
        priority
      })
      .select()
      .single();

    if (insertError) {
      console.error('Alert insert error:', insertError);
      return apiError(insertError.message, 500);
    }

    if (!data) {
      return apiError('Failed to create alert record', 500);
    }

    // Log the action (non-blocking)
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

    return apiSuccess(data, 201, 'Alert created successfully');
  } catch (err: any) {
    console.error('Unexpected API error:', err);
    return apiError(err.message || 'Internal Server Error', 500);
  }
}

export async function GET(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user || !supabase) return apiError('Unauthorized', 401);

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

  if (error) return apiError(error.message, 500);

  return apiSuccess(data);
}
