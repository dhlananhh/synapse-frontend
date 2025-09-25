let inMemoryAccessToken: string | null = null;

export const getToken = (): string | null => {
  return inMemoryAccessToken;
};

export const setToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};
