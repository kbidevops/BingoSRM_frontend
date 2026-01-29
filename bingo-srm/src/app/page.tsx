"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/src/lib/auth";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // First, try to redirect back to the last visited path (if any)
    try {
      const last = localStorage.getItem("lastPath");
      if (last && last !== "/" && last !== window.location.pathname) {
        router.replace(last);
        return;
      }
    } catch (e) {
      // ignore storage errors
    }

    // Only redirect to login when the user is NOT authenticated
    if (!isAuthenticated()) {
      router.push("/login");
    }

    // hide checking indicator after navigation attempt
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
