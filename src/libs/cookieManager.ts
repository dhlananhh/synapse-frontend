import Cookies from "js-cookie";


const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";


export const cookieManager = {
  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string, options?: Cookies.CookieAttributes): void => {
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set(ACCESS_TOKEN_KEY, token, { ...options, expires });
  },

  removeAccessToken: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string, options?: Cookies.CookieAttributes): void => {
    const expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    Cookies.set(REFRESH_TOKEN_KEY, token, { ...options, expires });
  },

  removeRefreshToken: (): void => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  }
};
