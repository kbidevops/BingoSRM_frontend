"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";

import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";

interface SystemManager {
  id: number;
  userId: string;
  userName: string;
  displayName: string;
  role: string;
  avatarColor: string;
  permissions: string[];
}

const systemManagers: SystemManager[] = [
  {
    id: 1,
    userId: "admin2",
    userName: "admin2",
    displayName: "admin2",
    role: "담당",
    avatarColor: "#FF9800",
    permissions: [],
  },
  {
    id: 2,
    userId: "admin1",
    userName: "admin",
    displayName: "admin",
    role: "담당",
    avatarColor: "#8BC34A",
    permissions: ["정보/자료 요청", "신규 개발"],
  },
  {
    id: 3,
    userId: "abcd",
    userName: "홍길동",
    displayName: "홍길동",
    role: "담당",
    avatarColor: "#00BCD4",
    permissions: [
      "단순/사용법 문의",
      "업무/직업 검토",
      "정보/자료 요청",
      "기능 복가",
      "신규 개발",
    ],
  },
  {
    id: 4,
    userId: "qwer",
    userName: "이순신",
    displayName: "이순신",
    role: "담당",
    avatarColor: "#00BCD4",
    permissions: ["단순/사용법 문의", "업무/직업 검토"],
  },
];

const systemPermissions = [
  { id: "simple_inquiry", label: "단순/사용법 문의" },
  { id: "task_review", label: "업무/직업 검토" },
  { id: "info_request", label: "정보/자료 요청" },
  { id: "simple_operation", label: "단순 오류/결함" },
  { id: "feature_modification", label: "기능 수정/개발" },
  { id: "server_work", label: "서버 작업" },
  { id: "security_work", label: "보안 작업" },
  { id: "backup", label: "백업/복구" },
  { id: "config_add", label: "구성정보 추가" },
  { id: "function_check", label: "기능 복가" },
  { id: "new_development", label: "신규 개발" },
  { id: "ui_ux_change", label: "UI/UX 변경" },
  { id: "network_work", label: "네트워크 작업" },
  { id: "db_work", label: "DB 작업" },
  { id: "config_change", label: "구성정보 변경" },
  { id: "etc", label: "기타" },
];

export default function SystemManager() {
  const { t } = useTranslation();
  const locale = useLocale();

  const [selectedManager, setSelectedManager] = useState<SystemManager | null>(
    systemManagers[1],
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    systemManagers[1].permissions,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleManagerSelect = (manager: SystemManager) => {
    setSelectedManager(manager);
    setSelectedPermissions(manager.permissions);
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSave = () => {
    console.log(
      "Saving permissions for",
      selectedManager?.userId,
      selectedPermissions,
    );
    // API call to save permissions
  };

  const filteredManagers = systemManagers.filter(
    (manager) =>
      manager.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.displayName.includes(searchQuery),
  );

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        p: 3,
        overflow: "hidden",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          {t("systemManager.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {t("systemManager.subtitle")}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={3}
        sx={{ flexGrow: 1, overflow: "hidden" }}
      >
        {/* Left Panel - Manager List */}
        <Box sx={{ width: "60%", display: "flex", flexDirection: "column" }}>
          {/* Search Section */}
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2.5,
              borderRadius: 2.5,
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "box-shadow 0.2s",
              "&:hover": {
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, minWidth: 120 }}
                >
                  {t("systemManager.managerList")}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<RefreshIcon />}
                  sx={{
                    minWidth: 100,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2.5,
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {t("systemManager.buttons.refresh")}
                </Button>
              </Stack>
              {/* Search Bar */}
              <TextField
                placeholder={t("systemManager.searchPlaceholder")}
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    bgcolor: "background.default",
                    height: "38px",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                총 {filteredManagers.length}명의 담당자
              </Typography>
            </Stack>
          </Box>

          {/* Manager List - Scrollable */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              bgcolor: "background.paper",
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <Stack
              spacing={0}
              divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}
            >
              {filteredManagers.map((manager) => (
                <Box
                  key={manager.id}
                  sx={{
                    cursor: "pointer",
                    p: 2.5,
                    bgcolor:
                      selectedManager?.id === manager.id
                        ? "primary.main"
                        : "transparent",
                    transition: "all 0.2s ease",
                    position: "relative",
                    "&:hover": {
                      bgcolor:
                        selectedManager?.id === manager.id
                          ? "primary.dark"
                          : "action.hover",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        bgcolor: "primary.main",
                        opacity: selectedManager?.id === manager.id ? 0 : 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      bgcolor: "primary.main",
                      opacity: selectedManager?.id === manager.id ? 1 : 0,
                      transition: "opacity 0.2s",
                    },
                  }}
                  onClick={() => handleManagerSelect(manager)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor:
                          selectedManager?.id === manager.id
                            ? "primary.dark"
                            : manager.avatarColor,
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {manager.displayName.substring(0, 2)}
                    </Avatar>
                    <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              selectedManager?.id === manager.id
                                ? "primary.contrastText"
                                : "text.secondary",
                            minWidth: 40,
                          }}
                        >
                          {t("systemManager.labels.userId")}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color:
                              selectedManager?.id === manager.id
                                ? "primary.contrastText"
                                : "text.primary",
                          }}
                        >
                          {manager.userId}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              selectedManager?.id === manager.id
                                ? "primary.contrastText"
                                : "text.secondary",
                            minWidth: 40,
                            flexShrink: 0,
                          }}
                        >
                          {t("systemManager.labels.role")}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.75rem",
                            color:
                              selectedManager?.id === manager.id
                                ? "primary.contrastText"
                                : "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {manager.permissions.length > 0
                            ? manager.permissions.join(" , ")
                            : "-"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Right Panel - Permission Assignment */}
        <Box
          sx={{
            width: "40%",
            bgcolor: "background.paper",
            borderRadius: 2.5,
            p: 3,
            display: "flex",
            flexDirection: "column",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("systemManager.permissionAssignment")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              sx={{
                minWidth: 100,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              {t("systemManager.buttons.save")}
            </Button>
          </Stack>

          {selectedManager && (
            <>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: 1.5,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedManager.displayName}({selectedManager.userId})
                </Typography>
              </Box>

              {/* Permission Checkboxes in 2 columns */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                {systemPermissions.map((permission) => (
                  <Box
                    key={permission.id}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(
                            permission.label,
                          )}
                          onChange={() =>
                            handlePermissionToggle(permission.label)
                          }
                          size="small"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {permission.label}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
