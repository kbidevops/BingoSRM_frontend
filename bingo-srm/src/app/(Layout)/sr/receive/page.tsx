"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import RequirePermission from "@/src/components/RequirePermission";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SRSearchForm, {
  SRSearchFormData,
} from "@/src/components/sr/SRSearchForm";
import SRDataGrid, { createActionColumn } from "@/src/components/sr/SRDataGrid";

interface SRReceive {
  id: number;
  no: number;
  srNumber: string;
  srTitle: string;
  applicationMonth: string;
  errorType: string;
  requestDate: string;
  receiveDateTime: string;
  productionRequest: string;
  productionComplete: string;
}

const mockData: SRReceive[] = [
  {
    id: 1,
    no: 5,
    srNumber: "SR-2601-010",
    srTitle: "신규 개발(admin)",
    applicationMonth: "202601",
    errorType: "",
    requestDate: "2026-01-15 13:11",
    receiveDateTime: "",
    productionRequest: "",
    productionComplete: "",
  },
  {
    id: 2,
    no: 4,
    srNumber: "SR-2601-009",
    srTitle: "신규 개발(admin)",
    applicationMonth: "202601",
    errorType: "",
    requestDate: "2026-01-15 13:11",
    receiveDateTime: "",
    productionRequest: "",
    productionComplete: "",
  },
  {
    id: 3,
    no: 3,
    srNumber: "SR-2601-006",
    srTitle: "신규 개발(20260108)",
    applicationMonth: "202601",
    errorType: "",
    requestDate: "2026-01-08 10:35",
    receiveDateTime: "",
    productionRequest: "",
    productionComplete: "",
  },
  {
    id: 4,
    no: 2,
    srNumber: "SR-2601-002",
    srTitle: "신규 개발 신규 개발1",
    applicationMonth: "202601",
    errorType: "",
    requestDate: "2026-01-07 15:52",
    receiveDateTime: "",
    productionRequest: "",
    productionComplete: "",
  },
  {
    id: 5,
    no: 1,
    srNumber: "SR-2601-001",
    srTitle: "신규 개발",
    applicationMonth: "202601",
    errorType: "",
    requestDate: "2026-01-07 15:32",
    receiveDateTime: "",
    productionRequest: "",
    productionComplete: "",
  },
];

export default function SRReceivePage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const [selectedSR, setSelectedSR] = useState<SRReceive | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSearch = (formData: SRSearchFormData) => {
    console.log("검색:", formData);
  };

  const handleSearchReset = () => {
    console.log("검색 초기화");
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    row: SRReceive,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSR(row);
  };

  const handleEdit = () => {
    router.push("/sr/receive/edit");
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    console.log("삭제:", selectedSR);
    // TODO: API call to delete
    setDeleteConfirmOpen(false);
    setSelectedSR(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: t("srReceive.columns.no"),
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srNumber",
      headerName: t("srReceive.columns.srNumber"),
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srTitle",
      headerName: t("srReceive.columns.srTitle"),
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationMonth",
      headerName: t("srReceive.columns.applicationMonth"),
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "errorType",
      headerName: t("srReceive.columns.errorType"),
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requestDate",
      headerName: t("srReceive.columns.requestDate"),
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receiveDateTime",
      headerName: t("srReceive.columns.receiveDateTime"),
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productionRequest",
      headerName: t("srReceive.columns.productionRequest"),
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productionComplete",
      headerName: t("srReceive.columns.productionComplete"),
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    createActionColumn(handleActionClick),
  ];

  return (
    <RequirePermission nodeId="sr-receive">
      <Stack
        sx={{
          height: "100%",
          bgcolor: "background.default",
          p: { xs: 2, md: 3 },
          overflow: "hidden",
        }}
      >
        {/* Page Title */}
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
            {t("srReceive.title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {t("srReceive.subtitle")}
          </Typography>
        </Box>

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

          {/* Right Panel - Data Grid */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <SRDataGrid
              rows={mockData}
              columns={columns}
              paginationModel={{ page: 0, pageSize: 10 }}
              checkboxSelection
            />
          </Box>
        </Stack>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("srReceive.menu.edit")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("srReceive.menu.delete")}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>{t("srReceive.dialog.deleteTitle")}</DialogTitle>
          <DialogContent>
            <Typography>
              {t("srReceive.dialog.srNumber")}: {selectedSR?.srNumber}
              <br />
              {t("srReceive.dialog.title")}: {selectedSR?.srTitle}
              <br />
              <br />
              {t("srReceive.dialog.confirmMessage")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>
              {t("srReceive.buttons.cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              {t("srReceive.buttons.delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </RequirePermission>
  );
}
