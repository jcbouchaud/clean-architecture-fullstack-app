import {
  AuthService,
  AuthCredentials,
  AuthResponse,
} from "@/application/services/auth.service";
import { z } from "zod";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const validatedData = authSchema.parse(credentials);
      const response = await this.authService.login(validatedData);

      return response;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("login error", error);
        throw new AuthenticationError(
          error.errors[0].message,
          AuthenticationErrorCode.INVALID_EMAIL,
          error
        );
      }
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "An unexpected error occurred",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Validate input
      const validatedData = authSchema.parse(credentials);

      // Call service
      const response = await this.authService.signup(validatedData);

      return response;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AuthenticationError(
          error.errors[0].message,
          AuthenticationErrorCode.INVALID_EMAIL,
          error
        );
      }
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "An unexpected error occurred",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "An unexpected error occurred",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  }
}
