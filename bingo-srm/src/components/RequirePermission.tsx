"use client";
import React from "react";
import { useRouter } from "next/navigation";
import usePermissions from "@/src/hooks/usePermissions";

interface Props {
  nodeId: string;
  children: React.ReactNode;
}

export default function RequirePermission({ nodeId, children }: Props) {
  const { allowedNodeIds, loading } = usePermissions();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!allowedNodeIds.has(nodeId)) {
      router.replace("/unauthorized");
    }
  }, [loading, allowedNodeIds, nodeId, router]);

  if (loading) return null;
  if (!allowedNodeIds.has(nodeId)) return null;
  return <>{children}</>;
}
