const PREFERENCES_KEY = "user-preferences";

interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  extras: {
    notifications: boolean;
  };
}

export const getPreferencesFromSession = (): UserPreferences | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedData = window.sessionStorage.getItem(PREFERENCES_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error reading from sessionStorage", error);
    return null;
  }
};

export const savePreferencesToSession = (preferences: UserPreferences): void => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error writing to sessionStorage", error);
  }
};

export const clearPreferencesFromSession = (): void => {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(PREFERENCES_KEY);
};
