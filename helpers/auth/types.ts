import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.BASE_URL || 'https://dev.umbrellacost.dev';
export const API_URL = process.env.API_URL || 'https://api.dev.umbrellacost.dev/api/v1';
export const USER_EMAIL = process.env.USER_EMAIL || '';
export const USER_PASSWORD = process.env.USER_PASSWORD || '';

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  username: string;
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly step: string,
    public readonly status?: number,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
