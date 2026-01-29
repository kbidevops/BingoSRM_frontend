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
  etc: string;
  verificationDetails: string;
}

export default function SRVerifyEditPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const locale = useLocale();

  const [editForm, setEditForm] = useState<EditFormState>({
    srNumber: "SR-2601-008",
    requestDateTime: "2026-01-08 13:50",
    requestCategory: "일반",
    requestType: "응용프로그램",
    requesterName: "관리자",
    department: "kt",
    contact: "010-1234-1234",
    email: "admin@ezbus.com",
    referenceId: "admin",
    requestTitle: "개발1",
    requestDetailContent: "",
    inspector: "관리자",
    processingPerson: "관리자",
    verificationPerson: "관리자",
    completionPerson: "관리자",
    inspectionDateTime: "2026-01-08 13:54",
    processingDate: "2026-01-21",
    processingTime: "15:36",
    changeClassification: "일반",
    changeType: "보안 작업",
    srProcessingTime: "1",
    timeUnit: "시간",
    processingDetails: "",
    etc: "",
    verificationDetails: "",
  });

  const [processingMethods, setProcessingMethods] = useState({
    dataModification: true,
    programModification: false,
    deployment: true,
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

  const handleList = () => {
    router.push("/sr/verify");
  };

  const handleSave = () => {
    console.log("Save:", editForm, processingMethods);
  };

  return (
    <RequirePermission nodeId="sr-verify">
      <Stack
        sx={{
          height: "100vh",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
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
              {t("srVerifyEdit.title")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleList}
                sx={{ fontSize: "0.8rem", px: 2 }}
              >
                {t("srVerifyEdit.list")}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSave}
                sx={{ fontSize: "0.8rem", px: 2 }}
              >
                {t("srVerifyEdit.save")}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* SR Info */}
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("srVerifyEdit.srInfo")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              {editForm.srNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("srVerifyEdit.requestDateTime")}
            </Typography>
            <Typography variant="body2">{editForm.requestDateTime}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("srVerifyEdit.requestCategory")}
            </Typography>
            <Typography variant="body2">{editForm.requestCategory}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("srVerifyEdit.requestType")}
            </Typography>
            <Typography variant="body2">{editForm.requestType}</Typography>
          </Stack>
        </Box>

        {/* Two Column Layout */}
        <Box sx={{ flexGrow: 1, overflow: "hidden", p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
            {/* Left Column: Requester Info + Request Details */}
            <Paper
              elevation={2}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                overflow: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "divider",
                  borderRadius: "3px",
                },
              }}
            >
              {/* Requester Info Section */}
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
                {t("srVerifyEdit.requesterInfo")}
              </Typography>

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.name")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.requesterName}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.department")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.department}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.contact")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.contact}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.email")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.email}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 80,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.referenceId")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.referenceId}
                  </Typography>
                </Stack>
              </Stack>

              {/* Request Details Section */}
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
                {t("srVerifyEdit.requestDetails")}
              </Typography>

              <Stack spacing={1}>
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
                    {t("srVerifyEdit.requestTitle")}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={editForm.requestTitle}
                    onChange={(e) =>
                      handleEditFormChange("requestTitle", e.target.value)
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
                    {t("srVerifyEdit.requestDetailContent")}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    size="small"
                    value={editForm.requestDetailContent}
                    onChange={(e) =>
                      handleEditFormChange(
                        "requestDetailContent",
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
                    {t("srVerifyEdit.requestAttachment")}
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

            {/* Right Column: SR Processing Content */}
            <Paper
              elevation={2}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                overflow: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "divider",
                  borderRadius: "3px",
                },
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
                {t("srVerifyEdit.srProcessingContent")}
              </Typography>

              <Stack spacing={1}>
                {/* 접수자 and 처리담당 */}
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.receiver")}
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
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.processingPerson")}
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
                  </Box>
                </Stack>

                {/* 검증담당 and 완료담당 */}
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.verificationPerson")}
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
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.completionPerson")}
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
                  </Box>
                </Stack>

                {/* 접수일시 */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.25,
                      fontWeight: 500,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("srVerifyEdit.inspectionDateTime")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.inspectionDateTime}
                  </Typography>
                </Box>

                {/* 처리일시 */}
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
                    {t("srVerifyEdit.processingDateTime")}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <TextField
                      size="small"
                      value={editForm.processingDate}
                      onChange={(e) =>
                        handleEditFormChange("processingDate", e.target.value)
                      }
                      sx={{ flex: 1 }}
                      inputProps={{
                        style: { fontSize: "0.8rem", padding: "6px 8px" },
                      }}
                    />
                    <TextField
                      size="small"
                      value={editForm.processingTime}
                      onChange={(e) =>
                        handleEditFormChange("processingTime", e.target.value)
                      }
                      sx={{ width: 80 }}
                      inputProps={{
                        style: { fontSize: "0.8rem", padding: "6px 8px" },
                      }}
                    />
                  </Stack>
                </Box>

                {/* 변경분류, 변경유형 */}
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.changeClassification")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.changeClassification}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.changeType")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.changeType}
                    </Typography>
                  </Box>
                </Stack>

                {/* SR 처리시간, 사간구분 */}
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.srProcessingTime")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.srProcessingTime}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.25,
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("srVerifyEdit.timeClassification")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.timeUnit}
                    </Typography>
                  </Box>
                </Stack>

                {/* 처리방법 */}
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
                    {t("srVerifyEdit.processingMethod")}
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
                            {t("srVerifyEdit.dataModification")}
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
                            {t("srVerifyEdit.programModification")}
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
                            {t("srVerifyEdit.deployment")}
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
                            {t("srVerifyEdit.infrastructureWork")}
                          </Typography>
                        }
                      />
                    </Stack>
                  </Stack>
                </Box>

                {/* 처리내역 */}
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
                    {t("srVerifyEdit.processingDetails")}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    value={editForm.processingDetails}
                    onChange={(e) =>
                      handleEditFormChange("processingDetails", e.target.value)
                    }
                    inputProps={{ style: { fontSize: "0.8rem" } }}
                  />
                </Box>

                {/* 검증내역 */}
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
                    {t("srVerifyEdit.verificationDetails")}
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

                {/* 기타 */}
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
                    {t("srVerifyEdit.etc")}
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

                {/* 중담창부파일 */}
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
                    {t("srVerifyEdit.processingAttachment")}
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
        </Box>
      </Stack>
    </RequirePermission>
  );
}
