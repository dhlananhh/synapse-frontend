"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import vi from "@/locales/vi.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
      de: {
        translation: de,
      },
      fr: {
        translation: fr,
      },
      it: {
        translation: it,
      },
    },
  });

export default i18n;
