const ACCESS_TOKEN_KEY = 'sancap_access_token';
const REFRESH_TOKEN_KEY = 'sancap_refresh_token';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!canUseStorage()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!canUseStorage()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!canUseStorage()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    if (!canUseStorage()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasAccessToken(): boolean {
    return Boolean(tokenStorage.getAccessToken());
  },
};
