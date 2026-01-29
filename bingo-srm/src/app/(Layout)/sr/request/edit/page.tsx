"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RequirePermission from "@/src/components/RequirePermission";
import ListIcon from "@mui/icons-material/List";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";

export default function SRRequestEditPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "edit";

  const [formData, setFormData] = useState({
    // SR 정보
    srNumber: "SRN으로 자동생성",
    requestDate: "2026-01-21",
    requestTime: "13:55",

    // 요청자 정보
    name: "",
    department: "",
    contact: "",
    email: "",
    manager: "",

    // 요청사유(상세기술)
    requestDetails: "",
    requestReason: "",
    attachedFile: null as File | null,
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange("attachedFile", file);
  };

  const handleSave = () => {
    console.log("Saving SR request:", formData);
    // TODO: Implement actual save logic
    router.push("/sr/request");
  };

  const handleCancel = () => {
    router.push("/sr/request");
  };

  return (
    <RequirePermission nodeId="sr-request">
      <Stack
        spacing={0}
        sx={{ height: "100vh", bgcolor: "background.default" }}
      >
        {/* Top Action Bar */}
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2.5 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                letterSpacing: "-0.02em",
              }}
            >
              {mode === "create"
                ? t("srRequestEdit.titleCreate")
                : t("srRequestEdit.titleEdit")}
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ListIcon />}
                onClick={handleCancel}
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                {t("srRequestEdit.buttons.list")}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {t("srRequestEdit.buttons.save")}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            overflow: "hidden",
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
          }}
        >
          <Stack spacing={3}>
            {/* SR 정보 Header */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <Stack direction="row" spacing={4} alignItems="center">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 60,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    }}
                  >
                    {t("srRequestEdit.fields.srNumber")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    {formData.srNumber}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 70,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    }}
                  >
                    {t("srRequestEdit.fields.requestDateTime")}
                  </Typography>
                  <TextField
                    size="small"
                    value={formData.requestDate}
                    disabled
                    sx={{
                      width: 140,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        fontSize: "0.875rem",
                        height: "32px",
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    value={formData.requestTime}
                    disabled
                    sx={{
                      width: 90,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        fontSize: "0.875rem",
                        height: "32px",
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Two Column Layout for 요청자 정보 and 요청사유 */}
            <Stack direction="row" spacing={3}>
              {/* 요청자 정보 - Left Column */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: "1rem",
                    color: "text.primary",
                    pb: 1.5,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  {t("srRequestEdit.sections.requesterInfo")}
                </Typography>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.name")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.department")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.contact")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.contact}
                      onChange={(e) =>
                        handleInputChange("contact", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.email")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.managerMessage")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.manager}
                      onChange={(e) =>
                        handleInputChange("manager", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>

              {/* 요청사유(상세기술) - Right Column */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: "1rem",
                    color: "text.primary",
                    pb: 1.5,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  {t("srRequestEdit.sections.requestDetails")}
                </Typography>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.requestSummary")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.requestDetails}
                      onChange={(e) =>
                        handleInputChange("requestDetails", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          height: "36px",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.requestReason")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      value={formData.requestReason}
                      onChange={(e) =>
                        handleInputChange("requestReason", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          fontSize: "0.875rem",
                          bgcolor: "background.default",
                        },
                      }}
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                      }}
                    >
                      {t("srRequestEdit.fields.attachment")}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        variant="contained"
                        size="small"
                        component="label"
                        startIcon={<SearchIcon />}
                        sx={{
                          minWidth: 100,
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        {t("srRequestEdit.buttons.browseFile")}
                        <input type="file" hidden onChange={handleFileChange} />
                      </Button>
                      {formData.attachedFile && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.875rem",
                          }}
                        >
                          {formData.attachedFile.name}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </RequirePermission>
  );
}
