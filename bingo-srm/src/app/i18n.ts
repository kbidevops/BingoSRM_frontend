import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import koCommon from "@/src/locales/ko/common.json";
import enCommon from "@/src/locales/en/common.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    fallbackLng: "ko",
    supportedLngs: ["ko", "en"],
    resources: {
      ko: {
        common: koCommon,
      },
      en: {
        common: enCommon,
      },
    },
    ns: ["common"],
    defaultNS: "common",
    react: { useSuspense: false },
  });
}

export default i18n;
