import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Example translations
const resources = {
    en: {
        translation: {
            welcome: "Welcome",
        },
    },
    es: {
        translation: {
            welcome: "Bienvenido",
        },
    },
    // Add more languages here
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
});

export default i18n;
