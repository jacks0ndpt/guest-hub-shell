import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ro from "./locales/ro.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    fallbackLng: "ro",
    supportedLngs: ["en", "ro"],
    interpolation: { escapeValue: false },
    detection: {
      // New visitors default to Romanian; a manual switch is remembered.
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "guesthub_lang",
    },

  });

export default i18n;
