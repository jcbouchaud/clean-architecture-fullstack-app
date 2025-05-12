import { IAuthService } from "@/src/application/services/auth.service.interface";
import { createLogoutUseCase } from "@/src/application/use-cases/auth/logout.use-case";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

export const createLogoutController = (authService: IAuthService) => {
  const logoutUseCase = createLogoutUseCase(authService);

  return async () => {
    try {
      await logoutUseCase();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        "An unexpected error occurred during logout",
        AuthenticationErrorCode.UNKNOWN,
        error
      );
    }
  };
};
