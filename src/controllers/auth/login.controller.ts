import { z } from "zod";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { createLoginUseCase } from "@/src/application/use-cases/auth/login.use-case";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createLoginController = (authService: IAuthService) => {
  const loginUseCase = createLoginUseCase(authService);

  return async (email: string, password: string) => {
    try {
      const validatedData = loginSchema.parse({ email, password });
      return await loginUseCase(validatedData);
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
