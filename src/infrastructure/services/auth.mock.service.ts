import {
  IAuthService,
  AuthCredentials,
  AuthResponse,
  UserResponse,
} from "@/src/application/services/auth.service.interface";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

export const createAuthMockService = (): IAuthService => {
  let mockUser: UserResponse | null = null;
  let mockToken: string | null = null;

  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation
    if (
      credentials.email !== "test@example.com" ||
      credentials.password !== "password123"
    ) {
      throw new AuthenticationError(
        "Invalid credentials",
        AuthenticationErrorCode.INVALID_CREDENTIALS
      );
    }

    mockUser = {
      id: "mock-user-id",
      email: credentials.email,
    };
    mockToken = "mock-jwt-token";

    return {
      token: mockToken,
      user: mockUser,
    };
  };

  const signup = async (
    credentials: AuthCredentials
  ): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation
    if (credentials.email === "existing@example.com") {
      throw new AuthenticationError(
        "Email already exists",
        AuthenticationErrorCode.EMAIL_ALREADY_EXISTS
      );
    }

    mockUser = {
      id: "mock-user-id",
      email: credentials.email,
    };
    mockToken = "mock-jwt-token";

    return {
      token: mockToken,
      user: mockUser,
    };
  };

  const logout = async (): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    mockUser = null;
    mockToken = null;
  };

  const getUser = async (): Promise<UserResponse | null> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockUser;
  };

  return {
    login,
    signup,
    logout,
    getUser,
  };
};
