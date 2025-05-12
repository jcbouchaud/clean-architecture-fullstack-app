import {
  AuthService,
  AuthCredentials,
} from "@/application/services/auth.service";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

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

export class AuthServiceImpl implements AuthService {
  private client: SupabaseClient;

  constructor(cookies: Cookies) {
    this.client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies,
      }
    );
  }

  async login(credentials: AuthCredentials) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new AuthenticationError(
          error.message,
          AuthenticationErrorCode.UNKNOWN,
          error
        );
      }

      if (!data.user || !data.session) {
        throw new AuthenticationError(
          "Authentication failed",
          AuthenticationErrorCode.UNKNOWN
        );
      }

      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "Authentication failed",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }

  async signup(credentials: AuthCredentials) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("signup error", error);
        throw new AuthenticationError(
          error.message,
          AuthenticationErrorCode.UNKNOWN,
          error
        );
      }

      if (!data.user || !data.session) {
        throw new AuthenticationError(
          "Registration failed",
          AuthenticationErrorCode.UNKNOWN
        );
      }

      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "Registration failed",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }

  async logout() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        console.error("logout error", error);
        throw new AuthenticationError(
          error.message,
          AuthenticationErrorCode.UNKNOWN,
          error
        );
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "Logout failed",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }

  async getUser() {
    const { data } = await this.client.auth.getUser();

    if (!data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  }
}
