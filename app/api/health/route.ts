/**
 * @fileoverview Utility module for route
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { NextResponse } from 'next/server';

const startedAt = Date.now();

function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export async function GET() {
  const uptimeMs = Date.now() - startedAt;

  return NextResponse.json(
    {
      status: 'ok',
      service: 'D-EAN',
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptimeMs),
      network: {
        cloud: true,
        p2pReady: true,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=10',
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
