"use client";

import React from "react";
import {
  fetchProgramAccessAssigned,
  fetchProgramAccessAll,
} from "@/src/lib/auth";
import { mapAssignedRowsToAllowed } from "@/src/lib/permissions";

interface PermissionsContextValue {
  allowedNodeIds: Set<string>;
  allowedProgrmSns: Set<string>;
  loading: boolean;
}

const PermissionsContext = React.createContext<PermissionsContextValue | null>(
  null,
);

export const PermissionsProvider: React.FC<{
  authorCode?: string | null;
  children: React.ReactNode;
}> = ({ authorCode, children }) => {
  const [allowedNodeIds] = React.useState<Set<string>>(new Set());
  const [allowedProgrmSns] = React.useState<Set<string>>(new Set());
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!authorCode) return;
      setLoading(true);
      try {
        const assigned = await fetchProgramAccessAssigned(authorCode);
        let fullList: any[] = [];
        try {
          fullList = await fetchProgramAccessAll(authorCode);
        } catch (e) {
          // ignore
        }
        const mapped = mapAssignedRowsToAllowed(assigned || [], fullList || []);
        if (!mounted) return;
        // replace contents of the sets
        allowedNodeIds.clear();
        mapped.allowedNodeIds.forEach((s) => allowedNodeIds.add(s));
        allowedProgrmSns.clear();
        mapped.allowedProgrmSns.forEach((s) => allowedProgrmSns.add(s));
      } catch (err) {
        console.debug("PermissionsProvider failed to load", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [authorCode]);

  return (
    <PermissionsContext.Provider
      value={{ allowedNodeIds, allowedProgrmSns, loading }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export function usePermissionsContext() {
  const ctx = React.useContext(PermissionsContext);
  if (!ctx)
    throw new Error(
      "usePermissionsContext must be used within PermissionsProvider",
    );
  return ctx;
}

export default PermissionsContext;
