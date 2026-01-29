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
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RequirePermission from "@/src/components/RequirePermission";

export default function SRProcessEditPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useLocale();
  const [editForm, setEditForm] = useState({
    inspector: "관리자",
    processingPerson: "관리자",
    inspectionDateTime: "2026-01-08 13:54",
    processingDate: "2026-01-21",
    processingTime: "15:36",
    changeClassification: "일반",
    changeType: "보안 작업",
    srProcessingTime: "1",
    timeUnit: "시간",
    processingDetails: "",
    etc: "",
  });

  const [processingMethods, setProcessingMethods] = useState({
    dataModification: false,
    programModification: false,
    deployment: false,
    infrastructureWork: false,
  });

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setProcessingMethods((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSaveEdit = () => {
    console.log("저장:", editForm, processingMethods);
    // TODO: API call to save
    router.push("/sr/process");
  };

  const handleCancel = () => {
    router.push("/sr/process");
  };

  return (
    <RequirePermission nodeId="sr-process">
      <Stack
        sx={{
          height: "100vh",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* Top Bar with Title and Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 1.5,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("srProcessEdit.title")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleCancel} variant="outlined" size="small">
              {t("srProcessEdit.list")}
            </Button>
            <Button onClick={handleSaveEdit} variant="contained" size="small">
              {t("srProcessEdit.save")}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            p: 1.5,
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* SR 정보 Header */}
          <Paper sx={{ p: 1, mb: 1.5, flexShrink: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: "0.8rem" }}
              >
                {t("srProcessEdit.srInfo")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.8rem",
                }}
              >
                SR-2601-008
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, ml: 2, fontSize: "0.8rem" }}
              >
                {t("srProcessEdit.requestDateTime")}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                2026-01-08 13:50
              </Typography>
              <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {t("srProcessEdit.requestCategory")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "primary.main", fontSize: "0.8rem" }}
                >
                  {t("srProcessEdit.general")}
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, fontSize: "0.8rem" }}>
                  {t("srProcessEdit.requestType")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "primary.main", fontSize: "0.8rem" }}
                >
                  {t("srProcessEdit.application")}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Three Column Layout */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ flexGrow: 1, minHeight: 0 }}
          >
            {/* Column 1: 요청자 정보 */}
            <Paper
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                {t("srProcessEdit.requesterInfo")}
              </Typography>
              <Stack spacing={1}>
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
                    {t("srProcessEdit.name")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    관리자
                  </Typography>
                </Box>
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
                    {t("srProcessEdit.department")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    kt
                  </Typography>
                </Box>
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
                    {t("srProcessEdit.contact")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    010-1234-1234
                  </Typography>
                </Box>
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
                    {t("srProcessEdit.email")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    admin@ezbus.com
                  </Typography>
                </Box>
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
                    {t("srProcessEdit.referenceId")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    admin
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Column 2: 요청사항(상세기술) */}
            <Paper
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                {t("srProcessEdit.requestDetails")}
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
                    {t("srProcessEdit.requestTitle")}
                  </Typography>
                  <Typography
                    sx={{ color: "primary.main", fontSize: "0.8rem", mb: 0.5 }}
                  >
                    개발1
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="개발1"
                    size="small"
                    defaultValue="개발1"
                    InputProps={{ readOnly: true }}
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
                    {t("srProcessEdit.requestDetailContent")}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    InputProps={{ readOnly: true }}
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
                    {t("srProcessEdit.requestAttachment")}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Column 3: SR 처리 내용(상세기술) */}
            <Paper
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                {t("srProcessEdit.srProcessingContent")}
              </Typography>

              <Stack spacing={1}>
                {/* 접수자 and 처리담당 */}
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
                      {t("srProcessEdit.receiver")}
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
                      {t("srProcessEdit.processingPerson")}
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

                {/* 접수일시 */}
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
                    {t("srProcessEdit.inspectionDateTime")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {editForm.inspectionDateTime}
                  </Typography>
                </Stack>

                {/* 처리일시 */}
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
                    {t("srProcessEdit.processingDateTime")}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
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
                </Stack>

                {/* 변경분류, 변경유형 */}
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
                      {t("srProcessEdit.changeClassification")}
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
                      {t("srProcessEdit.changeType")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.changeType}
                    </Typography>
                  </Stack>
                </Stack>

                {/* SR 처리시간, 사간구분 */}
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
                      {t("srProcessEdit.srProcessingTime")}
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
                      {t("srProcessEdit.timeClassification")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editForm.timeUnit}
                    </Typography>
                  </Stack>
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
                    {t("srProcessEdit.processingMethod")}
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
                            {t("srProcessEdit.dataModification")}
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
                            {t("srProcessEdit.programModification")}
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
                            {t("srProcessEdit.deployment")}
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
                            {t("srProcessEdit.infrastructureWork")}
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
                    {t("srProcessEdit.processingDetails")}
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
                    {t("srProcessEdit.etc")}
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
                    {t("srProcessEdit.processingAttachment")}
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
