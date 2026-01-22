"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Badge,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SRSearchForm, {
  SRSearchFormData,
} from "@/src/components/sr/SRSearchForm";
import SRDataGrid, {
  createActionColumn,
  SRDataRow,
} from "@/src/components/sr/SRDataGrid";

interface SRRequest {
  id: number;
  no: number;
  srNumber: string;
  srTitle: string;
  applicationMonth: string;
  requestType: string;
  requestDate: string;
  receiptDateTime: string;
  processingDateTime: string;
  reRequestSR: string;
  [key: string]: unknown;
}

const mockData: SRRequest[] = [
  {
    id: 5,
    no: 5,
    srNumber: "SR-2601-010",
    srTitle: "신규 개발(admin)",
    applicationMonth: "202601",
    requestType: "",
    requestDate: "2026-01-15 13:11",
    receiptDateTime: "",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 4,
    no: 4,
    srNumber: "SR-2601-009",
    srTitle: "신규 개발(admin)",
    applicationMonth: "202601",
    requestType: "",
    requestDate: "2026-01-15 13:11",
    receiptDateTime: "",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 3,
    no: 3,
    srNumber: "SR-2601-006",
    srTitle: "신규 개발(20260108)",
    applicationMonth: "202601",
    requestType: "",
    requestDate: "2026-01-08 10:35",
    receiptDateTime: "",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 2,
    no: 2,
    srNumber: "SR-2601-002",
    srTitle: "신규 개발 신규 개발1",
    applicationMonth: "202601",
    requestType: "",
    requestDate: "2026-01-07 15:52",
    receiptDateTime: "",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 1,
    no: 1,
    srNumber: "SR-2601-001",
    srTitle: "신규 개발",
    applicationMonth: "202601",
    requestType: "",
    requestDate: "2026-01-07 15:32",
    receiptDateTime: "",
    processingDateTime: "",
    reRequestSR: "",
  },
];

export default function SRRequestPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedSR, setSelectedSR] = useState<SRRequest | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSearch = (formData: SRSearchFormData) => {
    console.log("검색:", formData);
  };

  const handleSearchReset = () => {
    console.log("검색 초기화");
  };

  const handleRegister = () => {
    router.push("/sr/request/edit?mode=create");
  };

  const handleEdit = () => {
    if (selectedSR) {
      router.push(`/sr/request/edit?mode=edit&id=${selectedSR.id}`);
    }
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting SR:", selectedSR);
    // API call to delete
    setDeleteConfirmOpen(false);
    setSelectedSR(null);
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    row: SRRequest | SRDataRow,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSR(row as SRRequest);
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: t("srRequest.columns.no"),
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "srNumber",
      headerName: t("srRequest.columns.srNumber"),
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "srTitle",
      headerName: t("srRequest.columns.srTitle"),
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationMonth",
      headerName: t("srRequest.columns.applicationMonth"),
      flex: 0.8,
      minWidth: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "requestType",
      headerName: t("srRequest.columns.requestType"),
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "requestDate",
      headerName: t("srRequest.columns.requestDate"),
      flex: 1.2,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "receiptDateTime",
      headerName: t("srRequest.columns.receiptDateTime"),
      flex: 1.2,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "processingDateTime",
      headerName: t("srRequest.columns.processingDateTime"),
      flex: 1.2,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "reRequestSR",
      headerName: t("srRequest.columns.reRequestSR"),
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
    },
    createActionColumn(handleActionClick),
  ];

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, md: 3 },
        overflow: "hidden",
      }}
    >
      {/* Page Title and Register Button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            {t("srRequest.title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {t("srRequest.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<EditIcon />}
          onClick={handleRegister}
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
          {t("srRequest.buttons.register")}
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ flexGrow: 1, overflow: "hidden", minHeight: 0 }}
      >
        {/* Left Panel - Search Form */}
        <Box
          sx={{
            width: { xs: "100%", md: 370 },
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flexShrink: 0,
          }}
        >
          <SRSearchForm onSearch={handleSearch} onReset={handleSearchReset} />
        </Box>

        {/* Right Panel - Data Table */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {/* Data Grid */}
          <SRDataGrid
            rows={mockData}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            checkboxSelection
          />
        </Box>
      </Stack>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("srRequest.menu.edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("srRequest.menu.delete")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            pb: 1,
          }}
        >
          {t("srRequest.dialog.deleteTitle")}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {t("srRequest.dialog.srNumber")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: "primary.main",
                }}
              >
                {selectedSR?.srNumber}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {t("srRequest.dialog.title")}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedSR?.srTitle}
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "error.lighter",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "error.dark",
                  fontWeight: 500,
                }}
              >
                {t("srRequest.dialog.confirmMessage")}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            {t("srRequest.buttons.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
              },
            }}
          >
            {t("srRequest.buttons.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
