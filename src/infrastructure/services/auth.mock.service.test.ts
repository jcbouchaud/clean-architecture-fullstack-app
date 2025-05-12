import { describe, it, expect, beforeEach } from "vitest";
import { createAuthMockService } from "./auth.mock.service";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "@/entities/errors/authentication.error";

describe("AuthMockService", () => {
  let authService: ReturnType<typeof createAuthMockService>;

  beforeEach(() => {
    authService = createAuthMockService();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await authService.login(credentials);

      expect(response).toEqual({
        token: "mock-jwt-token",
        user: {
          id: "mock-user-id",
          email: "test@example.com",
        },
      });
    });

    it("should throw AuthenticationError with invalid credentials", async () => {
      const credentials = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      await expect(authService.login(credentials)).rejects.toThrow(
        AuthenticationError
      );
      await expect(authService.login(credentials)).rejects.toMatchObject({
        code: AuthenticationErrorCode.INVALID_CREDENTIALS,
      });
    });
  });

  describe("signup", () => {
    it("should successfully signup with new email", async () => {
      const credentials = {
        email: "new@example.com",
        password: "password123",
      };

      const response = await authService.signup(credentials);

      expect(response).toEqual({
        token: "mock-jwt-token",
        user: {
          id: "mock-user-id",
          email: "new@example.com",
        },
      });
    });

    it("should throw AuthenticationError when email already exists", async () => {
      const credentials = {
        email: "existing@example.com",
        password: "password123",
      };

      await expect(authService.signup(credentials)).rejects.toThrow(
        AuthenticationError
      );
      await expect(authService.signup(credentials)).rejects.toMatchObject({
        code: AuthenticationErrorCode.EMAIL_ALREADY_EXISTS,
      });
    });
  });

  describe("logout", () => {
    it("should successfully logout and clear user data", async () => {
      // First login to set user data
      await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      // Verify user data exists
      const userBeforeLogout = await authService.getUser();
      expect(userBeforeLogout).not.toBeNull();

      // Perform logout
      await authService.logout();

      // Verify user data is cleared
      const userAfterLogout = await authService.getUser();
      expect(userAfterLogout).toBeNull();
    });
  });

  describe("getUser", () => {
    it("should return null when no user is logged in", async () => {
      const user = await authService.getUser();
      expect(user).toBeNull();
    });

    it("should return user data when logged in", async () => {
      // First login
      await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      const user = await authService.getUser();
      expect(user).toEqual({
        id: "mock-user-id",
        email: "test@example.com",
      });
    });
  });
});
