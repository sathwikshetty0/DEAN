import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const responders = [
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Vikram Singh',
    email: 'vikram@dean.com',
    role: 'responder',
    zone: 'Mangaluru South',
    location_lat: 12.8540,
    location_lng: 74.8444,
    is_active: true,
    is_available: true
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Priya Hegde',
    email: 'priya@dean.com',
    role: 'responder',
    zone: 'Mangaluru North',
    location_lat: 12.9100,
    location_lng: 74.8300,
    is_active: true,
    is_available: true
  }
];

async function seed() {
  console.log('Seeding additional responders...');
  for (const r of responders) {
    const { error } = await supabase.from('profiles').upsert(r);
    if (error) console.error(`Error seeding ${r.name}:`, error);
    else console.log(`Seeded ${r.name}`);
  }
}

seed();
