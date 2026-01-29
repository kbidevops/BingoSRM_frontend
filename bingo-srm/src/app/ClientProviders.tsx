"use client";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/src/lib/createEmotionCache";

import React, { ReactNode, useMemo, useState } from "react";
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
import { ThemeProvider as AppThemeProvider } from "@/src/components/theme/theme-provider";

interface Props {
  children: ReactNode;
}
const clientSideEmotionCache = createEmotionCache(null);
export default function ClientProviders({ children }: Props) {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <I18nextProvider i18n={i18n}>
        <ColorContext.Provider value={colorMode}>
          <AppThemeProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline enableColorScheme />
              <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </ThemeProvider>
          </AppThemeProvider>
        </ColorContext.Provider>
      </I18nextProvider>
    </CacheProvider>
  );
}
