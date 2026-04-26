import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Alert = Database['public']['Tables']['alerts']['Row'];
export type AlertTimeline = Database['public']['Tables']['alert_timeline']['Row'];
export type Log = Database['public']['Tables']['logs']['Row'];

export type EmergencyType = Alert['emergency_type'];
export type AlertStatus = Alert['status'];
export type RoutingMode = Alert['routing_mode'];
export type UserRole = Profile['role'];

export interface NetworkState {
  isOnline: boolean;
  mode: RoutingMode;
}

export interface Location {
  lat: number;
  lng: number;
}
