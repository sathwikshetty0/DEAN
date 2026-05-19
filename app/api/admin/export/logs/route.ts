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

  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (!logs || logs.length === 0) return new Response('No data', { status: 404 });

  const headers = ['Timestamp', 'Action', 'Actor ID', 'Role', 'Alert Code', 'Mode'];
  const rows = (logs as any[]).map(l => [
    l.created_at,
    l.action,
    l.actor_id ?? '',
    l.actor_role ?? '',
    l.alert_code ?? '',
    l.routing_mode ?? '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="dean-logs-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
