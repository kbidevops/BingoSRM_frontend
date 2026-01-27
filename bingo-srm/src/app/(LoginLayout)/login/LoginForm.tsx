"use client";

//import { useNotiStackStore } from "@/store/notiStack/notiStackStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { login, updateUserPassword, type LoginRequest } from "@/src/lib/auth";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Stack,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function InputLoginCredentials() {
  const isDev = process.env.NODE_ENV === "development";
  const [username, setUsername] = useState(isDev ? "" : "");
  const [password, setPassword] = useState(isDev ? "" : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const router = useRouter();

  // Password change dialog states
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [userAuthData, setUserAuthData] = useState<{
    userId: string;
    userTyCode: string;
  } | null>(null);

  //const setOpenNotiStack = useNotiStackStore((state) => state.setOpenNotiStack);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credentials: LoginRequest = {
        userId: username,
        userPassword: password,
      };

      const response = await login(credentials);

      if (response.authenticated) {
        // Check for various login statuses
        if (response.passwordExpired) {
          // Store auth data for password update
          setUserAuthData({
            userId: response.userId || username,
            userTyCode: response.userTyCode || "",
          });
          setLoading(false);
          setOpenPasswordDialog(true);
          return;
        }

        if (response.locked) {
          setError(t("login.error.accountLocked"));
          setLoading(false);
          return;
        }

        if (response.status === "WAIT") {
          setError(t("login.error.accountWait"));
          setLoading(false);
          return;
        }

        if (response.status === "STOP") {
          setError(t("login.error.accountStop"));
          setLoading(false);
          return;
        }

        // Success - redirect to user management page
        router.push("/user/user-management");
      } else {
        setError(t("login.error.invalidCredentials"));
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login.error.serverError"));
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setPasswordError(t("login.error.passwordRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("login.error.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t("login.error.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(
        username,
        {
          userPassword: newPassword,
          changePasswordYN: "Y",
        },
        userAuthData || undefined,
      );

      // Password updated successfully, redirect to main page
      setOpenPasswordDialog(false);
      router.push("/user/user-management");
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError(t("login.error.passwordUpdateFailed"));
      setLoading(false);
    }
  };

  return (
    <>
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

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {t("login.passwordExpired.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("login.passwordExpired.message")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {passwordError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {passwordError}
              </Alert>
            )}

            <TextField
              fullWidth
              label={t("login.passwordExpired.newPassword")}
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t("login.passwordExpired.confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={() => {
              setOpenPasswordDialog(false);
              setNewPassword("");
              setConfirmPassword("");
              setPasswordError("");
            }}
            disabled={loading}
          >
            {t("button.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("button.update")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
