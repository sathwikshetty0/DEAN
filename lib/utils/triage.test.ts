import assert from 'assert';
import test from 'node:test';
import { triageDescription } from './triage';

test('triageDescription - should classify fire correctly', () => {
  const res = triageDescription('There is a huge blaze and smoke coming out of the kitchen', 'other');
  assert.strictEqual(res.suggestedType, 'fire');
  assert.strictEqual(res.severity, 'critical');
});

test('triageDescription - should classify medical correctly', () => {
  const res = triageDescription('The patient is bleeding and needs an ambulance', 'other');
  assert.strictEqual(res.suggestedType, 'medical');
  assert.strictEqual(res.severity, 'critical');
});