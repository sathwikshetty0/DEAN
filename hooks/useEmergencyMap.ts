/**
 * @fileoverview Utility module for useEmergencyMap
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import L from 'leaflet';
import { useMemo } from 'react';

/**
 * Custom hook to provide standardized map icons and logic for the emergency network.
 */
export const useEmergencyMap = () => {
  const userIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-[#FF2D55]/30 rounded-full animate-ping"></div>
          <div style="background-color: #FF2D55; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px rgba(255,45,85,0.8); z-index: 10;"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, []);

  const responderMarkerIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return (isAvailable: boolean) => {
      const color = isAvailable ? '#10B981' : '#3B82F6';
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            ${isAvailable ? `<div class="absolute w-10 h-10 bg-[#10B981]/20 rounded-full animate-ping"></div>` : ''}
            <div style="background-color: ${color}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #0A0E1A; box-shadow: 0 6px 15px -3px rgba(0,0,0,0.4);">
              <div style="font-size: 16px;">🦺</div>
            </div>
            ${isAvailable ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] border-2 border-[#0A0E1A] rounded-full"></div>' : ''}
          </div>
        `,
        className: 'responder-marker',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
    };
  }, []);

  const emergencyMarkerIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return (type: string, status: string) => {
      const color = status === 'pending' ? '#FF2D55' : '#F59E0B';
      const isPending = status === 'pending';
      const emoji = type === 'medical' ? '🏥' : type === 'fire' ? '🔥' : type === 'accident' ? '🚗' : '🚨';
      
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            ${isPending ? `
              <div class="absolute w-12 h-12 bg-[#FF2D55]/30 rounded-full animate-ping opacity-75"></div>
              <div class="absolute w-8 h-8 bg-[#FF2D55]/40 rounded-full animate-pulse"></div>
            ` : ''}
            <div style="background-color: ${color}; width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 3px solid #0A0E1A; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); transform: rotate(45deg);">
              <div style="transform: rotate(-45deg); color: white; font-size: 20px;">
                ${emoji}
              </div>
            </div>
          </div>
        `,
        className: 'emergency-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });
    };
  }, []);

  const responderIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return L.divIcon({
      html: `
        <div style="background-color: #3B82F6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 15px rgba(59,130,246,0.5);">
          <div style="font-size: 14px;">🦺</div>
        </div>
      `,
      className: 'responder-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  const alertIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return L.divIcon({
      html: `
        <div style="background-color: #FF2D55; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 15px rgba(255,45,85,0.5); transform: rotate(45deg);">
          <div style="transform: rotate(-45deg); font-size: 14px;">🚨</div>
        </div>
      `,
      className: 'alert-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  return {
    userIcon,
    responderIcon,
    alertIcon,
    responderMarkerIcon,
    emergencyMarkerIcon,
  };
};
