import { IconButton, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useContext } from "react";
import { ColorContext } from "@/src/components/theme/theme";

function ThemeSwitchButton() {
  const theme = useTheme();
  const colorMode = useContext(ColorContext);

  return (
    <IconButton onClick={colorMode.toggleColorMode}>
      {theme.palette.mode === "light" ? (
        <DarkMode sx={{ color: "ffffff" }} />
      ) : (
        <LightMode color="warning" />
      )}
    </IconButton>
  );
}

export default ThemeSwitchButton;
