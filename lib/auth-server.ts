import { cookies } from 'next/headers';
import { createClient, createAdminClient } from './supabase/server';

export async function getAuthenticatedUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return { user, isPrototype: false, supabase };
  }

  // Prototype fallback
  const cookieStore = cookies();
  const protoId = cookieStore.get('dean_prototype_user_id')?.value;
  const protoRole = cookieStore.get('dean_prototype_role')?.value;

  if (protoId) {
    const mockUser = {
      id: protoId,
      email: `${protoRole}@dean.com`,
      user_metadata: { role: protoRole }
    };
    
    // For prototype users, we use the admin client to bypass RLS
    // since they aren't real auth.users
    return { 
      user: mockUser as any, 
      isPrototype: true, 
      supabase: createAdminClient() 
    };
  }

  return { user: null, isPrototype: false, supabase: null };
}
