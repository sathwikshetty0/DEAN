import assert from 'assert';
import test from 'node:test';
import { calculateDistance, calculateETA } from './formatters';

test('calculateDistance - distance between two points', () => {
  const dist = calculateDistance(12.9716, 77.5946, 13.0827, 80.2707);
  assert.ok(dist > 280 && dist < 360);
});

test('calculateETA - priority emergency response speed', () => {
  const eta = calculateETA(15);
  assert.strictEqual(eta, 21);
});