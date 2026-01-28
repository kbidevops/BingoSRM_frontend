"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import {
  fetchUserList,
  fetchCodeTypes,
  fetchUserDetail,
  updateUser,
  deleteUser,
  type UserData,
  type CodeItem,
  type UserDetailResponse,
} from "@/src/lib/auth";
import { registerUser, type RegisterUserRequest } from "@/src/lib/registerUser";
import { checkUserIdDuplicate } from "@/src/lib/registerUser";
import { useSnackbar } from "notistack";

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
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSelectionModel,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
  // Work location codes state
  const [workLocationCodes, setWorkLocationCodes] = useState<
    import("@/src/lib/auth").CodeItem[]
  >([]);
  useLocale();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const snackbarOptions = {
    anchorOrigin: { vertical: "top" as const, horizontal: "center" as const },
  };

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 15,
  });

  const [searchRole, setSearchRole] = useState("ALL");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [searchExpanded, setSearchExpanded] = useState(true);

  // Search form states
  const [searchUserId, setSearchUserId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchOrg, setSearchOrg] = useState("");
  const [searchPosition, setSearchPosition] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // API data states
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [statusCodes, setStatusCodes] = useState<CodeItem[]>([]);
  const [roleCodes, setRoleCodes] = useState<CodeItem[]>([]);

  // Dialog form state
  const [formData, setFormData] = useState({
    userId: "",
    userNm: "",
    userPassword: "",
    userPasswordConfirm: "",
    email: "",
    psitn: "",
    clsf: "",
    moblphon: "",
    userTyCode: "",
    userSttusCode: "",
    acntReqstResn: "",
    changePasswordYN: "N",
    userLocat: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch users from API
  const loadUsers = async (searchParams?: {
    userId?: string;
    userNm?: string;
    psitn?: string;
    userSttusCode?: string;
    userTyCode?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetchUserList({
        pageIndex: paginationModel.page + 1, // API uses 1-based indexing
        recordCountPerPage: paginationModel.pageSize,
        ...searchParams,
      });

      // Map UserData to User interface
      const mappedUsers: User[] = response.resultList.map(
        (userData: UserData, index: number) => ({
          id: paginationModel.page * paginationModel.pageSize + index + 1,
          userId: userData.userId,
          name: userData.userNm,
          role: userData.userTyCodeNm,
          org: userData.psitn || "-",
          position: userData.clsf || "-",
          status: userData.userSttusCodeNm,
        }),
      );

      setUsers(mappedUsers);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [paginationModel.page, paginationModel.pageSize]);

  // Fetch status codes and role codes on mount
  useEffect(() => {
    const loadStatusCodes = async () => {
      try {
        const codes = await fetchCodeTypes("U0");
        setStatusCodes(codes);
        console.log("status codes", codes);
      } catch (error) {
        console.error("Failed to fetch status codes:", error);
      }
    };
    const loadRoleCodes = async () => {
      try {
        const codes = await fetchCodeTypes("R0");
        setRoleCodes(codes);
        console.log("role codes", codes);
      } catch (error) {
        console.error("Failed to fetch role codes:", error);
      }
    };
    loadStatusCodes();
    loadRoleCodes();
    // Load work location codes
    const loadWorkLocationCodes = async () => {
      try {
        const codes = await fetchCodeTypes("L0");
        setWorkLocationCodes(codes);
      } catch (error) {
        console.error("Failed to fetch work location codes:", error);
      }
    };
    loadWorkLocationCodes();
  }, []);

  // Search handler
  const handleSearch = () => {
    // Build search parameters using direct query parameters (legacy approach)
    const searchParams: {
      userId?: string;
      userNm?: string;
      psitn?: string;
      userSttusCode?: string;
      userTyCode?: string;
    } = {};

    if (searchUserId) {
      searchParams.userId = searchUserId;
    }
    if (searchName) {
      searchParams.userNm = searchName;
    }
    if (searchOrg) {
      searchParams.psitn = searchOrg;
    }

    // Send role.cmmnCode as userTyCode for role filtering
    if (searchRole !== "ALL") {
      searchParams.userTyCode = searchRole;
    }

    // Use selected status code if not ALL
    if (searchStatus !== "ALL") {
      searchParams.userSttusCode = searchStatus;
    }

    loadUsers(searchParams);
  };

  // Reset handler
  const handleReset = () => {
    setSearchUserId("");
    setSearchName("");
    setSearchOrg("");
    setSearchPosition("");
    setSearchRole("ALL");
    setSearchStatus("ALL");
    loadUsers();
  };

  // Load user details for editing
  const handleEditUser = async (user: User) => {
    try {
      const userDetail = await fetchUserDetail(user.userId);
      setFormData({
        userId: userDetail.userId,
        userNm: userDetail.userNm,
        userPassword: "",
        userPasswordConfirm: "",
        email: userDetail.email || "",
        psitn: userDetail.psitn || "",
        clsf: userDetail.clsf || "",
        moblphon: userDetail.moblphon || "",
        userTyCode: userDetail.userTyCode || "",
        userSttusCode: userDetail.userSttusCode || "",
        acntReqstResn: userDetail.acntReqstResn || "",
        changePasswordYN: "N",
        userLocat: userDetail.userLocat || "",
      });
      setSelectedUser(user);
      setDialogMode("edit");
      setOpenDialog(true);
    } catch (error) {
      console.error("Failed to load user details:", error);
    }
  };

  // Reset form for creating new user
  const handleCreateUser = () => {
    setFormData({
      userId: "",
      userNm: "",
      userPassword: "",
      userPasswordConfirm: "",
      email: "",
      psitn: "",
      clsf: "",
      moblphon: "",
      userTyCode: "",
      userSttusCode: "",
      acntReqstResn: "",
      changePasswordYN: "N",
      userLocat: "",
    });
    setSelectedUser(null);
    setDialogMode("create");
    setOpenDialog(true);
  };

  // Save user (create or update)
  const handleSaveUser = async () => {
    setSaveLoading(true);
    try {
      if (dialogMode === "create") {
        // Registration mode: use registerUser API
        const registerData: RegisterUserRequest = {
          userId: formData.userId,
          userPassword: formData.userPassword, // Password field for registration
          userNm: formData.userNm,
          userTyCode: formData.userTyCode,
          userSttusCode: formData.userSttusCode,
          psitn: formData.psitn,
          clsf: formData.clsf,
          moblphon: formData.moblphon,
          email: formData.email,
          acntReqstResn: formData.acntReqstResn,
          userLocat: formData.userLocat,
        };
        const result = await registerUser(registerData);
        if (!result.success) {
          enqueueSnackbar(result.message || "사용자 등록에 실패했습니다.", {
            variant: "warning",
            ...snackbarOptions,
          });
          setSaveLoading(false);
          return;
        }
      } else {
        // Update mode: use updateUser API
        const updateData: import("@/src/lib/auth").UpdateUserRequest = {
          userNm: formData.userNm,
          userTyCode: formData.userTyCode,
          userSttusCode: formData.userSttusCode,
          psitn: formData.psitn,
          clsf: formData.clsf,
          moblphon: formData.moblphon,
          email: formData.email,
          acntReqstResn: formData.acntReqstResn,
          userLocat: formData.userLocat,
        };
        await updateUser(formData.userId, updateData);
      }
      setOpenDialog(false);
      loadUsers(); // Reload user list
    } catch (error) {
      console.error("Failed to save user:", error);
      enqueueSnackbar("사용자 정보 저장에 실패했습니다.", { variant: "error" });
    } finally {
      setSaveLoading(false);
    }
  };

  const columns: GridColDef[] = [
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
          label={params.value || "-"}
          size="small"
          color={
            params.value === "시스템관리자"
              ? "error"
              : params.value === "시스템담당자"
                ? "primary"
                : "default"
          }
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
          label={params.value}
          size="small"
          color={
            params.value === "승인"
              ? "success"
              : params.value === "대기"
                ? "warning"
                : "default"
          }
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
          id={`actions-button-${params.row.id}`}
          aria-label={t("userManagement.buttons.moreActions")}
          aria-haspopup="true"
          aria-controls={anchorEl ? "user-actions-menu" : undefined}
          aria-expanded={Boolean(anchorEl)}
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
            aria-label={t("userManagement.searchToggle")}
            aria-controls="search-conditions"
            aria-expanded={searchExpanded}
            id="search-toggle-button"
            sx={{
              transition: "transform 0.2s",
              transform: searchExpanded ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Stack>
        {searchExpanded && (
          <Stack spacing={1.5} id="search-conditions" aria-live="polite">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              flexWrap="wrap"
              alignItems="center"
            >
              <TextField
                label={t("userManagement.fields.userId")}
                size="small"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "180px" },
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
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "180px" },
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
                  width: { xs: "100%", sm: "140px" },
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
              >
                <MenuItem value="ALL">
                  {t("userManagement.options.all")}
                </MenuItem>
                {roleCodes
                  .filter(
                    (role) =>
                      role.cmmnCode !== "R002" && role.cmmnCode !== "R004",
                  )
                  .map((role) =>
                    role.cmmnCode ? (
                      <MenuItem key={role.cmmnCode} value={role.cmmnCode}>
                        {role.cmmnCodeNm}
                      </MenuItem>
                    ) : null,
                  )}
              </TextField>
              <TextField
                label={t("userManagement.fields.organization")}
                size="small"
                value={searchOrg}
                onChange={(e) => setSearchOrg(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "180px" },
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
                value={searchPosition}
                onChange={(e) => setSearchPosition(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "180px" },
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
                  width: { xs: "100%", sm: "140px" },
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
              >
                <MenuItem value="ALL">
                  {t("userManagement.options.all")}
                </MenuItem>
                {statusCodes.map((status) =>
                  status.cmmnCode ? (
                    <MenuItem key={status.cmmnCode} value={status.cmmnCode}>
                      {status.cmmnCodeNm || status.cmmnCode}
                    </MenuItem>
                  ) : null,
                )}
              </TextField>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              spacing={1}
              sx={{ pt: 0.5, width: "100%" }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshIcon fontSize="small" />}
                size="small"
                onClick={handleReset}
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
                  alignSelf: { xs: "stretch", sm: "auto" },
                  justifyContent: "center",
                  width: { xs: "100%", sm: "auto" },
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
                onClick={handleSearch}
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
                  alignSelf: { xs: "stretch", sm: "auto" },
                  justifyContent: "center",
                  width: { xs: "100%", sm: "auto" },
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
          {t("userManagement.totalUsers", { count: totalCount })}
        </Typography>
        <Button
          variant="contained"
          size="medium"
          startIcon={<PersonAddIcon />}
          onClick={handleCreateUser}
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
              outline: (theme) => `2px solid ${theme.palette.primary.main}`,
              outlineOffset: "-2px",
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
              outline: (theme) => `2px solid ${theme.palette.primary.main}`,
              outlineOffset: "-2px",
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
          aria-label={t("userManagement.dataGrid")}
          rows={users}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 15, 30, 50]}
          rowCount={totalCount}
          paginationMode="server"
          loading={loading}
          disableRowSelectionOnClick
          checkboxSelection={true}
          selectionModel={selectionModel}
          onSelectionModelChange={(newModel) => setSelectionModel(newModel)}
          disableColumnMenu
        />
      </Box>

      {/* User Registration Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="user-dialog-title"
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
          id="user-dialog-title"
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
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
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
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
                        aria-label={t("userManagement.buttons.checkDuplicate")}
                        sx={{
                          whiteSpace: "nowrap",
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                        onClick={async () => {
                          if (!formData.userId) {
                            enqueueSnackbar("아이디를 입력하세요.", {
                              variant: "warning",
                              ...snackbarOptions,
                            });
                            return;
                          }
                          const result = await checkUserIdDuplicate(
                            formData.userId,
                          );
                          if (result.taken) {
                            enqueueSnackbar("이미 사용 중인 아이디입니다.", {
                              variant: "error",
                              ...snackbarOptions,
                            });
                          } else if (result.error) {
                            enqueueSnackbar(
                              "중복 확인 중 오류 발생: " + result.error,
                              {
                                variant: "error",
                                ...snackbarOptions,
                              },
                            );
                          } else {
                            enqueueSnackbar("사용 가능한 아이디입니다.", {
                              variant: "success",
                              ...snackbarOptions,
                            });
                          }
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
                    value={formData.userNm}
                    onChange={(e) =>
                      setFormData({ ...formData, userNm: e.target.value })
                    }
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
                          checked={formData.changePasswordYN === "Y"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              changePasswordYN: e.target.checked ? "Y" : "N",
                            })
                          }
                        />
                      }
                      label={<Typography variant="body2">변경</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Stack>
                  <TextField
                    size="small"
                    fullWidth
                    type="password"
                    value={formData.userPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, userPassword: e.target.value })
                    }
                    disabled={formData.changePasswordYN !== "Y"}
                    placeholder="비밀번호"
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
                    value={formData.userPasswordConfirm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userPasswordConfirm: e.target.value,
                      })
                    }
                    disabled={formData.changePasswordYN !== "Y"}
                    placeholder="비밀번호 확인"
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    value={formData.moblphon}
                    onChange={(e) =>
                      setFormData({ ...formData, moblphon: e.target.value })
                    }
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
                    value={formData.userLocat || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, userLocat: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="">선택</MenuItem>
                    {workLocationCodes.map((loc) =>
                      loc.cmmnCode ? (
                        <MenuItem key={loc.cmmnCode} value={loc.cmmnCode}>
                          {loc.cmmnCodeNm || loc.cmmnCode}
                        </MenuItem>
                      ) : null,
                    )}
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
                    value={formData.userTyCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userTyCode: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="">선택하세요</MenuItem>
                    {roleCodes
                      .filter(
                        (role) =>
                          role.cmmnCode !== "R002" && role.cmmnCode !== "R004",
                      )
                      .map((role) =>
                        role.cmmnCode ? (
                          <MenuItem key={role.cmmnCode} value={role.cmmnCode}>
                            {role.cmmnCodeNm}
                          </MenuItem>
                        ) : null,
                      )}
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
                    value={formData.userSttusCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userSttusCode: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="ALL">
                      {t("userManagement.options.all")}
                    </MenuItem>
                    {statusCodes.map((status) =>
                      status.cmmnCode ? (
                        <MenuItem key={status.cmmnCode} value={status.cmmnCode}>
                          {status.cmmnCodeNm || status.cmmnCode}
                        </MenuItem>
                      ) : null,
                    )}
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
            onClick={handleSaveUser}
            disabled={saveLoading}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {saveLoading ? "저장 중..." : t("userManagement.buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-label": t("userManagement.buttons.actions"),
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedUser) {
              handleEditUser(selectedUser);
            }
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

      {/* Delete Confirmation Dialog (styled) */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-confirm-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: { xs: "90%", sm: 420 },
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogContent sx={{ pt: 3, px: 4, pb: 2, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: (theme) => theme.palette.error.main,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
            aria-hidden
          >
            <ErrorOutlineIcon fontSize="large" />
          </Box>

          <Typography
            id="delete-confirm-title"
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            {t("userManagement.dialog.deleteTitle") || "정말 삭제하시겠습니까?"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            {t("userManagement.dialog.deleteWarning") ||
              "삭제된 데이터는 복구할 수 없습니다."}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 500,
              color: "text.primary",
            }}
            aria-label={t("userManagement.buttons.cancel")}
          >
            {t("userManagement.buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (!selectedUser) return;
              try {
                await deleteUser(selectedUser.userId);
                enqueueSnackbar(
                  t("userManagement.messages.deleteSuccess") ||
                    "사용자 삭제가 완료되었습니다.",
                  { variant: "success", ...snackbarOptions },
                );
                setDeleteConfirmOpen(false);
                setSelectedUser(null);
                loadUsers();
              } catch (err) {
                console.error("Failed to delete user:", err);
                enqueueSnackbar("사용자 삭제에 실패했습니다.", {
                  variant: "error",
                  ...snackbarOptions,
                });
              }
            }}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              fontWeight: 600,
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
            }}
            aria-label={t("userManagement.buttons.delete")}
          >
            {t("userManagement.buttons.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
