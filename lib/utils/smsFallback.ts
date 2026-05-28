/**
 * @fileoverview SMS Fallback Formatter utility
 */
export const formatAlertToSMS = (alert: {
  emergency_type: string;
  location: { lat: number; lng: number };
  description?: string;
}): string => {
  const lat = alert.location.lat.toFixed(5);
  const lng = alert.location.lng.toFixed(5);
  const type = alert.emergency_type.substring(0, 3).toUpperCase();
  const desc = alert.description ? alert.description.substring(0, 50).replace(/[#|]/g, '') : '';
  return \DEAN|\|\|\|\\;
};