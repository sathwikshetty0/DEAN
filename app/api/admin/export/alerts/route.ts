/**
 * @fileoverview Utility module for route
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: alerts } = await supabase
    .from('alerts')
    .select('alert_code, emergency_type, status, routing_mode, created_at')
    .order('created_at', { ascending: false });

  if (!alerts) return new Response('No data', { status: 404 });

  const headers = ['Alert Code', 'Type', 'Status', 'Mode', 'Created At'];
  const rows = (alerts as any[]).map(a => [
    a.alert_code,
    a.emergency_type,
    a.status,
    a.routing_mode,
    a.created_at
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=dean-alerts-${new Date().toISOString().split('T')[0]}.csv`
    }
  });
}
