/**
 * @fileoverview Utility module for alerts
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { z } from 'zod';

/**
 * Schema for creating a new SOS alert
 */
export const alertCreateSchema = z.object({
  location_lat: z.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }).min(-90).max(90),
  location_lng: z.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }).min(-180).max(180),
  emergency_type: z.enum(['medical', 'fire', 'accident', 'flood', 'crime', 'other'], {
    required_error: "Emergency type is required",
  }),
  description: z.string().trim().max(300, "Description must be less than 300 characters").optional(),
  routing_mode: z.enum(['cloud', 'p2p']).default('cloud'),
});

export type AlertCreateInput = z.infer<typeof alertCreateSchema>;
