"use client";

import {
  CSSObject,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme,
  Typography,
} from "@mui/material";
import LeftNavbarAppGroup from "./LeftNavbarAppGroup";
import BingoPng from "@/public/BingoSRM.png";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/src/lib/auth";
import { NavbarIcon } from "@/src/components/common/pure/Icons";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Image from "next/image";
import { useLeftNavbarStore } from "@/src/store/navbar/leftNavbarStore";

function LeftNavBar() {
  const { appGroups, isDrawerOpen, drawerWidth, setMenuOpen } =
    useLeftNavbarStore();

  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!pathname) return;
    const appId = pathname.split("/").filter(Boolean)[0];
    if (appId) setMenuOpen({ id: appId });
  }, [pathname, setMenuOpen]);

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    border: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    width: `calc(${theme.spacing(7)} + 1px)`,
    border: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  });

  const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const handleLogoClick = () => {};

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.warn("LeftNavbar: logout failed", e);
    }
    // Use replace so back button doesn't return to protected pages
    router.replace("/login");
  };

  return (
    <StyledDrawer variant="permanent" open={isDrawerOpen}>
      <Stack
        justifyContent="space-between"
        height="100vh"
        sx={{
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Stack sx={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
          <Stack
            direction="row"
            p={2}
            pl={2.5}
            spacing={2}
            onClick={handleLogoClick}
            sx={{
              cursor: "pointer",
              borderBottom: "1px solid",
              borderColor: "divider",
              mb: 1,
              minHeight: 56,
            }}
          >
            <Image
              src={BingoPng}
              alt="Bingo Logo"
              width={28}
              height={28}
              priority
              style={{ display: "block" }}
            />
            {isDrawerOpen && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  letterSpacing: "-0.02em",
                }}
              >
                BingoSRM
              </Typography>
            )}
          </Stack>

          {appGroups.map((group) => (
            <LeftNavbarAppGroup key={group.appGroupName} appGroup={group} />
          ))}
        </Stack>

        <List
          sx={{
            p: 0,
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 2,
                minHeight: 48,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {NavbarIcon("logout")}
              </ListItemIcon>
              {isDrawerOpen && (
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {t("navigation.logout")}
                    </Typography>
                  }
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </StyledDrawer>
  );
}

export default LeftNavBar;
