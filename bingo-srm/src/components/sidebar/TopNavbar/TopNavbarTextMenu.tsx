"use client";

import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { INavbarMenu } from "@/src/interface/navbar/AppInterface";
import usePermissions from "@/src/hooks/usePermissions";
import { routeToNodeId } from "@/src/lib/permissions";
import { useLeftNavbarStore } from "@/src/store/navbar/leftNavbarStore";
import { useTopNavbarStore } from "@/src/store/navbar/topNavbarStore";

function TopNavbarTextMenu() {
  const theme = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();

  const isDrawerOpen = useLeftNavbarStore((s) => s.isDrawerOpen);
  const toggleDrawer = useLeftNavbarStore((s) => s.toggleDrawer);
  const appGroups = useTopNavbarStore((s) => s.appGroups);

  const currentAppName = pathname.split("/")[1];

  const getCurrentApp = () => {
    for (const group of appGroups) {
      const found = group.apps.find((app) => app.to === currentAppName);
      if (found) return found;
    }
    return undefined;
  };

  const currentApp = getCurrentApp();

  const { allowedNodeIds } = usePermissions();

  const visibleMenus = currentApp
    ? currentApp.menus.filter((menu: INavbarMenu) => {
        const href = `/${currentApp.to}/${menu.to}`;
        const nodeId = routeToNodeId[href];
        if (nodeId && !allowedNodeIds.has(nodeId)) return false;
        return true;
      })
    : [];

  return (
    <Stack direction="row" alignItems="center" sx={{ ml: -1 }}>
      {/* Drawer Toggle */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          mr: 1.5,
          color: "text.secondary",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {isDrawerOpen ? (
          <KeyboardDoubleArrowLeft fontSize="small" />
        ) : (
          <KeyboardDoubleArrowRight fontSize="small" />
        )}
      </IconButton>

      {/* App Title */}
      {visibleMenus.length > 0 && (
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.primary"
          sx={{
            letterSpacing: "-0.01em",
            mr: 3,
          }}
        >
          {t(`navigation.${currentApp?.id}`).toUpperCase()}
        </Typography>
      )}

      {/* Menu List */}
      <List component={Stack} direction="row" sx={{ p: 0, gap: 0.5 }}>
        {visibleMenus.map((menu: INavbarMenu) => {
          const isActive = pathname === `/${currentApp?.to}/${menu.to}`;

          return (
            <Link
              key={menu.id}
              href={`/${currentApp?.to}/${menu.to}`}
              data-testid={menu.to}
              style={{
                textDecoration: "none",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    borderRadius: "6px",
                    borderBottom: "3px solid",
                    borderColor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "primary.main" : "text.primary",
                    fontWeight: isActive ? 500 : 400,
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: isActive ? "primary.main" : "text.primary",
                    },
                  }}
                >
                  <ListItemText
                    primary={t(`navigation.${menu.id}`)}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Stack>
  );
}

export default TopNavbarTextMenu;
