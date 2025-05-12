import { z } from "zod";
import { createSignupUseCase } from "@/src/application/use-cases/auth/signup.use-case";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createSignupController = (authService: IAuthService) => {
  const signupUseCase = createSignupUseCase(authService);

  return async (email: string, password: string) => {
    try {
      const validatedData = signupSchema.parse({ email, password });
      return await signupUseCase(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AuthenticationError(
          error.errors[0].message,
          AuthenticationErrorCode.INVALID_EMAIL,
          error
        );
      }
      throw error;
    }
  };
};
