"use client";

import LanguageToggle from "@/src/components/common/LanguageToggle";
import { ModeToggle } from "@/src/components/theme/modeToggle";
import { useTheme as useNextTheme } from "next-themes";
import Image from "next/image";
import LoginForm from "./LoginForm";

// MUI
import { Box, Stack, Typography, keyframes } from "@mui/material";

const imageZoomIn = keyframes`
  from {
    transform: scale(1.1);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export default function LoginPage() {
  const { resolvedTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Stack direction="row" component="main" height="100vh">
      {/* ================= Left: Login ================= */}
      <Stack
        flex="3 1 auto"
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        height="100%"
        sx={{
          background: isDark
            ? "linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(45, 55, 72, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(247, 250, 252, 0.95) 0%, rgba(237, 242, 247, 0.95) 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark
              ? "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Stack
          width="32rem"
          height="100%"
          p={3}
          justifyContent="space-between"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ===== Top ===== */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Image
                src="/BingoSRM.png"
                alt="BingoSRM"
                width={28}
                height={28}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  background: isDark
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                BingoSRM
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <LanguageToggle />
              <ModeToggle />
            </Stack>
          </Stack>

          {/* ===== Middle ===== */}
          <LoginForm />

          {/* ===== Bottom ===== */}
          <Typography
            variant="subtitle2"
            color="text.secondary"
            textAlign="center"
            sx={{
              opacity: 0.7,
              fontSize: "0.75rem",
            }}
          >
            © 2026 BingoSRM
          </Typography>
        </Stack>
      </Stack>

      {/* ================= Right: Splash ================= */}
      <Box
        width={640}
        position="relative"
        sx={{
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            )`,
            backgroundSize: "200% 200%",
            animation: `${shimmer} 3s infinite`,
            pointerEvents: "none",
            zIndex: 2,
          },
        }}
      >
        <Typography
          variant="caption"
          position="absolute"
          bottom={16}
          left={16}
          color="white"
          zIndex={3}
          sx={{
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            fontWeight: 500,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {isDark
            ? "Oahu, Hawaii by Patrick Langwallner"
            : "Brezovica, Serbia by Filip Zrnzević"}
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            animation: `${imageZoomIn} 1.5s ease-out`,
          }}
        >
          <Image
            src={isDark ? "/login-dark.jpg" : "/login-light.jpg"}
            alt="Login background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Overlay gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark
              ? "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 50%)"
              : "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%)",
            zIndex: 1,
          }}
        />
      </Box>
    </Stack>
  );
}
