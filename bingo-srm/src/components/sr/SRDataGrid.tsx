"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export interface SRDataRow {
  id: number;
  no: number;
  srNumber: string;
  srTitle: string;
  applicationMonth: string;
  requestDate: string;
  [key: string]: unknown;
}

interface SRDataGridProps {
  rows: SRDataRow[];
  columns: GridColDef[];
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  checkboxSelection?: boolean;
  onRowClick?: (row: SRDataRow) => void;
}

export default function SRDataGrid({
  rows,
  columns,
  paginationModel,
  onPaginationModelChange,
  checkboxSelection = false,
  onRowClick,
}: SRDataGridProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
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
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection}
        disableColumnMenu
        onRowClick={onRowClick ? (params) => onRowClick(params.row) : undefined}
      />
    </Box>
  );
}

// Utility function to create action column
export const createActionColumn = (
  onActionClick: (event: React.MouseEvent<HTMLElement>, row: SRDataRow) => void,
): GridColDef => ({
  field: "actions",
  headerName: "",
  width: 60,
  sortable: false,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onActionClick(e, params.row);
      }}
    >
      <MoreVertIcon fontSize="small" />
    </IconButton>
  ),
});

// Utility function to create SR Number column with link styling
export const createSRNumberColumn = (width: number = 130): GridColDef => ({
  field: "srNumber",
  headerName: "SR번호",
  width,
  headerAlign: "center",
  align: "center",
  renderCell: (params) => (
    <Typography
      sx={{
        color: "primary.main",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      {params.value}
    </Typography>
  ),
});

// Common column definitions
export const commonSRColumns: GridColDef[] = [
  {
    field: "no",
    headerName: "No",
    width: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "srNumber",
    headerName: "SR번호",
    flex: 1,
    minWidth: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "srTitle",
    headerName: "SR제목",
    flex: 2,
    minWidth: 200,
  },
  {
    field: "applicationMonth",
    headerName: "신청년월",
    flex: 1,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "requestDate",
    headerName: "요청일",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];
