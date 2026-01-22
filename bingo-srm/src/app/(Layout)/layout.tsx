"use client";

import { ReactNode, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import LeftNavBar from "@/src/components/sidebar/LeftNavbar/LeftNavbar";
import TopNavBar from "@/src/components/sidebar/TopNavbar/TopNavbar";
import { useLeftNavbarStore } from "@/src/store/navbar/leftNavbarStore";

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
        {children}
      </Stack>
    </Stack>
  );
}
