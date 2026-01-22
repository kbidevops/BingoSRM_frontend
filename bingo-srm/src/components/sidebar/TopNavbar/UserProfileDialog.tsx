"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UserProfileDialog({
  open,
  onClose,
}: UserProfileDialogProps) {
  const { t } = useTranslation("common");
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: "admin1",
    password: "",
    passwordConfirm: "",
    email: "admin@ezbus.com",
    department: "admin",
    name: "admin",
    contact: "010-1234-1234",
    position: "admin",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving user profile:", formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
          pt: 3,
          px: 3,
          fontWeight: 700,
          fontSize: "1.25rem",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
        }}
      >
        {t("userProfile.title")}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            transition: "all 0.2s",
            "&:hover": {
              transform: "rotate(90deg)",
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        <Stack spacing={2.5}>
          {/* Row 1: User ID and Name */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.userId")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.userId}
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "action.disabledBackground",
                    borderRadius: 1.5,
                    "& fieldset": {
                      borderColor: "divider",
                    },
                  },
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.name")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Row 2: Password and Password Confirmation */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "text.primary",
                  }}
                >
                  • {t("userProfile.password")}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={changePassword}
                      onChange={(e) => setChangePassword(e.target.checked)}
                      sx={{
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("userProfile.changePassword")}
                    </Typography>
                  }
                />
              </Stack>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={formData.password}
                disabled={!changePassword}
                onChange={(e) => handleChange("password", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: !changePassword
                      ? "action.disabledBackground"
                      : "inherit",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: changePassword
                        ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                        : "none",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.passwordConfirm")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={formData.passwordConfirm}
                disabled={!changePassword}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: !changePassword
                      ? "action.disabledBackground"
                      : "inherit",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: changePassword
                        ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                        : "none",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Row 3: Email and Contact */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.email")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.contact")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Row 4: Department and Position */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.department")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                • {t("userProfile.position")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Row 5: Notes */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "text.primary",
              }}
            >
              • {t("userProfile.notes")}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 2px 12px rgba(99, 102, 241, 0.2)",
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2.5,
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          {t("userProfile.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
