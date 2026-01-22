import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import relativeTime from "dayjs/plugin/relativeTime";
import changeLanguage from "@/src/helper/changeLanguage";

function TopNavbarIconMenuLanguage() {
  const { i18n } = useTranslation();
  dayjs.extend(relativeTime);

  const currentLang = i18n.resolvedLanguage;
  const nextLang = currentLang === "en" ? "kr" : "en";

  const handleToggle = () => {
    changeLanguage(nextLang);
  };

  return (
    <IconButton
      onClick={handleToggle}
      data-testid="languageButton"
      sx={{
        minWidth: 48,
        height: 36,
        color: "text.primary",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        px: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "primary.main",
          transform: "translateY(-1px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.5px",
        }}
      >
        {currentLang?.toUpperCase()}
      </Typography>
    </IconButton>
  );
}

export default TopNavbarIconMenuLanguage;
