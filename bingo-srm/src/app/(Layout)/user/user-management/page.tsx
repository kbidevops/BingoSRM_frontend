"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";

import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Checkbox,
  Avatar,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface User {
  id: number;
  userId: string;
  name: string;
  role: string;
  org: string;
  position: string;
  status: string;
}

export default function UserManagement() {
  useLocale();
  const { t } = useTranslation();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [searchRole, setSearchRole] = useState("ALL");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [searchExpanded, setSearchExpanded] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      renderHeader: () => <Checkbox size="small" />,
      renderCell: () => <Checkbox size="small" />,
    },
    {
      field: "userId",
      headerName: t("userManagement.fields.userId"),
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: t("userManagement.fields.name"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: t("userManagement.fields.role"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={
            params.value === "관리자"
              ? t("userManagement.roles.admin")
              : t("userManagement.roles.user")
          }
          size="small"
          color={params.value === "관리자" ? "error" : "default"}
          sx={{
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      field: "org",
      headerName: t("userManagement.fields.organization"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "position",
      headerName: t("userManagement.fields.position"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: t("userManagement.fields.status"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={
            params.value === "사용중"
              ? t("userManagement.statuses.active")
              : t("userManagement.statuses.inactive")
          }
          size="small"
          color={params.value === "사용중" ? "success" : "default"}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelectedUser(params.row);
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      userId: "admin",
      name: "홍길동",
      role: "관리자",
      org: "IT팀",
      position: "차장",
      status: "사용중",
    },
    {
      id: 2,
      userId: "user01",
      name: "김철수",
      role: "사용자",
      org: "영업팀",
      position: "대리",
      status: "사용중",
    },
  ];

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        p: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          {t("userManagement.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {t("userManagement.subtitle")}
        </Typography>
      </Box>

      {/* Search Form */}
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 1.5,
          borderRadius: 2,
          mb: 1.5,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0 2px 4px -1px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: searchExpanded ? 1.5 : 0 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: "0.875rem",
            }}
          >
            <FilterListIcon fontSize="small" sx={{ color: "primary.main" }} />
            {t("userManagement.searchConditions")}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSearchExpanded(!searchExpanded)}
            sx={{
              transition: "transform 0.2s",
              transform: searchExpanded ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Stack>
        {searchExpanded && (
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              alignItems="center"
            >
              <TextField
                label={t("userManagement.fields.userId")}
                size="small"
                sx={{
                  width: "180px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                placeholder={t("userManagement.placeholders.userId")}
              />
              <TextField
                label={t("userManagement.fields.name")}
                size="small"
                sx={{
                  width: "180px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                placeholder={t("userManagement.placeholders.name")}
              />
              <TextField
                select
                label={t("userManagement.fields.role")}
                size="small"
                sx={{
                  width: "140px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="ALL">{t("userManagement.options.all")}</option>
                <option value="ADMIN">
                  {t("userManagement.options.admin")}
                </option>
                <option value="USER">{t("userManagement.options.user")}</option>
              </TextField>
              <TextField
                label={t("userManagement.fields.organization")}
                size="small"
                sx={{
                  width: "180px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                placeholder={t("userManagement.placeholders.organization")}
              />
              <TextField
                label={t("userManagement.fields.position")}
                size="small"
                sx={{
                  width: "180px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                placeholder={t("userManagement.placeholders.position")}
              />
              <TextField
                select
                label={t("userManagement.fields.status")}
                size="small"
                sx={{
                  width: "140px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                    height: "36px",
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-focused": {
                      bgcolor: "background.paper",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="ALL">{t("userManagement.options.all")}</option>
                <option value="ACTIVE">
                  {t("userManagement.options.active")}
                </option>
                <option value="INACTIVE">
                  {t("userManagement.options.inactive")}
                </option>
              </TextField>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              sx={{ pt: 0.5 }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshIcon fontSize="small" />}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  minHeight: "32px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  borderWidth: 1.5,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderWidth: 1.5,
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {t("userManagement.buttons.reset")}
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon fontSize="small" />}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  minHeight: "32px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {t("userManagement.buttons.search")}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>

      {/* Action Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5, flexShrink: 0 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {t("userManagement.totalUsers", { count: rows.length })}
        </Typography>
        <Button
          variant="contained"
          size="medium"
          startIcon={<PersonAddIcon />}
          onClick={() => {
            setSelectedUser(null);
            setDialogMode("create");
            setOpenDialog(true);
          }}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            px: 3,
            fontWeight: 500,
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          {t("userManagement.buttons.register")}
        </Button>
      </Stack>

      {/* Data Grid */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "& .MuiDataGrid-root": {
            border: "none",
            bgcolor: "background.paper",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "divider",
            py: 1.5,
            display: "flex",
            alignItems: "center",
            "&:focus, &:focus-within": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "action.hover",
            borderBottom: "2px solid",
            borderColor: "divider",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "text.primary",
          },
          "& .MuiDataGrid-columnHeader": {
            "&:focus, &:focus-within": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-row": {
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "action.hover",
            },
            "&.Mui-selected": {
              bgcolor: "action.selected",
              "&:hover": {
                bgcolor: "action.selected",
              },
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            bgcolor: "background.paper",
          },
          "& .MuiDataGrid-footerContainer": {
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          checkboxSelection={false}
          disableColumnMenu
        />
      </Box>

      {/* User Registration Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {dialogMode === "create"
              ? t("userManagement.dialog.createTitle")
              : t("userManagement.dialog.editTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              {/* Row 1: User ID and Name */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 사용자 아이디
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      defaultValue={selectedUser?.userId || ""}
                      disabled={dialogMode === "edit"}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                    {dialogMode === "create" && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          whiteSpace: "nowrap",
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        중복확인
                      </Button>
                    )}
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 성명
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    defaultValue={selectedUser?.name || ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Row 2: Password and Password Confirmation */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                      }}
                    >
                      • 비밀번호
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                        />
                      }
                      label={<Typography variant="body2">보정</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Stack>
                  <TextField
                    size="small"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    defaultValue="••••••"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 비밀번호 확인
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    type="password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Row 3: Email and Contact */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 이메일
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    defaultValue="bayarchimeg"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 연락처(휴대폰)
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Row 4: Organization and Position */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 소속
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    defaultValue={selectedUser?.org || ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 직급
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    defaultValue={selectedUser?.position || ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Row 5: Work Location and Remarks */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 근무위치
                  </Typography>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    defaultValue=""
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="">선택</MenuItem>
                  </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 계정상태사유/비고
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Row 6: Authority and Status */}
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 권한
                  </Typography>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    defaultValue={selectedUser?.role || ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="">선택하세요</MenuItem>
                    <MenuItem value="관리자">관리자</MenuItem>
                    <MenuItem value="사용자">사용자</MenuItem>
                  </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    • 상태
                  </Typography>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    defaultValue={selectedUser?.status || ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="">선택하세요</MenuItem>
                    <MenuItem value="사용중">사용중</MenuItem>
                    <MenuItem value="중지">중지</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2.5,
            gap: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
            }}
          >
            {t("userManagement.buttons.list")}
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {t("userManagement.buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setDialogMode("edit");
            setOpenDialog(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("userManagement.buttons.edit")}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteConfirmOpen(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("userManagement.buttons.delete")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          {t("userManagement.dialog.deleteTitle")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography>
            {t("userManagement.dialog.deleteConfirm", {
              name: selectedUser?.name,
            })}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2.5,
            gap: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
            }}
          >
            {t("userManagement.buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // TODO: Implement delete logic here
              console.log("Deleting user:", selectedUser);
              setDeleteConfirmOpen(false);
              setSelectedUser(null);
            }}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {t("userManagement.buttons.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
