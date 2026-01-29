"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "@/src/app/useLocale";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import RequirePermission from "@/src/components/RequirePermission";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface MenuNode {
  id: string;
  name: string;
  parentName?: string;
  url?: string;
  sortOrder?: number;
  isVisible: boolean;
  children?: MenuNode[];
  isFolder?: boolean;
}

const initialMenuTree: MenuNode[] = [
  {
    id: "1",
    name: "BingoSRM",
    isVisible: true,
    isFolder: true,
    children: [
      {
        id: "1-1",
        name: "기준정보",
        isVisible: true,
        isFolder: true,
        children: [
          {
            id: "1-1-1",
            name: "사용자관리",
            isVisible: true,
            url: "/user-management",
          },
          {
            id: "1-1-2",
            name: "시스템담당자관리",
            isVisible: true,
            url: "/system-manager",
          },
          {
            id: "1-1-3",
            name: "프로그램관리",
            isVisible: true,
            url: "/program",
          },
          {
            id: "1-1-4",
            name: "프로그램접근관리",
            isVisible: true,
            url: "/program-auth",
          },
        ],
      },
      {
        id: "1-2",
        name: "회원정보",
        isVisible: true,
        isFolder: false,
      },
      {
        id: "1-3",
        name: "회원가입",
        isVisible: true,
        isFolder: true,
        children: [
          { id: "1-3-1", name: "회원가입", isVisible: true, url: "/signup" },
          {
            id: "1-3-2",
            name: "가입정보",
            isVisible: true,
            url: "/signup-info",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "SR관리",
    isVisible: true,
    isFolder: true,
    children: [
      { id: "2-1", name: "SR요청", isVisible: true, url: "/sr/request" },
      { id: "2-2", name: "SR접수", isVisible: true, url: "/sr/receive" },
      { id: "2-3", name: "SR처리", isVisible: true, url: "/sr/process" },
      { id: "2-4", name: "SR검증", isVisible: true, url: "/sr/verify" },
      { id: "2-5", name: "SR완료", isVisible: true, url: "/sr/complete" },
      { id: "2-6", name: "SR평가", isVisible: true, url: "/sr/evaluation" },
    ],
  },
];

interface TreeItemProps {
  node: MenuNode;
  level: number;
  onSelect: (node: MenuNode) => void;
  selectedId?: string;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  level,
  onSelect,
  selectedId,
  expandedNodes,
  onToggleExpand,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isExpanded = expandedNodes.has(node.id);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        onClick={() => onSelect(node)}
        sx={{
          cursor: "pointer",
          p: 1.5,
          pl: level * 2.5 + 1,
          bgcolor: isSelected ? "primary.main" : "transparent",
          borderRadius: 1.5,
          mb: 0.5,
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            bgcolor: isSelected ? "primary.dark" : "action.hover",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "3px",
              bgcolor: "primary.main",
              opacity: isSelected ? 0 : 1,
              borderRadius: "0 4px 4px 0",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            bgcolor: "primary.main",
            opacity: isSelected ? 1 : 0,
            borderRadius: "0 4px 4px 0",
            transition: "opacity 0.2s",
          },
        }}
      >
        {hasChildren ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            sx={{
              p: 0.5,
              mr: 0.5,
              transition: "transform 0.2s",
              color: isSelected ? "primary.contrastText" : "text.secondary",
            }}
          >
            {isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        ) : (
          <Box sx={{ width: 20, mr: 0.5 }} />
        )}

        {node.isFolder ? (
          isExpanded ? (
            <FolderOpenIcon
              sx={{
                fontSize: 20,
                mr: 1,
                color: isSelected
                  ? "primary.contrastText"
                  : hasChildren
                    ? "warning.main"
                    : "action.disabled",
              }}
            />
          ) : (
            <FolderIcon
              sx={{
                fontSize: 20,
                mr: 1,
                color: isSelected
                  ? "primary.contrastText"
                  : hasChildren
                    ? "warning.main"
                    : "action.disabled",
              }}
            />
          )
        ) : (
          <InsertDriveFileIcon
            sx={{
              fontSize: 20,
              mr: 1,
              color: isSelected ? "primary.contrastText" : "action.disabled",
            }}
          />
        )}

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.9rem",
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? "primary.contrastText" : "text.primary",
          }}
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
              onSelect={onSelect}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default function ProgramManagement() {
  const { t } = useTranslation();
  const locale = useLocale();

  const [menuTree] = useState<MenuNode[]>(initialMenuTree);
  const [selectedMenu, setSelectedMenu] = useState<MenuNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["1"]),
  );
  const [formData, setFormData] = useState({
    parentName: "",
    name: "",
    url: "",
    sortOrder: "",
    isVisible: "show",
  });

  const handleMenuSelect = (node: MenuNode) => {
    setSelectedMenu(node);
    setFormData({
      parentName: node.parentName || "",
      name: node.name,
      url: node.url || "",
      sortOrder: node.sortOrder?.toString() || "",
      isVisible: node.isVisible ? "show" : "hide",
    });
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving menu:", formData);
    // API call to save menu
  };

  const handleAdd = () => {
    console.log("Adding new menu");
    setSelectedMenu(null);
    setFormData({
      parentName: "",
      name: "",
      url: "",
      sortOrder: "",
      isVisible: "show",
    });
  };

  const handleDelete = () => {
    if (selectedMenu) {
      console.log("Deleting menu:", selectedMenu.id);
      // API call to delete menu
    }
  };

  return (
    <RequirePermission nodeId="program-mgmt">
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
            {" "}
            {t("programManagement.title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {t("programManagement.subtitle")}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          sx={{ flexGrow: 1, overflow: "hidden" }}
        >
          {/* Left Panel - Menu Tree */}
          <Box
            sx={{
              width: "35%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Search Section */}
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, minWidth: 80, fontSize: "0.95rem" }}
                >
                  {t("programManagement.menuList")}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SearchIcon />}
                  sx={{
                    minWidth: 80,
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
                  {t("programManagement.buttons.search")}
                </Button>
              </Stack>
            </Box>

            {/* Menu Tree */}
            <Paper
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 2.5,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: "divider",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              {menuTree.map((node) => (
                <TreeItem
                  key={node.id}
                  node={node}
                  level={0}
                  onSelect={handleMenuSelect}
                  selectedId={selectedMenu?.id}
                  expandedNodes={expandedNodes}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </Paper>
          </Box>

          {/* Right Panel - Menu Details */}
          <Box
            sx={{
              width: "65%",
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3.5,
                fontSize: "1.1rem",
                color: "text.primary",
              }}
            >
              {t("programManagement.menuDetails")}
            </Typography>

            <Stack
              spacing={3.5}
              sx={{ flexGrow: 1, overflow: "auto", minHeight: 0 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "text.primary",
                  }}
                >
                  • {t("programManagement.fields.parentMenu")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.parentName}
                  onChange={(e) =>
                    handleInputChange("parentName", e.target.value)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "text.primary",
                  }}
                >
                  • {t("programManagement.fields.menuName")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "text.primary",
                  }}
                >
                  • {t("programManagement.fields.menuUrl")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "text.primary",
                  }}
                >
                  • {t("programManagement.fields.sortOrder")}
                </Typography>
                <TextField
                  size="small"
                  sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.9rem",
                    },
                  }}
                  value={formData.sortOrder}
                  onChange={(e) =>
                    handleInputChange("sortOrder", e.target.value)
                  }
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "text.primary",
                  }}
                >
                  • {t("programManagement.fields.visibility")}
                </Typography>
                <RadioGroup
                  row
                  value={formData.isVisible}
                  onChange={(e) =>
                    handleInputChange("isVisible", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="show"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {t("programManagement.options.show")}
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="hide"
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {t("programManagement.options.hide")}
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={!selectedMenu}
                sx={{
                  bgcolor: "grey.500",
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "grey.600",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {t("programManagement.buttons.delete")}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{
                  bgcolor: "grey.700",
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "grey.800",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {t("programManagement.buttons.add")}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckIcon />}
                onClick={handleSave}
                sx={{
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
                {t("programManagement.buttons.save")}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </RequirePermission>
  );
}
