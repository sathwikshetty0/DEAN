import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Database } from '../lib/types/database.types';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

const SEED_DATA = {
  users: [
    { email: 'admin@dean.com', password: 'admin123', name: 'System Admin', role: 'admin' },
    { email: 'riya@dean.com', password: 'resp123', name: 'Riya Sharma', role: 'responder', skills: ['First Aid', 'CPR'], zone: 'Mangaluru Central' },
    { email: 'kiran@dean.com', password: 'resp123', name: 'Kiran Dash', role: 'responder', skills: ['Fire Safety', 'Flood'], zone: 'Kadri' },
    { email: 'ananya@dean.com', password: 'resp123', name: 'Ananya Rao', role: 'responder', skills: ['Trauma', 'First Aid'], zone: 'Kodialbail' },
    { email: 'arjun@dean.com', password: 'user123', name: 'Arjun Hegde', role: 'user' },
    { email: 'priya@dean.com', password: 'user123', name: 'Priya Naik', role: 'user' },
    { email: 'rohit@dean.com', password: 'user123', name: 'Rohit Shenoy', role: 'user' },
  ],
  alerts: [
    { code: 'DEAN-1000', type: 'medical', zone: 'Kodialbail', status: 'resolved', mode: 'cloud', user: 'arjun@dean.com', responder: 'riya@dean.com' },
    { code: 'DEAN-1001', type: 'fire', zone: 'Kadri', status: 'resolved', mode: 'cloud', user: 'priya@dean.com', responder: 'kiran@dean.com' },
    { code: 'DEAN-1002', type: 'accident', zone: 'Mangaluru', status: 'resolved', mode: 'p2p', user: 'rohit@dean.com', responder: 'riya@dean.com' },
    { code: 'DEAN-1003', type: 'flood', zone: 'Kadri', status: 'en_route', mode: 'cloud', user: 'arjun@dean.com', responder: 'kiran@dean.com' },
    { code: 'DEAN-1004', type: 'medical', zone: 'Kodialbail', status: 'pending', mode: 'cloud', user: 'priya@dean.com' },
  ]
};

async function seed() {
  console.log('🚀 Starting seed process...');

  for (const u of SEED_DATA.users) {
    console.log(`Creating user: ${u.email}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { 
        name: u.name, 
        role: u.role,
        skills: (u as any).skills || [],
        zone: (u as any).zone || ''
      }
    });

    if (authError) {
      console.error(`Error creating auth user ${u.email}:`, authError.message);
      continue;
    }

    // Trigger should automatically create the profile, but let's update extra fields if needed
    if (u.role === 'responder') {
       await supabase.from('profiles').update({
         skills: (u as any).skills,
         zone: (u as any).zone
       }).eq('id', authData.user.id);
    }
  }

  console.log('✅ Users seeded successfully.');
  console.log('⚠️ Alert seeding requires real UUIDs from created profiles. Please run alert creation manually or update script with IDs.');
}

seed().catch(console.error);
