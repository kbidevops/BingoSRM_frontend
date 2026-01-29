"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LeftNavBar from "@/src/components/sidebar/LeftNavbar/LeftNavbar";
import TopNavBar from "@/src/components/sidebar/TopNavbar/TopNavbar";
import { PermissionsProvider } from "@/src/context/PermissionsContext";
import { getCurrentUser } from "@/src/lib/auth";

export default function UnauthorizedPage() {
  const authorCode = getCurrentUser().userTyCode ?? undefined;
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      sx={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}
    >
      <PermissionsProvider authorCode={authorCode}>
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

          <Box
            sx={{
              height: "calc(100vh - 56px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              bgcolor: "background.default",
            }}
          >
            <Box sx={{ maxWidth: 640, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                {t("unauthorized.title")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                {t("unauthorized.message")}
              </Typography>

              {/* Home button removed intentionally to prevent navigation from unauthorized page */}
            </Box>
          </Box>
        </Stack>
      </PermissionsProvider>
    </Stack>
  );
}
