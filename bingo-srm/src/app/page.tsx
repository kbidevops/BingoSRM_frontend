"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/src/lib/auth";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only proceed if user is authenticated; otherwise send to login
    if (!isAuthenticated()) {
      router.push("/login");
      setChecking(false);
      return;
    }

    // If authenticated and at root, fetch assigned menus and redirect
    // to the first menu the user is allowed to access (by menuTree order).
    const go = async () => {
      try {
        const { fetchAssignedMenus } = await import("@/src/lib/auth");
        const perms = await import("@/src/lib/permissions");

        const assigned = await fetchAssignedMenus();
        const { allowedNodeIds } = perms.mapAssignedRowsToAllowed(
          assigned || [],
        );

        const nodeIdToRoute: Record<string, string> = {};
        Object.entries(perms.routeToNodeId).forEach(([route, nid]) => {
          if (!nodeIdToRoute[nid]) nodeIdToRoute[nid] = route;
        });

        const findFirst = (nodes: typeof perms.menuTree): string | null => {
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

        const target = findFirst(perms.menuTree as any);
        if (target) {
          router.replace(target);
          return;
        }
      } catch (e) {
        console.error("redirect-to-first-allowed failed:", e);
      }
    };

    // only attempt when at root path
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/";
    if (currentPath === "/" || currentPath === "") {
      go().finally(() => setChecking(false));
      return;
    }

    // hide checking indicator after navigation attempt for non-root
    setChecking(false);
  }, [router]);

  if (!checking) return null;

  // show a centered loader while we determine auth state and navigate
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
