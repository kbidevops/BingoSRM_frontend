"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export interface SRSearchFormData {
  srNumber: string;
  applicationMonth: string;
  requestType: string;
  changeType: string;
  requesterId: string;
  title: string;
  content: string;
}

interface SRSearchFormProps {
  onSearch?: (formData: SRSearchFormData) => void;
  onReset?: () => void;
}

export default function SRSearchForm({ onSearch, onReset }: SRSearchFormProps) {
  const { t } = useTranslation();
  const locale = useLocale();

  const [searchForm, setSearchForm] = useState<SRSearchFormData>({
    srNumber: "",
    applicationMonth: "",
    requestType: "전체",
    changeType: "전체",
    requesterId: "",
    title: "",
    content: "",
  });

  const handleSearchChange = (field: keyof SRSearchFormData, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    const resetData: SRSearchFormData = {
      srNumber: "",
      applicationMonth: "",
      requestType: "전체",
      changeType: "전체",
      requesterId: "",
      title: "",
      content: "",
    };
    setSearchForm(resetData);
    onReset?.();
  };

  const handleSearch = () => {
    onSearch?.(searchForm);
  };

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          mb: 3,
          fontSize: "0.95rem",
          color: "text.primary",
        }}
      >
        {t("srRequest.searchConditions")}
      </Typography>

      <Box sx={{ flex: 1, overflowY: "hidden", mb: 2 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.srNumber")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={searchForm.srNumber}
              onChange={(e) => handleSearchChange("srNumber", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.applicationMonth")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder={t("srRequest.placeholders.applicationMonth")}
              value={searchForm.applicationMonth}
              onChange={(e) =>
                handleSearchChange("applicationMonth", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.requestType")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={searchForm.requestType}
              onChange={(e) =>
                handleSearchChange("requestType", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            >
              <MenuItem value="전체">{t("srRequest.options.all")}</MenuItem>
              <MenuItem value="단순/사용법 문의">
                {t("srRequest.options.simpleInquiry")}
              </MenuItem>
              <MenuItem value="업무/작업 건도">
                {t("srRequest.options.workTask")}
              </MenuItem>
              <MenuItem value="정보/자료 요청">
                {t("srRequest.options.infoRequest")}
              </MenuItem>
              <MenuItem value="기능 불가">
                {t("srRequest.options.featureNotWorking")}
              </MenuItem>
              <MenuItem value="단순 오류/불량">
                {t("srRequest.options.simpleError")}
              </MenuItem>
              <MenuItem value="신규 개발">
                {t("srRequest.options.newDevelopment")}
              </MenuItem>
              <MenuItem value="기능 수정/개발">
                {t("srRequest.options.featureModification")}
              </MenuItem>
              <MenuItem value="UI/UX 변경">
                {t("srRequest.options.uiUxChange")}
              </MenuItem>
              <MenuItem value="서버 작업">
                {t("srRequest.options.serverWork")}
              </MenuItem>
              <MenuItem value="네트워크 작업">
                {t("srRequest.options.networkWork")}
              </MenuItem>
              <MenuItem value="보안 작업">
                {t("srRequest.options.securityWork")}
              </MenuItem>
              <MenuItem value="DB 작업">
                {t("srRequest.options.dbWork")}
              </MenuItem>
              <MenuItem value="백업/복구">
                {t("srRequest.options.backupRestore")}
              </MenuItem>
              <MenuItem value="구성정보 변경">
                {t("srRequest.options.configChange")}
              </MenuItem>
              <MenuItem value="구성정보 추가">
                {t("srRequest.options.configAdd")}
              </MenuItem>
              <MenuItem value="기타">{t("srRequest.options.other")}</MenuItem>
            </TextField>
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.changeType")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={searchForm.changeType}
              onChange={(e) => handleSearchChange("changeType", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            >
              <MenuItem value="전체">{t("srRequest.options.all")}</MenuItem>
              <MenuItem value="일반">{t("srRequest.options.normal")}</MenuItem>
              <MenuItem value="단순">{t("srRequest.options.simple")}</MenuItem>
              <MenuItem value="긴급">{t("srRequest.options.urgent")}</MenuItem>
            </TextField>
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.requesterId")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={searchForm.requesterId}
              onChange={(e) =>
                handleSearchChange("requesterId", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.title")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={searchForm.title}
              onChange={(e) => handleSearchChange("title", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem" }}
            >
              {t("srRequest.fields.content")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={searchForm.content}
              onChange={(e) => handleSearchChange("content", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  height: "32px",
                },
              }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          sx={{
            bgcolor: "grey.500",
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "grey.600",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {t("srRequest.buttons.reset")}
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {t("srRequest.buttons.search")}
        </Button>
      </Stack>
    </Paper>
  );
}
