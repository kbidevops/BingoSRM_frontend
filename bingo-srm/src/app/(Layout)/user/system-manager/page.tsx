"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import RequirePermission from "@/src/components/RequirePermission";
import {
  fetchUsersByRole,
  fetchCodeTypes,
  type UserData,
} from "@/src/lib/auth";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import { authFetch } from "@/src/lib/authFetch";

interface SystemManager {
  id: number;
  userId: string;
  userName: string;
  displayName: string;
  role: string;
  avatarColor: string;
  permissions: string[];
}

const DEFAULT_MANAGERS: SystemManager[] = [
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

  const [managers, setManagers] = useState<SystemManager[]>(DEFAULT_MANAGERS);
  const [selectedManager, setSelectedManager] = useState<SystemManager | null>(
    DEFAULT_MANAGERS[0] || null,
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    DEFAULT_MANAGERS[0]?.permissions || [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [assignableSystems, setAssignableSystems] = useState<
    { id: string; label: string }[]
  >([]);

  // Fetch assigned systems for a given userId and map them to our permission labels.
  // Returns matched permission labels and optionally updates `selectedPermissions`.
  const fetchAssignedSystems = async (
    userId: string,
    setSelected = false,
  ): Promise<string[]> => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
      const url = `${base}/api/v1/sys-chargers/assigned?userId=${encodeURIComponent(
        userId,
      )}`;
      const res = await authFetch(url, { method: "GET" });
      if (!res.ok) {
        console.warn("Failed to fetch assigned systems", res.status);
        if (setSelected) setSelectedPermissions([]);
        return [];
      }
      const json = await res.json();
      // normalize possible response shapes
      let items: any[] = [];
      if (Array.isArray(json)) items = json;
      else if (Array.isArray(json.resultList)) items = json.resultList;
      else if (Array.isArray(json.data)) items = json.data;

      const assignedNames = items
        .map((it) => {
          if (!it) return null;
          if (typeof it === "string") return it;
          return (
            it.systemName || it.systemNm || it.sysCodeNm || it.name || it.menuNm || it.label
          );
        })
        .filter(Boolean) as string[];

      const matched = systemPermissions
        .map((p) => p.label)
        .filter((lbl) => assignedNames.includes(lbl));

      if (setSelected) setSelectedPermissions(matched);
      return matched;
    } catch (err) {
      console.error("Error fetching assigned systems", err);
      if (setSelected) setSelectedPermissions([]);
      return [];
    }
  };

  // Fetch assignable systems for a given userId (for the right-panel list)
  const fetchAssignableSystems = async (
    userId: string,
  ): Promise<{ id: string; label: string }[]> => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
      const url = `${base}/api/v1/sys-chargers?userId=${encodeURIComponent(
        userId,
      )}`;
      const res = await authFetch(url, { method: "GET" });
      if (!res.ok) {
        console.warn("Failed to fetch assignable systems", res.status);
        return [];
      }
      const json = await res.json();
      let items: any[] = [];
      if (Array.isArray(json)) items = json;
      else if (Array.isArray(json.resultList)) items = json.resultList;
      else if (Array.isArray(json.data)) items = json.data;

      const mapped = items
        .map((it: any, idx: number) => {
          const label =
            it.systemName || it.systemNm || it.sysCodeNm || it.name || it.menuNm || it.label;
          const id = it.systemId || it.sysCode || it.id || String(idx);
          if (!label) return null;
          return { id: String(id), label };
        })
        .filter(Boolean) as { id: string; label: string }[];

      return mapped;
    } catch (err) {
      console.error("Error fetching assignable systems", err);
      return [];
    }
  };

  // Fetch role codes and then system manager users from server
  const fetchManagers = async () => {
    try {
      const codes = await fetchCodeTypes("R0");
      const sysRole = codes.find((r) => r.cmmnCodeNm === "시스템관리자");
      const roleCode = sysRole?.cmmnCode;
      if (!roleCode) return;
      const resp = await fetchUsersByRole(roleCode, 1, 100);
      const mapped = resp.resultList.map((u: UserData, idx: number) => ({
        id: idx + 1,
        userId: u.userId,
        userName: u.userId,
        displayName: u.userNm || u.userId,
        role: u.userTyCodeNm || "",
        avatarColor: "",
        // placeholder permissions until we fetch the assigned endpoint
        permissions: u.assigned ? (u.assigned as any).permissions || [] : [],
      }));

      // Fetch assigned systems for each manager and populate their permissions
      const withPermissions = await Promise.all(
        mapped.map(async (m) => {
          const perms = await fetchAssignedSystems(m.userId, false).catch(
            () => m.permissions || [],
          );
          return {
            ...m,
            permissions: perms,
          };
        }),
      );

      setManagers(withPermissions.length ? withPermissions : DEFAULT_MANAGERS);
      if (withPermissions.length) {
        setSelectedManager(withPermissions[0]);
        // load assigned systems for the selected manager and set selectedPermissions
        fetchAssignedSystems(withPermissions[0].userId, true).catch(() =>
          setSelectedPermissions(withPermissions[0].permissions || []),
        );
        // also load assignable systems for the selected manager
        fetchAssignableSystems(withPermissions[0].userId)
          .then((list) => setAssignableSystems(list))
          .catch(() => setAssignableSystems([]));
      }
    } catch (err) {
      console.error("Failed to load system managers", err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleManagerSelect = (manager: SystemManager) => {
    setSelectedManager(manager);
    // load assigned systems from server and update checked items
    // fetch assigned labels and set selectedPermissions so assigned items are checked
    fetchAssignedSystems(manager.userId, true).catch(() =>
      setSelectedPermissions(manager.permissions || []),
    );
    // load assignable systems for this manager
    fetchAssignableSystems(manager.userId)
      .then((list) => setAssignableSystems(list))
      .catch(() => setAssignableSystems([]));
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

  const filteredManagers = managers.filter((manager) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      manager.userId.toLowerCase().includes(q) ||
      (manager.displayName || "").toLowerCase().includes(q)
    );
  });

  return (
    <RequirePermission nodeId="system-mgr">
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
                    onClick={() => fetchManagers()}
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
                    display: "none",
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
                divider={
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }} />
                }
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
                  {(assignableSystems.length
                    ? assignableSystems
                    : systemPermissions
                  ).map((permission: any, idx: number) => (
                    <Box
                      key={permission.id ?? idx}
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
    </RequirePermission>
  );
}
