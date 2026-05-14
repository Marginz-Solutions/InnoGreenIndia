import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function getAuthContext(): Promise<
  { supabase: Supabase; user: User } | { supabase: Supabase; user: null }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if(error || !user) return { supabase, user: null };
  return { supabase, user };
}
