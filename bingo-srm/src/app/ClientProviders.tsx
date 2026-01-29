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

  function RedirectToFirstAllowed() {
    const { allowedNodeIds, loading: permissionsLoading } = usePermissions();
    const router = useRouter();

    useEffect(() => {
      if (permissionsLoading) return;
      if (!isAuthenticated()) return;
      try {
        const pathname = window.location.pathname;
        if (pathname !== "/" && pathname !== "/login") return;

        // build nodeId -> route map from routeToNodeId
        const nodeIdToRoute: Record<string, string> = {};
        Object.entries(routeToNodeId).forEach(([route, nid]) => {
          if (!nodeIdToRoute[nid]) nodeIdToRoute[nid] = route;
        });

        const findFirst = (nodes: typeof menuTree): string | null => {
          for (const n of nodes) {
            if (allowedNodeIds.has(n.id)) {
              if (nodeIdToRoute[n.id]) return nodeIdToRoute[n.id];
              // if folder, try descendants
            }
            if (n.children) {
              const r = findFirst(n.children as any);
              if (r) return r;
            }
          }
          return null;
        };

        const target = findFirst(menuTree);
        if (target) router.replace(target);
      } catch (e) {
        // ignore
      }
    }, [permissionsLoading, allowedNodeIds, router]);

    return null;
  }

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
