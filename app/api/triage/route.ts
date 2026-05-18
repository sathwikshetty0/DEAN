/**
 * @fileoverview Utility module for route
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { NextResponse } from 'next/server';
import { triageDescription } from '@/lib/utils/triage';
import { EmergencyType } from '@/lib/types/app.types';

export async function POST(req: Request) {
  try {
    const { description, originalType } = await req.json();
    const type = (originalType ?? 'medical') as EmergencyType;

    if (!description?.trim()) {
      return NextResponse.json({
        suggestedType: type,
        confidence: 1,
        severity: 'medium',
        priorityScore: 2,
        keywords: [],
        isOverridden: false,
        suggestedActions: [],
      });
    }

    const result = triageDescription(description, type);

    return NextResponse.json({
      suggestedType: result.suggestedType,
      confidence: result.confidence,
      severity: result.severity,
      priorityScore: result.priorityScore,
      keywords: result.keywords,
      originalType: type,
      isOverridden: result.isOverridden,
      suggestedActions: result.suggestedActions,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to triage' }, { status: 500 });
  }
}
