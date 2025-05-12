import { IAuthService } from "../../services/auth.service.interface";

interface LoginInput {
  email: string;
  password: string;
}

export const createLoginUseCase = (authService: IAuthService) => {
  return async (input: LoginInput) => {
    const response = await authService.login(input);
    return response;
  };
};
