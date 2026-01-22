"use client";
import { useParams } from "next/navigation";
import i18n from "./i18n";
import { useEffect } from "react";

export default function useLocale() {
  const params = useParams();
  const locale = params?.locale as string;

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);
}
