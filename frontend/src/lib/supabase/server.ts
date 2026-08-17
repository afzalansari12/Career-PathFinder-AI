import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbyossuhwotuzqgzbykb.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";

  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Ignore cookies error in static/standalone contexts
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          try {
            if (cookieStore) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            }
          } catch {
            // Handled when called from Server Components
          }
        },
      },
    }
  );
}