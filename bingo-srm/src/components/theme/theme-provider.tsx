"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/src/lib/createEmotionCache";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { getDesignTokens } from "./theme";

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme(getDesignTokens(resolvedTheme === "dark" ? "dark" : "light")),
    [resolvedTheme],
  );

  // Create emotion cache on the client and attach to the insertion point
  const cache = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const insertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]',
    ) as HTMLElement | null;
    return createEmotionCache(insertionPoint);
  }, []);

  const content = <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;

  if (!cache) return content;

  return <CacheProvider value={cache}>{content}</CacheProvider>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MuiThemeWrapper>{children}</MuiThemeWrapper>
    </NextThemeProvider>
  );
}
