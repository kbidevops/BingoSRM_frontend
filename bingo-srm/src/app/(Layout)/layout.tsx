"use client";

import { ReactNode, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import LeftNavBar from "@/src/components/sidebar/LeftNavbar/LeftNavbar";
import TopNavBar from "@/src/components/sidebar/TopNavbar/TopNavbar";
import { useLeftNavbarStore } from "@/src/store/navbar/leftNavbarStore";
import { PermissionsProvider } from "@/src/context/PermissionsContext";
import { getCurrentUser } from "@/src/lib/auth";
import { useRouter } from "next/navigation";
import usePermissions from "@/src/hooks/usePermissions";
import { menuTree, routeToNodeId } from "@/src/lib/permissions";
import { isAuthenticated } from "@/src/lib/auth";

interface LayoutWithNavbarProps {
  children: ReactNode;
}

export default function LayoutWithNavbar({ children }: LayoutWithNavbarProps) {
  const { isDrawerOpen, drawerWidth } = useLeftNavbarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Stack
      direction="row"
      sx={{
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <PermissionsProvider
        authorCode={getCurrentUser().userTyCode ?? undefined}
      >
        <LeftNavBar />

        <Stack
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            bgcolor: "background.paper",
          }}
        >
          <TopNavBar />
          <RedirectToFirstAllowed />
          {children}
        </Stack>
      </PermissionsProvider>
    </Stack>
  );
}

function RedirectToFirstAllowed() {
  const { allowedNodeIds, loading: permissionsLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (permissionsLoading) return;
    if (!isAuthenticated()) return;
    try {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "/";
      if (pathname !== "/" && pathname !== "/login") return;

      const nodeIdToRoute: Record<string, string> = {};
      Object.entries(routeToNodeId).forEach(([route, nid]) => {
        if (!nodeIdToRoute[nid]) nodeIdToRoute[nid] = route;
      });

      const findFirst = (nodes: typeof menuTree): string | null => {
        for (const n of nodes) {
          if (allowedNodeIds.has(n.id)) {
            if (nodeIdToRoute[n.id]) return nodeIdToRoute[n.id];
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
