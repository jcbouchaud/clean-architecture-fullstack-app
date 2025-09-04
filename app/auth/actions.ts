"use server";

import { createAuthService } from "@/infrastructure/services/auth.service";
import { AuthenticationError } from "@/entities/errors/authentication.error";
import { redirect } from "next/navigation";
import { createClient } from "../lib/client";
import { cookies as nextCookies } from "next/headers";
import { createLoginController } from "@/src/controllers/auth/login.controller";
import { createSignupController } from "@/src/controllers/auth/signup.controller";
import { createLogoutController } from "@/src/controllers/auth/logout.controller";

type AuthState = {
  error: string;
  code: string;
};

export async function login(prevState: AuthState, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const client = await createClient();
    const authService = createAuthService(client);
    const loginController = createLoginController(authService);
    const response = await loginController(email, password);

    const cookiesInstance = await nextCookies();
    console.log("cookiesInstance", cookiesInstance);
    cookiesInstance.set("auth_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return {
        error: error.message,
        code: error.code,
      };
    }
    return {
      error: "An unexpected error occurred",
      code: "UNKNOWN",
    };
  }
  redirect("/");
}

export async function signup(prevState: AuthState, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const client = await createClient();
    const authService = createAuthService(client);
    const signupController = createSignupController(authService);
    const response = await signupController(email, password);

    const cookiesInstance = await nextCookies();
    cookiesInstance.set("auth_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return {
        error: error.message,
        code: error.code,
      };
    }
    return {
      error: "An unexpected error occurred",
      code: "UNKNOWN",
    };
  }
  redirect("/");
}

export async function logout() {
  const client = await createClient();
  const authService = createAuthService(client);
  const logoutController = createLogoutController(authService);
  await logoutController();
  const cookiesInstance = await nextCookies();
  cookiesInstance.delete("auth_token");
  redirect("/auth");
}
