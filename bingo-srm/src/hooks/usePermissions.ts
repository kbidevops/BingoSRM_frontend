"use client";
import { usePermissionsContext } from "@/src/context/PermissionsContext";

export default function usePermissions() {
  return usePermissionsContext();
}
