import { createServerClient } from "@supabase/ssr";
import { Database } from "@/src/infrastructure/supabase/types";
import { cookies as nextCookies } from "./cookies";

interface Cookies {
  getAll(): Promise<{ name: string; value: string }[] | null>;
  setAll(
    cookies: {
      name: string;
      value: string;
      options?: { path?: string; domain?: string; secure?: boolean };
    }[]
  ): Promise<void>;
}

export async function createClient(cookies?: Cookies) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        ...nextCookies,
        ...cookies,
      },
    }
  );
}
