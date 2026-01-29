"use client";

import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse,
  Box,
  Tooltip,
} from "@mui/material";
import { Toc } from "@mui/icons-material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import usePermissions from "@/src/hooks/usePermissions";
import { routeToNodeId } from "@/src/lib/permissions";

import {
  INavbarApp,
  INavbarAppGroup,
} from "@/src/interface/navbar/AppInterface";
import { NavbarIcon } from "@/src/components/common/pure/Icons";
import { useLeftNavbarStore } from "@/src/store/navbar/leftNavbarStore";

function LeftNavbarAppGroup({ appGroup }: { appGroup: INavbarAppGroup }) {
  const { isDrawerOpen, menuOpen, setMenuOpen, toggleMenu } =
    useLeftNavbarStore();
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef<{ [key: string]: number }>({});

  const { allowedNodeIds } = usePermissions();

  // Compute visible menus per app according to permissions
  const appsWithVisible = appGroup.apps
    .map((app) => {
      if (!app.menus || app.menus.length === 0) {
        return { ...app, visibleMenus: undefined, isVisible: true };
      }

      const visibleMenus = app.menus.filter((subApp) => {
        const href = `/${app.to}` + (subApp.to !== "." ? `/${subApp.to}` : "");
        const nodeId = routeToNodeId[href];
        if (nodeId && !allowedNodeIds.has(nodeId)) return false;
        return true;
      });

      return { ...app, visibleMenus, isVisible: visibleMenus.length > 0 };
    })
    .filter((a) => a.isVisible);

  // If no apps remain visible in this group, hide the group entirely
  if (appsWithVisible.length === 0) return null;

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();

    // Track clicks for double-click detection
    if (!clickCountRef.current[id]) {
      clickCountRef.current[id] = 0;
    }
    clickCountRef.current[id]++;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // If double-click detected
    if (clickCountRef.current[id] === 2) {
      clickCountRef.current[id] = 0;
      // Toggle the menu open/close
      toggleMenu(id);
      return;
    }

    // Single click - set a timer
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current[id] = 0;

      // Single click behavior - toggle menu and navigate if opening
      if (!menuOpen[id]) {
        // If menu is closed, navigate to first item
        const firstSubMenu = appGroup.apps.find((app) => app.id === id)
          ?.menus?.[0];
        if (firstSubMenu) {
          const target = `/${appGroup.apps.find((app) => app.id === id)?.to}${firstSubMenu.to !== "." ? `/${firstSubMenu.to}` : ""}`;
          router.push(target);
        }
      }

      // Toggle the menu
      toggleMenu(id);
    }, 250); // 250ms window for double-click detection
  };

  return (
    <>
      {isDrawerOpen ? (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{
            ml: 2.5,
            mt: 2,
            mb: 1,
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            opacity: 0.7,
          }}
        >
          {t(`navigation.${appGroup.appGroupId}`)}
        </Typography>
      ) : (
        <Divider
          sx={{
            borderColor: "divider",
            my: 2,
            mx: 1.5,
          }}
        />
      )}

      <List sx={{ p: 0, px: 1 }}>
        {appsWithVisible.map((app) => {
          return (
            <Box key={app.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(e) => handleClick(app.id, e)}
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: "8px",
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {NavbarIcon(app.id)}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Tooltip
                        title={t(`navigation.${app.id}`)}
                        placement="right"
                        disableHoverListener={isDrawerOpen}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          color="text.primary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t(`navigation.${app.id}`)}
                        </Typography>
                      </Tooltip>
                    }
                  />
                </ListItemButton>
              </ListItem>

              {app.visibleMenus && (
                <Collapse in={menuOpen[app.id]} timeout="auto">
                  <List dense sx={{ pl: 0.5 }}>
                    {app.visibleMenus.map((subApp) => {
                      const href =
                        `/${app.to}` +
                        (subApp.to !== "." ? `/${subApp.to}` : "");
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={subApp.id}
                          href={href}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItem disablePadding>
                            <Tooltip
                              title={t(`navigation.${subApp.id}`)}
                              placement="right"
                              disableHoverListener={isDrawerOpen}
                            >
                              <ListItemButton
                                selected={isActive}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  mb: 0.5,
                                  borderRadius: "6px",
                                  color: isActive
                                    ? "primary.main"
                                    : "text.secondary",
                                  bgcolor: isActive
                                    ? "action.selected"
                                    : "transparent",
                                  fontWeight: isActive ? 600 : 400,
                                  "&.Mui-selected": {
                                    bgcolor: "action.selected",
                                    borderLeft: "3px solid",
                                    borderColor: "primary.main",
                                  },
                                  "&:hover": {
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                <Box display="flex" alignItems="center" ml={1}>
                                  <Toc
                                    sx={{ fontSize: 14, mr: 1.5, opacity: 0.7 }}
                                  />
                                  {isDrawerOpen && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: isActive ? 500 : 400,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {t(`navigation.${subApp.id}`)}
                                    </Typography>
                                  )}
                                </Box>
                              </ListItemButton>
                            </Tooltip>
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </>
  );
}

export default LeftNavbarAppGroup;
