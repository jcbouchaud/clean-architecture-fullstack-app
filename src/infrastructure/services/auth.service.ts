import {
  IAuthService,
  AuthCredentials,
} from "@/src/application/services/auth.service.interface";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";
import { SupabaseClient } from "@supabase/supabase-js";

export const createAuthService = (client: SupabaseClient): IAuthService => {
  const login = async (credentials: AuthCredentials) => {
    try {
      const { data, error } = await client.auth.signInWithPassword({
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
  };

  const signup = async (credentials: AuthCredentials) => {
    try {
      const { data, error } = await client.auth.signUp({
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
  };

  const logout = async () => {
    try {
      const { error } = await client.auth.signOut();
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
  };

  const getUser = async () => {
    const { data } = await client.auth.getUser();

    if (!data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  };

  return {
    login,
    signup,
    logout,
    getUser,
  };
};
