/**
 * @fileoverview Utility module for clipboard
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { toast } from 'react-hot-toast';

export async function copyToClipboard(text: string, label = 'Copied') {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    toast.error('Clipboard not available');
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label, { icon: '📋' });
    return true;
  } catch {
    toast.error('Could not copy');
    return false;
  }
}

export function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
