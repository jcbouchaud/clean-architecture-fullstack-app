export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code: AuthenticationErrorCode,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export enum AuthenticationErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  INVALID_EMAIL = "INVALID_EMAIL",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN = "UNKNOWN",
}
