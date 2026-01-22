"use client";

//import { useNotiStackStore } from "@/store/notiStack/notiStackStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function InputLoginCredentials() {
  const isDev = process.env.NODE_ENV === "development";
  const [username, setUsername] = useState(isDev ? "" : "");
  const [password, setPassword] = useState(isDev ? "" : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const router = useRouter();

  //const setOpenNotiStack = useNotiStackStore((state) => state.setOpenNotiStack);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        // Success - redirect to user management page
        router.push("/user/user-management");
      } else {
        // Failed - show error
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" width="20rem" overflow="hidden">
        <Fade in timeout={800}>
          <Stack spacing={3} width="20rem">
            <Box>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("title.login")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {t("login.subtitle")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              fullWidth
              id="username"
              label={t("placeholder.username")}
              inputProps={{ "data-testid": "username" }}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  },
                  "&.Mui-focused": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              id="password"
              label={t("placeholder.password")}
              inputProps={{ "data-testid": "password" }}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  },
                  "&.Mui-focused": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                  },
                },
              }}
            />

            <Box position="relative">
              <Button
                type="submit"
                data-testid="login-submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(102, 126, 234, 0.5)",
                    color: "white",
                  },
                }}
              >
                {t("button.login")}
              </Button>
              {loading ? (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    mt: "-12px",
                    ml: "-12px",
                    color: "white",
                  }}
                  size={24}
                />
              ) : null}
            </Box>
          </Stack>
        </Fade>
      </Stack>
    </form>
  );
}
