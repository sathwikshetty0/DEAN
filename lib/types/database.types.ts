export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      /**
       * User profiles extending Supabase Auth data.
       * Contains roles, responder skills, and availability status.
       */
      profiles: {
        Row: {
          id: string // Matches Supabase Auth UUID
          name: string
          email: string
          phone: string | null
          role: 'user' | 'responder' | 'admin'
          skills: string[]
          zone: string | null
          is_active: boolean
          is_available: boolean
          location_lat: number | null
          location_lng: number | null
          location_updated_at: string | null
          total_alerts_sent: number
          total_alerts_responded: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: 'user' | 'responder' | 'admin'
          skills?: string[]
          zone?: string | null
          is_active?: boolean
          is_available?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_updated_at?: string | null
          total_alerts_sent?: number
          total_alerts_responded?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'user' | 'responder' | 'admin'
          skills?: string[]
          zone?: string | null
          is_active?: boolean
          is_available?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_updated_at?: string | null
          total_alerts_sent?: number
          total_alerts_responded?: number
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          alert_code: string
          triggered_by: string
          location_lat: number
          location_lng: number
          location_address: string | null
          emergency_type: 'medical' | 'fire' | 'accident' | 'crime' | 'flood' | 'other'
          description: string | null
          status: 'pending' | 'accepted' | 'en_route' | 'resolved' | 'cancelled'
          routing_mode: 'cloud' | 'p2p'
          priority: 'low' | 'medium' | 'high' | 'critical'
          assigned_responder: string | null
          responder_lat: number | null
          responder_lng: number | null
          created_at: string
          accepted_at: string | null
          en_route_at: string | null
          resolved_at: string | null
          cancelled_at: string | null
          is_synced: boolean
        }
        Insert: {
          id?: string
          alert_code?: string
          triggered_by: string
          location_lat: number
          location_lng: number
          location_address?: string | null
          emergency_type: 'medical' | 'fire' | 'accident' | 'crime' | 'flood' | 'other'
          description?: string | null
          status?: 'pending' | 'accepted' | 'en_route' | 'resolved' | 'cancelled'
          routing_mode: 'cloud' | 'p2p'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_responder?: string | null
          responder_lat?: number | null
          responder_lng?: number | null
          created_at?: string
          accepted_at?: string | null
          en_route_at?: string | null
          resolved_at?: string | null
          cancelled_at?: string | null
          is_synced?: boolean
        }
        Update: {
          id?: string
          alert_code?: string
          triggered_by?: string
          location_lat?: number
          location_lng?: number
          location_address?: string | null
          emergency_type?: 'medical' | 'fire' | 'accident' | 'crime' | 'flood' | 'other'
          description?: string | null
          status?: 'pending' | 'accepted' | 'en_route' | 'resolved' | 'cancelled'
          routing_mode?: 'cloud' | 'p2p'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_responder?: string | null
          responder_lat?: number | null
          responder_lng?: number | null
          created_at?: string
          accepted_at?: string | null
          en_route_at?: string | null
          resolved_at?: string | null
          cancelled_at?: string | null
          is_synced?: boolean
        }
      }
      alert_timeline: {
        Row: {
          id: string
          alert_id: string
          action: string
          actor_id: string | null
          actor_role: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          alert_id: string
          action: string
          actor_id?: string | null
          actor_role?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          alert_id?: string
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      logs: {
        Row: {
          id: string
          alert_id: string | null
          alert_code: string | null
          action: string
          actor_id: string | null
          actor_role: string | null
          routing_mode: 'cloud' | 'p2p' | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          alert_id?: string | null
          alert_code?: string | null
          action: string
          actor_id?: string | null
          actor_role?: string | null
          routing_mode?: 'cloud' | 'p2p' | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          alert_id?: string | null
          alert_code?: string | null
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          routing_mode?: 'cloud' | 'p2p' | null
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
