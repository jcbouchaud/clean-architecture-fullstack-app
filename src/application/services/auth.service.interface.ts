export interface AuthCredentials {
  email: string;
  password: string;
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  redirect?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface IAuthService {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  signup(credentials: AuthCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getUser(): Promise<UserResponse | null>;
}
