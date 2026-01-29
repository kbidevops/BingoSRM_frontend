"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import SearchIcon from "@mui/icons-material/Search";
import RequirePermission from "@/src/components/RequirePermission";

interface EditFormState {
  srNumber: string;
  requestDateTime: string;
  requestCategory: string;
  requestType: string;
  requesterName: string;
  department: string;
  contact: string;
  email: string;
  referenceId: string;
  requestTitle: string;
  requestDetailContent: string;
  inspector: string;
  processingPerson: string;
  verificationPerson: string;
  completionPerson: string;
  inspectionDateTime: string;
  processingDate: string;
  processingTime: string;
  changeClassification: string;
  changeType: string;
  srProcessingTime: string;
  timeUnit: string;
  processingDetails: string;
  verificationDetails: string;
  completionDetails: string;
  etc: string;
  satisfaction: string;
}

export default function SREvaluationEditPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const locale = useLocale();

  const [editForm, setEditForm] = useState<EditFormState>({
    srNumber: "SR-2601-007",
    requestDateTime: "2026-01-08 10:38",
    requestCategory: "일반",
    requestType: "응용프로그램",
    requesterName: "admin",
    department: "admin",
    contact: "010-1234-1234",
    email: "admin@ezbus.com",
    referenceId: "",
    requestTitle: "신규 개발(20260108)(admin)",
    requestDetailContent: "",
    inspector: "admin",
    processingPerson: "admin",
    verificationPerson: "admin",
    completionPerson: "admin",
    inspectionDateTime: "2026-01-08 10:47",
    processingDate: "2026-01-08",
    processingTime: "13:55",
    changeClassification: "일반",
    changeType: "신규 개발",
    srProcessingTime: "1",
    timeUnit: "시간",
    processingDetails: "",
    verificationDetails: "",
    completionDetails: "",
    etc: "",
    satisfaction: "",
  });

  const [processingMethods, setProcessingMethods] = useState({
    dataModification: true,
    programModification: false,
    deployment: false,
    infrastructureWork: false,
  });

  const handleEditFormChange = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: keyof typeof processingMethods,
    checked: boolean,
  ) => {
    setProcessingMethods((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSaveEdit = () => {
    console.log("저장:", editForm, processingMethods);
    // TODO: API call to save
    router.push("/sr/evaluation");
  };

  const handleCancel = () => {
    router.push("/sr/evaluation");
  };

  return (
    <RequirePermission nodeId="sr-eval">
      <Stack
        sx={{
          height: "100vh",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
            >
              {t("srEvaluationEdit.title")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancel}
                sx={{ fontSize: "0.8rem" }}
              >
                {t("srEvaluationEdit.list")}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveEdit}
                sx={{ fontSize: "0.8rem" }}
              >
                {t("srEvaluationEdit.save")}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Stack spacing={2}>
            {/* SR Info */}
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  {t("srEvaluationEdit.srInfo")}
                </Typography>
                <Typography sx={{ color: "primary.main", fontSize: "0.85rem" }}>
                  {editForm.srNumber}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {t("srEvaluationEdit.requesterInfo")} {editForm.requesterName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {editForm.requestDateTime}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {t("srEvaluationEdit.requestCategory")}{" "}
                  {editForm.requestCategory}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {t("srEvaluationEdit.requestType")} {editForm.requestType}
                </Typography>
              </Stack>
            </Paper>

            {/* Three Column Layout */}
            <Stack direction="row" spacing={2}>
              {/* Column 1: Requester Info */}
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    pb: 0.5,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("srEvaluationEdit.requesterInfo")}
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 60,
                      }}
                    >
                      {t("srEvaluationEdit.name")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.requesterName}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 60,
                      }}
                    >
                      {t("srEvaluationEdit.department")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.department}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 60,
                      }}
                    >
                      {t("srEvaluationEdit.contact")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.contact}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 60,
                      }}
                    >
                      {t("srEvaluationEdit.email")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 60,
                      }}
                    >
                      {t("srEvaluationEdit.referenceId")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.referenceId}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {/* Column 2: Request Details */}
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    pb: 0.5,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("srEvaluationEdit.requestDetails")}
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.requestTitle")}
                    </Typography>
                    <Typography
                      sx={{
                        color: "primary.main",
                        fontSize: "0.8rem",
                        mb: 0.5,
                      }}
                    >
                      {editForm.requestTitle}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={editForm.requestTitle}
                      InputProps={{ readOnly: true }}
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.requestDetailContent")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={editForm.requestDetailContent}
                      InputProps={{ readOnly: true }}
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.requestAttachment")}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SearchIcon fontSize="small" />}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5 }}
                    ></Button>
                  </Box>
                </Stack>
              </Paper>

              {/* Column 3: SR Processing Content */}
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    pb: 0.5,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("srEvaluationEdit.srProcessingContent")}
                </Typography>

                <Stack spacing={1}>
                  {/* Personnel */}
                  <Stack direction="row" spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 60,
                        }}
                      >
                        {t("srEvaluationEdit.receiver")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        {editForm.inspector}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 60,
                        }}
                      >
                        {t("srEvaluationEdit.processingPerson")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        {editForm.processingPerson}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 60,
                        }}
                      >
                        {t("srEvaluationEdit.verificationPerson")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        {editForm.verificationPerson}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 60,
                        }}
                      >
                        {t("srEvaluationEdit.completionPerson")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        {editForm.completionPerson}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* 만족도 */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 80,
                      }}
                    >
                      {t("srEvaluationEdit.satisfaction")}
                    </Typography>
                    <Select
                      size="small"
                      value={editForm.satisfaction}
                      onChange={(e) =>
                        handleEditFormChange("satisfaction", e.target.value)
                      }
                      displayEmpty
                      sx={{ minWidth: 120, fontSize: "0.8rem" }}
                    >
                      <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
                        {t("srEvaluationEdit.selectPlaceholder")}
                      </MenuItem>
                      <MenuItem value="상" sx={{ fontSize: "0.8rem" }}>
                        {t("srEvaluationEdit.high")}
                      </MenuItem>
                      <MenuItem value="중" sx={{ fontSize: "0.8rem" }}>
                        {t("srEvaluationEdit.medium")}
                      </MenuItem>
                      <MenuItem value="하" sx={{ fontSize: "0.8rem" }}>
                        {t("srEvaluationEdit.low")}
                      </MenuItem>
                    </Select>
                  </Stack>

                  {/* Dates */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 80,
                      }}
                    >
                      {t("srEvaluationEdit.inspectionDateTime")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.inspectionDateTime}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        minWidth: 80,
                      }}
                    >
                      {t("srEvaluationEdit.processingDateTime")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.processingDate} {editForm.processingTime}
                    </Typography>
                  </Stack>

                  {/* Classifications */}
                  <Stack direction="row" spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 80,
                        }}
                      >
                        {t("srEvaluationEdit.changeClassification")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        {editForm.changeClassification}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 80,
                        }}
                      >
                        {t("srEvaluationEdit.changeType")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        {editForm.changeType}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 80,
                        }}
                      >
                        {t("srEvaluationEdit.srProcessingTime")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        {editForm.srProcessingTime}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: 80,
                        }}
                      >
                        {t("srEvaluationEdit.timeClassification")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        {editForm.timeUnit}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Processing Method */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.processingMethod")}
                    </Typography>
                    <Stack spacing={0.25}>
                      <Stack direction="row" spacing={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={processingMethods.dataModification}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "dataModification",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "0.75rem" }}>
                              {t("srEvaluationEdit.dataModification")}
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={processingMethods.programModification}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "programModification",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "0.75rem" }}>
                              {t("srEvaluationEdit.programModification")}
                            </Typography>
                          }
                        />
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={processingMethods.deployment}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "deployment",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "0.75rem" }}>
                              {t("srEvaluationEdit.deployment")}
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={processingMethods.infrastructureWork}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "infrastructureWork",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "0.75rem" }}>
                              {t("srEvaluationEdit.infrastructureWork")}
                            </Typography>
                          }
                        />
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Text Fields */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.processingDetails")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={editForm.processingDetails}
                      onChange={(e) =>
                        handleEditFormChange(
                          "processingDetails",
                          e.target.value,
                        )
                      }
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.verificationDetails")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={editForm.verificationDetails}
                      onChange={(e) =>
                        handleEditFormChange(
                          "verificationDetails",
                          e.target.value,
                        )
                      }
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.completionDetails")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={editForm.completionDetails}
                      onChange={(e) =>
                        handleEditFormChange(
                          "completionDetails",
                          e.target.value,
                        )
                      }
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.etc")}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      size="small"
                      value={editForm.etc}
                      onChange={(e) =>
                        handleEditFormChange("etc", e.target.value)
                      }
                      inputProps={{ style: { fontSize: "0.8rem" } }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srEvaluationEdit.processingAttachment")}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SearchIcon fontSize="small" />}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5 }}
                    ></Button>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </RequirePermission>
  );
}
