"use client";

import { ThemeProvider } from "@/src/components/theme/theme-provider";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { SnackbarProvider } from "notistack";
import NotiStack from "@/src/components/common/NotiStack";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <SnackbarProvider maxSnack={3}>
          {children}
          <NotiStack />
        </SnackbarProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}
