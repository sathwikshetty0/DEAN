/**
 * @fileoverview Utility module for triage
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { EmergencyType } from '@/lib/types/app.types';

export type TriageSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface TriageResult {
  suggestedType: EmergencyType;
  confidence: number;
  severity: TriageSeverity;
  priorityScore: number;
  keywords: string[];
  isOverridden: boolean;
  suggestedActions: string[];
}

type Rule = {
  type: EmergencyType;
  patterns: RegExp[];
  weight: number;
  severity: TriageSeverity;
  actions: string[];
};

const RULES: Rule[] = [
  {
    type: 'fire',
    patterns: [
      /\b(fire|smoke|burning|flame|blaze|ignit|gas leak)\b/i,
      /\b(ಬೆಂಕಿ|ಹೊತ್ತಿ)\b/,
    ],
    weight: 0.95,
    severity: 'critical',
    actions: ['Evacuate immediately', 'Stay low under smoke', 'Do not use elevators'],
  },
  {
    type: 'medical',
    patterns: [
      /\b(heart|cardiac|chest pain|breath|unconscious|bleed|stroke|seizure|medical|ambulance|injured)\b/i,
      /\b(ಚಾತುರ್ಯ|ಉಸಿರಾಟ|ರಕ್ತ)\b/,
    ],
    weight: 0.98,
    severity: 'critical',
    actions: ['Check breathing and pulse', 'Do not move if spinal injury suspected', 'Apply pressure to bleeding'],
  },
  {
    type: 'accident',
    patterns: [
      /\b(crash|accident|collision|hit by|overturn|vehicle|road)\b/i,
    ],
    weight: 0.92,
    severity: 'high',
    actions: ['Secure the scene', 'Do not move injured unless in danger', 'Turn off ignitions if safe'],
  },
  {
    type: 'flood',
    patterns: [
      /\b(flood|water rising|drown|submerged|landslide|cyclone|rain)\b/i,
      /\b(ಪ್ರವಾಹ|ನೀರು)\b/,
    ],
    weight: 0.88,
    severity: 'high',
    actions: ['Move to higher ground', 'Avoid electrical equipment', 'Never walk through flowing water'],
  },
  {
    type: 'crime',
    patterns: [
      /\b(robbery|theft|gun|knife|assault|fight|attack|intruder|crime|harass)\b/i,
    ],
    weight: 0.94,
    severity: 'high',
    actions: ['Move to a safe location', 'Do not confront', 'Note descriptions if safe'],
  },
  {
    type: 'other',
    patterns: [/\b(help|emergency|sos|danger|stuck|trapped)\b/i],
    weight: 0.7,
    severity: 'medium',
    actions: ['Stay calm', 'Share your exact location', 'Wait for responder contact'],
  },
];

const SEVERITY_SCORE: Record<TriageSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function triageDescription(
  description: string,
  originalType: EmergencyType
): TriageResult {
  const text = description.trim();
  if (!text) {
    return {
      suggestedType: originalType,
      confidence: 1,
      severity: 'medium',
      priorityScore: 2,
      keywords: [],
      isOverridden: false,
      suggestedActions: [],
    };
  }

  let best: Rule | null = null;
  let bestHits = 0;
  const keywords: string[] = [];

  for (const rule of RULES) {
    let hits = 0;
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        hits += 1;
        keywords.push(match[0]);
      }
    }
    if (hits > bestHits) {
      bestHits = hits;
      best = rule;
    }
  }

  const suggestedType = best?.type ?? originalType;
  const confidence = best ? Math.min(best.weight + bestHits * 0.02, 0.99) : 0.55;
  const severity = best?.severity ?? 'medium';

  return {
    suggestedType,
    confidence,
    severity,
    priorityScore: SEVERITY_SCORE[severity] + (confidence > 0.9 ? 1 : 0),
    keywords: [...new Set(keywords)],
    isOverridden: suggestedType !== originalType,
    suggestedActions: best?.actions ?? [],
  };
}
