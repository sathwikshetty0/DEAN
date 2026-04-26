import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const SEED_DATA = {
  profiles: [
    { id: '00000000-0000-0000-0000-000000000001', name: 'Arjun Rao', email: 'arjun@dean.com', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Riya Sharma', email: 'riya@dean.com', role: 'responder', skills: ['First Aid', 'CPR'], zone: 'Mangaluru Central' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'System Admin', email: 'admin@dean.com', role: 'admin' },
  ]
};

async function seed() {
  console.log('🚀 Starting auth-free seed process...');

  for (const p of SEED_DATA.profiles) {
    console.log(`Upserting profile: ${p.name} (${p.role})`);
    const { error } = await supabase
      .from('profiles')
      .upsert(p);

    if (error) {
      console.error(`Error seeding profile ${p.name}:`, error.message);
    }
  }

  console.log('✅ Prototype profiles seeded successfully.');
}

seed().catch(console.error);
