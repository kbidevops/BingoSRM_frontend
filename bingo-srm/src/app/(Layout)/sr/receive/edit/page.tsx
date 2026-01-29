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
} from "@mui/material";
import RequirePermission from "@/src/components/RequirePermission";

export default function SRReceiveEditPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useLocale();

  const [editForm, setEditForm] = useState({
    receiver: "",
    changeClassification: "신청내역4",
    applicationMonth: "2026-01-21",
    receptionClassification: "신청내역4",
    requestClassification: "신청내역4",
    progress: "",
    title: "",
    requestDetails: "",
    softwareVersion: "",
  });
  const [requestCategory, setRequestCategory] = useState("");
  const [requestType, setRequestType] = useState("응용프로그램");

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    console.log("저장:", editForm);
    // TODO: API call to save
    router.push("/sr/receive");
  };

  const handleCancel = () => {
    router.push("/sr/receive");
  };

  return (
    <RequirePermission nodeId="sr-receive">
      <Stack
        sx={{
          bgcolor: "background.default",
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
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("srReceiveEdit.title")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleCancel} variant="outlined">
              {t("srReceiveEdit.list")}
            </Button>
            <Button onClick={handleSaveEdit} variant="contained">
              {t("srReceiveEdit.save")}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ p: 2 }}>
          {/* SR 정보 Header */}
          <Paper
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 1.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t("srReceiveEdit.srInfo")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                SR-2601-010
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
                {t("srReceiveEdit.requestDate")}
              </Typography>
              <Typography variant="body2">2026-01-15 13:11</Typography>
              <Button
                variant="text"
                size="small"
                sx={{ ml: "auto", color: "text.primary" }}
              >
                {t("srReceiveEdit.requestCategory")}
              </Button>
              <TextField
                select
                size="small"
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                sx={{ minWidth: 120 }}
                SelectProps={{ native: true }}
              >
                <option value="">{t("srReceiveEdit.selectPlaceholder")}</option>
                <option value="일반">{t("srReceiveEdit.general")}</option>
                <option value="단순">{t("srReceiveEdit.simple")}</option>
                <option value="긴급">{t("srReceiveEdit.urgent")}</option>
              </TextField>
              <Button
                variant="text"
                size="small"
                sx={{ color: "text.primary" }}
              >
                {t("srReceiveEdit.requestType")}
              </Button>
              <TextField
                select
                size="small"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                sx={{ minWidth: 120 }}
                SelectProps={{ native: true }}
              >
                <option value="">{t("srReceiveEdit.selectPlaceholder")}</option>
                <option value="응용프로그램">
                  {t("srReceiveEdit.application")}
                </option>
                <option value="인프라">
                  {t("srReceiveEdit.infrastructure")}
                </option>
              </TextField>
            </Stack>
          </Paper>

          {/* Three Column Layout */}
          <Stack direction="row" spacing={2}>
            {/* Column 1: 요청자 정보 */}
            <Paper
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: 2,
                  borderColor: "primary.main",
                }}
              >
                {t("srReceiveEdit.requesterInfo")}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.name")}
                  </Typography>
                  <Typography variant="body2">관리자</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.department")}
                  </Typography>
                  <Typography variant="body2">kt</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.contact")}
                  </Typography>
                  <Typography variant="body2">010-1234-1234</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.email")}
                  </Typography>
                  <Typography variant="body2">admin@ezbus.com</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.referenceId")}
                  </Typography>
                  <Typography variant="body2">admin</Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Column 2: 요청사항(상세기술) */}
            <Paper
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: 2,
                  borderColor: "primary.main",
                }}
              >
                {t("srReceiveEdit.requestDetails")}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.requestTitle")}
                  </Typography>
                  <Typography
                    sx={{ color: "error.main", fontSize: "0.875rem", mb: 1 }}
                  >
                    신규 개발(admin)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="신규 개발(admin)"
                    size="small"
                    value={editForm.requestDetails}
                    onChange={(e) =>
                      handleEditFormChange("requestDetails", e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.requestDetailContent")}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    value={editForm.softwareVersion}
                    onChange={(e) =>
                      handleEditFormChange("softwareVersion", e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.requestAttachment")}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Column 3: SR 접수 */}
            <Paper
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: 2,
                  borderColor: "primary.main",
                }}
              >
                {t("srReceiveEdit.srReception")}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.receiver")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "primary.main", cursor: "pointer" }}
                  >
                    관리자
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.receptionDate")}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      value="2026-01-21"
                      sx={{ flex: 1 }}
                    />
                    <TextField size="small" value="14:47" sx={{ width: 100 }} />
                  </Stack>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.changeClassification")}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={editForm.changeClassification}
                    onChange={(e) =>
                      handleEditFormChange(
                        "changeClassification",
                        e.target.value,
                      )
                    }
                    SelectProps={{ native: true }}
                  >
                    <option value="">
                      {t("srReceiveEdit.selectPlaceholder")}
                    </option>
                    <option value="긴급">{t("srReceiveEdit.urgent")}</option>
                    <option value="일반">{t("srReceiveEdit.general")}</option>
                  </TextField>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.changeType")}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={editForm.receptionClassification}
                    onChange={(e) =>
                      handleEditFormChange(
                        "receptionClassification",
                        e.target.value,
                      )
                    }
                    SelectProps={{ native: true }}
                  >
                    <option value="">
                      {t("srReceiveEdit.selectPlaceholder")}
                    </option>
                    <option value="담스/서용당 분리">담스/서용당 분리</option>
                    <option value="업무/작업 검토">업무/작업 검토</option>
                    <option value="정보/자료 요청">정보/자료 요청</option>
                    <option value="기능 통가">기능 통가</option>
                    <option value="단순 오류/결함">단순 오류/결함</option>
                    <option value="신규 개발">신규 개발</option>
                    <option value="기능 수정/개발">기능 수정/개발</option>
                    <option value="UI/UX 변경">UI/UX 변경</option>
                    <option value="서버 작업">서버 작업</option>
                    <option value="네트워크 작업">네트워크 작업</option>
                    <option value="보안 작업">보안 작업</option>
                    <option value="DB 작업">DB 작업</option>
                    <option value="백업/복구">백업/복구</option>
                    <option value="구성정보 변경">구성정보 변경</option>
                    <option value="구성정보 추가">구성정보 추가</option>
                    <option value="기타">기타</option>
                  </TextField>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.srProcessingTime")}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={editForm.progress}
                    onChange={(e) =>
                      handleEditFormChange("progress", e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    {t("srReceiveEdit.timeClassification")}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={editForm.requestClassification}
                    onChange={(e) =>
                      handleEditFormChange(
                        "requestClassification",
                        e.target.value,
                      )
                    }
                    SelectProps={{ native: true }}
                  >
                    <option value="">
                      {t("srReceiveEdit.selectPlaceholder")}
                    </option>
                    <option value="시간">{t("srReceiveEdit.hours")}</option>
                    <option value="일">{t("srReceiveEdit.days")}</option>
                    <option value="주">{t("srReceiveEdit.weeks")}</option>
                    <option value="개월">{t("srReceiveEdit.months")}</option>
                  </TextField>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Stack>
    </RequirePermission>
  );
}
