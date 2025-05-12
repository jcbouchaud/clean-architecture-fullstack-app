import { IAuthService } from "@/src/application/services/auth.service.interface";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

interface SignupInput {
  email: string;
  password: string;
}

export const createSignupUseCase = (authService: IAuthService) => {
  return async (input: SignupInput) => {
    try {
      return await authService.signup(input);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "An unexpected error occurred during signup",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  };
};
