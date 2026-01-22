"use client";

import * as React from "react";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { getDesignTokens } from "./theme";

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme(getDesignTokens(resolvedTheme === "dark" ? "dark" : "light")),
    [resolvedTheme]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
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
