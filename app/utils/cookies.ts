import { createAuthService } from "@/src/infrastructure/services/auth.service";
import { cookies as nextCookies } from "next/headers";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const cookies: {
  getAll: () => Promise<{ name: string; value: string }[]>;
  setAll: (
    cookiesToSet: {
      name: string;
      value: string;
      options?: { path?: string; domain?: string; secure?: boolean };
    }[]
  ) => Promise<void>;
} = {
  getAll: async () => {
    const cookiesInstance = await nextCookies();
    return cookiesInstance.getAll();
  },
  setAll: async (
    cookiesToSet: {
      name: string;
      value: string;
      options?: { path?: string; domain?: string; secure?: boolean };
    }[]
  ) => {
    const cookiesInstance = await nextCookies();
    cookiesToSet.forEach(({ name, value, options }) =>
      cookiesInstance.set(name, value, options)
    );
  },
};

export async function updateSession(request: NextRequest) {
  let authResponse = NextResponse.next({
    request,
  });

  const cookies = {
    async getAll() {
      return request.cookies.getAll();
    },
    async setAll(
      cookiesToSet: {
        name: string;
        value: string;
        options?: { path?: string; domain?: string; secure?: boolean };
      }[]
    ) {
      await Promise.all(
        cookiesToSet.map(({ name, value }) => request.cookies.set(name, value))
      );
      authResponse = NextResponse.next({
        request,
      });
      await Promise.all(
        cookiesToSet.map(({ name, value, options }) =>
          authResponse.cookies.set(name, value, options)
        )
      );
    },
  };
  const authService = createAuthService(cookies);
  const user = await authService.getUser();

  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return authResponse;
}
