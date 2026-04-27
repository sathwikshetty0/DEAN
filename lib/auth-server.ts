import { cookies } from 'next/headers';
import { createClient, createAdminClient } from './supabase/server';

export async function getAuthenticatedUser() {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return { user, isPrototype: false, supabase };
    }
  } catch (e) {
    console.error('Auth error:', e);
  }

  // Prototype fallback
  const cookieStore = cookies();
  const protoId = cookieStore.get('dean_prototype_user_id')?.value;
  const protoRole = cookieStore.get('dean_prototype_role')?.value;

  // Validate that protoId is a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (protoId && uuidRegex.test(protoId)) {
    const mockUser = {
      id: protoId,
      email: `${protoRole || 'user'}@dean.com`,
      user_metadata: { role: protoRole || 'user' },
      app_metadata: { role: protoRole || 'user' }
    };
    
    return { 
      user: mockUser as any, 
      isPrototype: true, 
      supabase: createAdminClient() 
    };
  }

  return { user: null, isPrototype: false, supabase: null };
}
