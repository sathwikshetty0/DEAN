import assert from 'assert';
import test from 'node:test';
import { alertCreateSchema } from './alerts';

test('alertCreateSchema - should validate legal input', () => {
  const parse = alertCreateSchema.safeParse({
    location_lat: 12.9716,
    location_lng: 77.5946,
    emergency_type: 'fire',
    description: 'House on fire'
  });
  assert.ok(parse.success);
});

test('alertCreateSchema - should reject invalid latitude', () => {
  const parse = alertCreateSchema.safeParse({
    location_lat: 100.5,
    location_lng: 77.5946,
    emergency_type: 'fire'
  });
  assert.ok(!parse.success);
});