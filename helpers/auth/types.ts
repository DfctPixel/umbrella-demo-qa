import dotenv from 'dotenv';
dotenv.config();

function parsePositiveInt(raw: string | undefined): number | undefined {
  if (raw == null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : undefined;
}

export const BASE_URL = process.env.BASE_URL || 'https://dev.umbrellacost.dev';
export const API_URL = process.env.API_URL || 'https://api.dev.umbrellacost.dev/api/v1';
export const USER_EMAIL = process.env.USER_EMAIL || '';
export const USER_PASSWORD = process.env.USER_PASSWORD || '';

export const QA_ACCOUNT_KEY = parsePositiveInt(process.env.QA_ACCOUNT_KEY);
export const QA_ACCOUNT_TYPE_ID = parsePositiveInt(process.env.QA_ACCOUNT_TYPE_ID);
export const QA_DIVISION_ID = process.env.QA_DIVISION_ID || '0';
export const QA_CURRENCY = process.env.QA_CURRENCY || 'USD';

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  username: string;
}

export interface TenantCapability {
  userKey: string;
  accountKey: number;
  accountTypeId: number;
  divisionId: string;
  currency: string;
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly step: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
