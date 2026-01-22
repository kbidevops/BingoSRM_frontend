"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <IconButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      sx={{
        color: "text.primary",
      }}
    >
      {isDark ? (
        <LightMode color="warning" />
      ) : (
        <DarkMode sx={{ color: "text.primary" }} />
      )}
    </IconButton>
  );
}
