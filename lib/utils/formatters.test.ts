import assert from 'assert';
import test from 'node:test';
import { calculateDistance, calculateETA, formatPhone } from './formatters';

test('calculateDistance - distance between two points', () => {
  const dist = calculateDistance(12.9716, 77.5946, 13.0827, 80.2707);
  assert.ok(dist > 280 && dist < 360);
});

test('calculateETA - priority emergency response speed', () => {
  const eta = calculateETA(15);
  assert.strictEqual(eta, 21);
});

test('formatPhone - formats 10-digit Indian mobile numbers', () => {
  assert.strictEqual(formatPhone('8123456789'), '+91 81234-56789');
});

test('formatPhone - formats 12-digit Indian numbers with country code', () => {
  assert.strictEqual(formatPhone('918123456789'), '+91 81234-56789');
});

test('formatPhone - keeps alphanumeric input unchanged when it is not a standard phone number', () => {
  assert.strictEqual(formatPhone('N/A'), 'N/A');
});