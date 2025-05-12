"use server";

import { AuthController } from "@/controllers/auth.controller";
import { AuthServiceImpl } from "@/infrastructure/services/auth.service";
import { AuthenticationError } from "@/entities/errors/authentication.error";
import { redirect } from "next/navigation";
import { cookies as nextCookies } from "next/headers";
import { cookies } from "../utils/cookies";

type AuthState = {
  error: string;
  code: string;
};

const createAuthController = async () => {
  const authController = new AuthController(new AuthServiceImpl(cookies));
  return authController;
};

export async function login(prevState: AuthState, formData: FormData) {
  const authController = await createAuthController();
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await authController.login({ email, password });

    // Store the token in an HTTP-only cookie
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

    const authController = await createAuthController();
    const response = await authController.signup({ email, password });

    // Store the token in an HTTP-only cookie
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
  const authController = await createAuthController();
  await authController.logout();
  const cookiesInstance = await nextCookies();
  cookiesInstance.delete("auth_token");
  redirect("/auth");
}
