"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";

import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Button,
  Stack,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { fetchProgramAccessAll, updateProgramAccess } from "@/src/lib/auth";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Role {
  id: string;
  name: string;
  color: string;
}

interface MenuNode {
  id: string;
  name: string;
  isFolder?: boolean;
  children?: MenuNode[];
  checked?: boolean;
}

const roles: Role[] = [
  { id: "temp", name: "일시사용자", color: "#E0E0E0" },
  { id: "admin", name: "시스템관리자", color: "#E0E0E0" },
  { id: "manager", name: "시스템담당자", color: "#E0E0E0" },
  { id: "requester", name: "SR요청자", color: "#E0E0E0" },
];

const menuTree: MenuNode[] = [
  {
    id: "basic-info",
    name: "기준정보",
    isFolder: true,
    checked: false,
    children: [
      { id: "user-mgmt", name: "사용자관리", checked: false },
      { id: "system-mgr", name: "시스템담당자관리", checked: false },
      { id: "program-mgmt", name: "프로그램관리", checked: false },
      { id: "program-auth", name: "프로그램접근관리", checked: false },
    ],
  },
  {
    id: "sr",
    name: "SR관리",
    isFolder: true,
    checked: false,
    children: [
      { id: "sr-request", name: "SR요청", checked: false },
      { id: "sr-receive", name: "SR접수", checked: false },
      { id: "sr-process", name: "SR처리", checked: false },
      { id: "sr-verify", name: "SR검증", checked: false },
      { id: "sr-complete", name: "SR완료", checked: false },
      { id: "sr-eval", name: "SR평가", checked: false },
    ],
  },
];

// Map legacy backend URIs to new app routes
const legacyToNextRoute: Record<string, string> = {
  // User management and related
  "/user/mngr/retrievePagingList.do": "/user/user-management",
  "/syscharger/mngr/retrieveList.do": "/user/system-manager",
  "/progrm/mngr/retrieveTreeList.do": "/user/program",
  "/progrmaccesauthor/mngr/retrieveTreeList.do": "/user/program-auth",

  // SR (Service Request) management
  "/srvcrspons/site/retrieveSrReqList.do": "/sr/request",
  "/srvcrspons/site/retrieveSrRcvList.do": "/sr/receive",
  "/srvcrspons/mngr/retrieveSrProcList.do": "/sr/process",
  "/srvcrspons/mngr/retrieveSrVrList.do": "/sr/verify",
  "/srvcrspons/mngr/retrieveSrFnList.do": "/sr/complete",
  "/srvcrspons/mngr/retrieveSrEvList.do": "/sr/evaluation",
};

// Map next-route paths to our local tree node ids
const routeToNodeId: Record<string, string> = {
  "/user/user-management": "user-mgmt",
  "/user/system-manager": "system-mgr",
  "/user/program": "program-mgmt",
  "/user/program-auth": "program-auth",

  "/sr/request": "sr-request",
  "/sr/receive": "sr-receive",
  "/sr/process": "sr-process",
  "/sr/verify": "sr-verify",
  "/sr/complete": "sr-complete",
  "/sr/evaluation": "sr-eval",
};

interface TreeItemProps {
  node: MenuNode;
  level: number;
  checkedItems: Set<string>;
  onToggle: (id: string) => void;
  expandedItems: Set<string>;
  onExpand: (id: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  level,
  checkedItems,
  onToggle,
  expandedItems,
  onExpand,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedItems.has(node.id);
  const isChecked = checkedItems.has(node.id);

  const handleToggle = () => {
    onToggle(node.id);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(node.id);
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          pl: level * 3,
          py: 1,
          borderRadius: 1,
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {hasChildren ? (
          <IconButton
            size="small"
            onClick={handleExpand}
            sx={{ p: 0, mr: 0.5 }}
          >
            {isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        ) : (
          <Box sx={{ width: 28 }} />
        )}

        <Checkbox
          size="small"
          checked={isChecked}
          onChange={handleToggle}
          sx={{ p: 0, mr: 1 }}
        />

        {node.isFolder ? (
          isExpanded ? (
            <FolderOpenIcon
              sx={{
                fontSize: 20,
                mr: 1,
                color: hasChildren ? "warning.main" : "action.disabled",
              }}
            />
          ) : (
            <FolderIcon
              sx={{
                fontSize: 20,
                mr: 1,
                color: hasChildren ? "warning.main" : "action.disabled",
              }}
            />
          )
        ) : null}

        <Typography
          variant="body2"
          sx={{ fontSize: "0.9rem", fontWeight: isChecked ? 600 : 400 }}
        >
          {node.name}
        </Typography>
      </Stack>

      {hasChildren && (
        <Collapse in={isExpanded}>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              checkedItems={checkedItems}
              onToggle={onToggle}
              expandedItems={expandedItems}
              onExpand={onExpand}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default function ProgramAuth() {
  const { t } = useTranslation();
  const locale = useLocale();

  const [selectedRole, setSelectedRole] = useState<Role>(roles[1]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(["member-join", "signup", "signup-info"]),
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["itsm", "basic-info", "member-join"]),
  );
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleRoleSelect = (role: Role) => {
    // Prevent duplicate requests for the same role
    if (loadingRole === role.id) return;

    setSelectedRole(role);
    // Load permissions for this role
    loadProgramAccessForRole(role.id).catch((err) => {
      console.error("Failed to load program access for role", err);
      // fallback
      if (role.id === "admin") {
        setCheckedItems(new Set(["member-join", "signup", "signup-info"]));
      } else {
        setCheckedItems(new Set());
      }
    });
  };

  // Load all programs and derive assigned programs for a given role/authority code
  // Reuse the `program-access?authorCode=...` response and map entries to our tree.
  const loadProgramAccessForRole = async (authorCode: string) => {
    if (loadingRole === authorCode) return;
    setLoadingRole(authorCode);
    try {
      const all = await fetchProgramAccessAll(authorCode);

      // Debug: inspect fetched payload and basic counts
      const yCount = all.filter((p) => (p as any).menuIndictYn === "Y").length;
      const nCount = all.filter((p) => (p as any).menuIndictYn === "N").length;
      console.debug("[program-auth] loadProgramAccessForRole", {
        authorCode,
        total: all.length,
        menuIndictY: yCount,
        menuIndictN: nCount,
      });
      console.debug("[program-auth] sample rows", all.slice(0, 6));

      const assignedNodeIds = new Set<string>();
      const explicitUncheckIds = new Set<string>();

      const findNodeIdByName = (
        nodes: MenuNode[],
        name: string,
      ): string | null => {
        for (const node of nodes) {
          if (node.name === name) return node.id;
          if (node.children) {
            const found = findNodeIdByName(node.children, name);
            if (found) return found;
          }
        }
        return null;
      };

      // First filter backend list to only rows with a legacy URI mapping (remove unnecessary items)
      const relevant = all.filter((p) => {
        const uri = (p as any).progrmUri || (p as any).programUri;
        return legacyToNextRoute[uri];
      });

      console.debug(
        "[program-auth] relevant (has legacy mapping) count",
        relevant.length,
      );

      // Then apply strict URI-only mapping on the filtered set
      relevant.forEach((p) => {
        const uri = (p as any).progrmUri;
        console.debug("[program-auth] processing", uri);
        console.debug("p.menuIndictYn: ", p.menuIndictYn);
        if ((p as any).menuIndictYn === "Y") {
          const nodeId = routeToNodeId[legacyToNextRoute[uri]];
          if (nodeId) assignedNodeIds.add(nodeId);
        } else if ((p as any).menuIndictYn === "N") {
          const nodeId = routeToNodeId[legacyToNextRoute[uri]];
          if (nodeId) explicitUncheckIds.add(nodeId);
        }
      });

      console.debug(
        "[program-auth] mapped assigned (before uncheck)",
        Array.from(assignedNodeIds),
      );
      console.debug(
        "[program-auth] mapped explicit unchecks",
        Array.from(explicitUncheckIds),
      );

      // Final checked set = assigned - explicit unchecks
      explicitUncheckIds.forEach((id) => assignedNodeIds.delete(id));

      // Ensure parent folder nodes are also checked when a child is assigned.
      const getPathToNode = (targetId: string): string[] => {
        const path: string[] = [];
        const dfs = (nodes: MenuNode[], parents: string[]): boolean => {
          for (const n of nodes) {
            const next = [...parents, n.id];
            if (n.id === targetId) {
              path.push(...next);
              return true;
            }
            if (n.children) {
              if (dfs(n.children, next)) return true;
            }
          }
          return false;
        };
        dfs(menuTree, []);
        return path;
      };

      const assignedArray = Array.from(assignedNodeIds);
      const ancestorIds = new Set<string>();
      assignedArray.forEach((id) => {
        const path = getPathToNode(id);
        path.forEach((pid) => ancestorIds.add(pid));
      });

      // Merge ancestors into assigned set
      ancestorIds.forEach((id) => assignedNodeIds.add(id));

      // Expand ancestor folders so checked items are visible
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        ancestorIds.forEach((id) => newSet.add(id));
        return newSet;
      });

      // Update `checked` property on the tree nodes for clarity/use elsewhere
      const updateCheckedOnTree = (nodes: MenuNode[]) => {
        for (const n of nodes) {
          n.checked = assignedNodeIds.has(n.id);
          if (n.children) updateCheckedOnTree(n.children);
        }
      };
      updateCheckedOnTree(menuTree);

      setCheckedItems(assignedNodeIds);
    } finally {
      setLoadingRole(null);
    }
  };

  // Helper function to get all descendant IDs
  const getAllDescendantIds = (node: MenuNode): string[] => {
    const ids: string[] = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(...getAllDescendantIds(child));
      });
    }
    return ids;
  };

  // Helper function to find node by ID in tree
  const findNodeById = (nodes: MenuNode[], id: string): MenuNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleToggle = (id: string) => {
    const node = findNodeById(menuTree, id);
    if (!node) return;

    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      const allIds = getAllDescendantIds(node);

      if (newSet.has(id)) {
        // Uncheck this node and all descendants
        allIds.forEach((itemId) => newSet.delete(itemId));
      } else {
        // Check this node and all descendants
        allIds.forEach((itemId) => newSet.add(itemId));
      }

      // Keep `menuTree` nodes' checked property in sync for UI clarity
      allIds.forEach((itemId) => {
        const n = findNodeById(menuTree, itemId);
        if (n) n.checked = newSet.has(itemId);
      });
      return newSet;
    });
  };

  const handleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    const assigned = Array.from(checkedItems);
    console.log("Saving permissions for", selectedRole.name, assigned);
    // call PUT /api/v1/program-access/{authorCode}
    updateProgramAccess(selectedRole.id, assigned)
      .then((res) => {
        console.log("Update result", res);
        // Optionally show success snackbar
      })
      .catch((err) => {
        console.error("Failed to update program access", err);
      });
  };

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        p: 3,
        overflow: "hidden",
      }}
    >
      {/* Page Title */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          {t("programAccess.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {t("programAccess.subtitle")}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={3}
        sx={{ flexGrow: 1, overflow: "hidden" }}
      >
        {/* Left Panel - Role Cards */}
        <Box sx={{ width: "40%", display: "flex", flexDirection: "column" }}>
          {/* Section Title */}
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2.5,
              borderRadius: 2.5,
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "0.95rem" }}
            >
              {t("programAccess.userRoles")}
            </Typography>
          </Box>

          {/* Role Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            {roles.map((role) => (
              <Card
                key={role.id}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    selectedRole.id === role.id ? "primary.main" : role.color,
                  border: "2px solid",
                  borderColor:
                    selectedRole.id === role.id ? "primary.main" : "divider",
                  borderRadius: 2.5,
                  transition: "all 0.2s ease",
                  boxShadow:
                    selectedRole.id === role.id
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  },
                  minHeight: 160,
                }}
                onClick={() => handleRoleSelect(role)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mb: 2,
                      color:
                        selectedRole.id === role.id
                          ? "white"
                          : "text.secondary",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48 }} />
                    <SettingsIcon
                      sx={{
                        fontSize: 32,
                        position: "absolute",
                        bottom: -8,
                        right: -8,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: selectedRole.id === role.id ? "white" : "#1a1a1a",
                    }}
                  >
                    {role.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Menu Permissions */}
        <Box
          sx={{
            width: "60%",
            bgcolor: "background.paper",
            borderRadius: 2.5,
            p: 3.5,
            display: "flex",
            flexDirection: "column",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3.5 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
            >
              <Box component="span" sx={{ color: "primary.main" }}>
                {selectedRole.name}
              </Box>{" "}
              {t("programAccess.accessControl")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              sx={{
                minWidth: 100,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                px: 2.5,
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              {t("programAccess.buttons.save")}
            </Button>
          </Stack>

          {/* Menu Tree with Checkboxes */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
              bgcolor: "background.default",
            }}
          >
            {menuTree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                checkedItems={checkedItems}
                onToggle={handleToggle}
                expandedItems={expandedItems}
                onExpand={handleExpand}
              />
            ))}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
