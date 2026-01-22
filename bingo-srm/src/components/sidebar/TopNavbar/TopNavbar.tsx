"use client";
import { AppBar, Stack, Toolbar } from "@mui/material";
import TopNavbarIconMenu from "@/src/components/sidebar/TopNavbar/TopNavbarIconMenu";
import TopNavbarTextMenu from "@/src/components/sidebar/TopNavbar/TopNavbarTextMenu";

function TopNavBar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        border: "none",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: 2,
        }}
        component={Stack}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <TopNavbarTextMenu />
        <TopNavbarIconMenu />
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
