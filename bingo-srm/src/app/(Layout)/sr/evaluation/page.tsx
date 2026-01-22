"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import {
  Box,
  Stack,
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
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SRSearchForm, {
  SRSearchFormData,
} from "@/src/components/sr/SRSearchForm";
import SRDataGrid, {
  createActionColumn,
  SRDataRow,
} from "@/src/components/sr/SRDataGrid";

interface SREvaluation extends SRDataRow {
  requestType: string;
  inspectionDateTime: string;
  processingDateTime: string;
  reRequestSR: string;
}

const mockData: SREvaluation[] = [
  {
    id: 1,
    no: 1,
    srNumber: "SR-2601-003",
    srTitle: "신규 개발 신규 개발!",
    applicationMonth: "202601",
    requestType: "응용프로그램",
    requestDate: "2026-01-07 15:53",
    inspectionDateTime: "2026-01-07 16:07",
    processingDateTime: "2026-01-07 16:08",
    reRequestSR: "",
  },
];

export default function SREvaluationPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useLocale();
  const [selectedSR, setSelectedSR] = useState<SREvaluation | null>(null);
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
    setSelectedSR(row as SREvaluation);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (selectedSR) {
      router.push("/sr/evaluation/edit");
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

  const handleDownload = () => {
    console.log("다운로드");
    // TODO: Implement download logic
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: t("srEvaluation.columns.no"),
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srNumber",
      headerName: t("srEvaluation.columns.srNumber"),
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "srTitle",
      headerName: t("srEvaluation.columns.srTitle"),
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "applicationMonth",
      headerName: t("srEvaluation.columns.applicationMonth"),
      flex: 0.8,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requestType",
      headerName: t("srEvaluation.columns.requestType"),
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "requestDate",
      headerName: t("srEvaluation.columns.requestDate"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inspectionDateTime",
      headerName: t("srEvaluation.columns.inspectionDateTime"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "processingDateTime",
      headerName: t("srEvaluation.columns.processingDateTime"),
      flex: 1.2,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reRequestSR",
      headerName: t("srEvaluation.columns.reRequestSR"),
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    createActionColumn(handleActionClick),
  ];

  return (
    <Stack
      sx={{
        height: "100%",
        bgcolor: "background.default",
        p: { xs: 2, md: 3 },
        overflow: "hidden",
      }}
    >
      {/* Page Title and Download Button */}
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
            {t("srEvaluation.title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {t("srEvaluation.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          size="small"
        >
          {t("srEvaluation.buttons.download")}
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
          <ListItemText>{t("srEvaluation.menu.edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("srEvaluation.menu.delete")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t("srEvaluation.dialog.deleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("srEvaluation.dialog.srNumber")}: {selectedSR?.srNumber}
            <br />
            {t("srEvaluation.dialog.title")}: {selectedSR?.srTitle}
            <br />
            <br />
            {t("srEvaluation.dialog.confirmMessage")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t("srEvaluation.buttons.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            {t("srEvaluation.buttons.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
