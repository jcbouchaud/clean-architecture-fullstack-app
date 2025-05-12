import { IAuthService } from "@/src/application/services/auth.service.interface";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

export const createLogoutUseCase = (authService: IAuthService) => {
  return async () => {
    try {
      await authService.logout();
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
