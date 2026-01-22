"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/app/i18n";
import { ColorContext, getDesignTokens } from "@/src/components/theme/theme";
import { SnackbarProvider } from "notistack";

import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nextProvider i18n={i18n}>
          <ColorContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline enableColorScheme />
              <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </ThemeProvider>
          </ColorContext.Provider>
        </I18nextProvider>
      </body>
    </html>
  );
}
