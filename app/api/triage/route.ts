import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { description, originalType } = await req.json();

    if (!description) {
      return NextResponse.json({ type: originalType, confidence: 1 });
    }

    const text = description.toLowerCase();
    let suggestedType = originalType;
    let confidence = 0.6;

    // Simulated AI Keyword Matching
    if (text.includes('fire') || text.includes('smoke') || text.includes('burning')) {
      suggestedType = 'fire';
      confidence = 0.95;
    } else if (text.includes('heart') || text.includes('breath') || text.includes('bleed') || text.includes('unconscious') || text.includes('medical')) {
      suggestedType = 'medical';
      confidence = 0.98;
    } else if (text.includes('crash') || text.includes('accident') || text.includes('hit') || text.includes('collision')) {
      suggestedType = 'accident';
      confidence = 0.92;
    } else if (text.includes('water') || text.includes('flood') || text.includes('rain') || text.includes('drown')) {
      suggestedType = 'flood';
      confidence = 0.88;
    } else if (text.includes('thief') || text.includes('gun') || text.includes('fight') || text.includes('robbery') || text.includes('crime')) {
      suggestedType = 'crime';
      confidence = 0.94;
    }

    return NextResponse.json({ 
      suggestedType, 
      confidence,
      originalType,
      isOverridden: suggestedType !== originalType 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to triage' }, { status: 500 });
  }
}
