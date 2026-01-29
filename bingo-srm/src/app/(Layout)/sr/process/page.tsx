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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import RequirePermission from "@/src/components/RequirePermission";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SRSearchForm, {
  SRSearchFormData,
} from "@/src/components/sr/SRSearchForm";
import SRDataGrid, {
  createActionColumn,
  SRDataRow,
} from "@/src/components/sr/SRDataGrid";

interface SRProcess extends SRDataRow {
  requestType: string;
  inspectionDateTime: string;
  processingDateTime: string;
  reRequestSR: string;
}

const mockData: SRProcess[] = [
  {
    id: 1,
    no: 6,
    srNumber: "SR-2601-008",
    srTitle: "개발1",
    applicationMonth: "202601",
    requestType: "응용프로그램",
    requestDate: "2026-01-08 13:50",
    inspectionDateTime: "2026-01-08 13:54",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 2,
    no: 5,
    srNumber: "SR-2511-006",
    srTitle: "sdf",
    applicationMonth: "202511",
    requestType: "응용프로그램",
    requestDate: "2025-11-19 13:30",
    inspectionDateTime: "2026-01-07 14:58",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 3,
    no: 4,
    srNumber: "SR-2511-005",
    srTitle: "re-관리자오점전",
    applicationMonth: "202511",
    requestType: "인프라",
    requestDate: "2025-11-07 19:48",
    inspectionDateTime: "2025-11-07 19:51",
    processingDateTime: "",
    reRequestSR: "SR-2511-001",
  },
  {
    id: 4,
    no: 3,
    srNumber: "SR-2511-002",
    srTitle: "관리자 2",
    applicationMonth: "202511",
    requestType: "",
    requestDate: "2025-11-04 14:12",
    inspectionDateTime: "2025-11-07 19:40",
    processingDateTime: "",
    reRequestSR: "",
  },
  {
    id: 5,
    no: 2,
    srNumber: "SR-2506-007",
    srTitle: "re-오장",
    applicationMonth: "202506",
    requestType: "인프라",
    requestDate: "2025-06-24 09:42",
    inspectionDateTime: "2025-11-01 12:08",
    processingDateTime: "",
    reRequestSR: "SR-2506-003",
  },
  {
    id: 6,
    no: 1,
    srNumber: "SR-2506-001",
    srTitle: "2차신청-1",
    applicationMonth: "",
    requestType: "",
    requestDate: "2025-06-03 18:15",
    inspectionDateTime: "2025-06-13 15:19",
    processingDateTime: "",
    reRequestSR: "",
  },
];

export default function SRProcessPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useLocale();
  const [selectedSR, setSelectedSR] = useState<SRProcess | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSearch = (searchData: SRSearchFormData) => {
    console.log("검색:", searchData);
    // TODO: Implement search logic
  };

  const handleSearchReset = () => {
    console.log("검색 초기화");
    // TODO: Implement reset logic
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    row: SRDataRow,
  ) => {
    setSelectedSR(row as SRProcess);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (selectedSR) {
      router.push("/sr/process/edit");
    }
  };

  const handleDelete = () => {
    handleCloseMenu();
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log("삭제:", selectedSR);
    // TODO: Implement delete logic
    setDeleteConfirmOpen(false);
    setSelectedSR(null);
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: t("srProcess.columns.no"),
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srNumber",
      headerName: t("srProcess.columns.srNumber"),
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srTitle",
      headerName: t("srProcess.columns.srTitle"),
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "applicationMonth",
      headerName: t("srProcess.columns.applicationMonth"),
      flex: 0.8,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requestType",
      headerName: t("srProcess.columns.requestType"),
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requestDate",
      headerName: t("srProcess.columns.requestDate"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inspectionDateTime",
      headerName: t("srProcess.columns.inspectionDateTime"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processingDateTime",
      headerName: t("srProcess.columns.processingDateTime"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reRequestSR",
      headerName: t("srProcess.columns.reRequestSR"),
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    createActionColumn(handleActionClick),
  ];

  return (
    <RequirePermission nodeId="sr-process">
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
            {t("srProcess.title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {t("srProcess.subtitle")}
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
            <ListItemText>{t("srProcess.menu.edit")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("srProcess.menu.delete")}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>{t("srProcess.dialog.deleteTitle")}</DialogTitle>
          <DialogContent>
            <Typography>
              {t("srProcess.dialog.srNumber")}: {selectedSR?.srNumber}
              <br />
              {t("srProcess.dialog.title")}: {selectedSR?.srTitle}
              <br />
              <br />
              {t("srProcess.dialog.confirmMessage")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>
              {t("srProcess.buttons.cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              {t("srProcess.buttons.delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </RequirePermission>
  );
}
