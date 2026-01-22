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
}

const roles: Role[] = [
  { id: "temp", name: "일시사용자", color: "#E0E0E0" },
  { id: "admin", name: "시스템관리자", color: "#E0E0E0" },
  { id: "manager", name: "시스템담당자", color: "#E0E0E0" },
  { id: "requester", name: "SR요청자", color: "#E0E0E0" },
];

const menuTree: MenuNode[] = [
  {
    id: "itsm",
    name: "BingoSRM",
    isFolder: true,
    children: [
      {
        id: "basic-info",
        name: "기준정보",
        isFolder: true,
        children: [
          { id: "user-mgmt", name: "사용자관리" },
          { id: "system-mgr", name: "시스템담당자관리" },
          { id: "program-mgmt", name: "프로그램관리" },
          { id: "program-auth", name: "프로그램접근관리" },
        ],
      },
      { id: "member-info", name: "회원정보" },
      {
        id: "member-join",
        name: "회원가입",
        isFolder: true,
        children: [
          { id: "signup", name: "회원가입" },
          { id: "signup-info", name: "가입정보" },
        ],
      },
    ],
  },
  {
    id: "sr",
    name: "SR관리",
    isFolder: true,
    children: [
      { id: "sr-request", name: "SR요청" },
      { id: "sr-receive", name: "SR접수" },
      { id: "sr-process", name: "SR처리" },
      { id: "sr-verify", name: "SR검증" },
      { id: "sr-complete", name: "SR완료" },
      { id: "sr-eval", name: "SR평가" },
    ],
  },
];

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

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    // Load permissions for this role
    if (role.id === "admin") {
      setCheckedItems(new Set(["member-join", "signup", "signup-info"]));
    } else {
      setCheckedItems(new Set());
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
    console.log(
      "Saving permissions for",
      selectedRole.name,
      Array.from(checkedItems),
    );
    // API call to save permissions
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
