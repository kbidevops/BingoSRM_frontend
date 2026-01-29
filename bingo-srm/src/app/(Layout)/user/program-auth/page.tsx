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
import { useRouter } from "next/navigation";
import {
  fetchProgramAccessAll,
  updateProgramAccess,
  fetchCodeTypes,
  fetchProgramAccessAssigned,
} from "@/src/lib/auth";
import usePermissions from "@/src/hooks/usePermissions";
import { menuTree, legacyToNextRoute, routeToNodeId, normalizeUri, MenuNode } from "@/src/lib/permissions";
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

// Roles will be loaded from server: GET /api/v1/code-types/R0/codes

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

  const [roles, setRoles] = React.useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [nodeToProgrmSn, setNodeToProgrmSn] = React.useState<
    Record<string, string>
  >({});
  const [nameToProgrmSn, setNameToProgrmSn] = React.useState<
    Record<string, string>
  >({});
  const [assignedProgrmSns, setAssignedProgrmSns] = React.useState<Set<string>>(
    new Set(),
  );
  const [explicitUncheckProgrmSns, setExplicitUncheckProgrmSns] =
    React.useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["itsm", "basic-info", "member-join"]),
  );
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const router = useRouter();
  const { allowedNodeIds, loading: permissionsLoading } = usePermissions();

  // Protect this page: if permissions have loaded and user lacks program-auth, redirect
  React.useEffect(() => {
    if (!permissionsLoading) {
      if (!allowedNodeIds.has("program-auth")) {
        // redirect to home or first allowed page
        router.replace("/");
      }
    }
  }, [permissionsLoading, allowedNodeIds, router]);

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
      const all = await fetchProgramAccessAssigned(authorCode);

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

      // attempt to fetch the full program list (may include progrmSn fields)
      let fullList: any[] = [];
      try {
        fullList = await fetchProgramAccessAll(authorCode);
      } catch (err) {
        console.debug(
          "[program-auth] fetchProgramAccessAll failed, skipping fullList",
          err,
        );
      }

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

      // Build mapping using multiple strategies: URI candidates, name match, and fullList fallback
      const mapping: Record<string, string> = {};
      const nameMap: Record<string, string> = {};

      const normalize = (u: any) => {
        if (!u || typeof u !== "string") return "";
        const idx = u.indexOf("?");
        return (idx >= 0 ? u.slice(0, idx) : u).trim();
      };

      // iterate over assigned rows and try to resolve UI node id and progrmSn
      const assignedProgrmSnsLocal = new Set<string>();
      const explicitUncheckProgrmSnsLocal = new Set<string>();
      all.forEach((p) => {
        const candidates = [
          (p as any).progrmUri,
          (p as any).programUri,
          (p as any).progrmUrl,
          (p as any).programUrl,
          (p as any).progrmPath,
          (p as any).menuUrl,
          (p as any).uri,
        ].map(normalize);

        let nodeId: string | null = null;
        for (const c of candidates) {
          if (!c) continue;
          const nextRoute = legacyToNextRoute[c];
          if (nextRoute) {
            const nid = routeToNodeId[nextRoute];
            if (nid) {
              nodeId = nid;
              break;
            }
          }
        }

        // fallback: try to match by program/menu name
        if (!nodeId) {
          const nameCandidate =
            (p as any).programNm ||
            (p as any).progrmNm ||
            (p as any).programName ||
            "";
          if (nameCandidate) {
            const byName = findNodeIdByName(
              menuTree,
              String(nameCandidate).trim(),
            );
            if (byName) nodeId = byName;
          }
        }

        // try to use fullList to derive nodeId or progrmSn when missing
        if (!nodeId && Array.isArray(fullList) && fullList.length > 0) {
          for (const q of fullList) {
            const qCandidates = [
              (q as any).progrmUri,
              (q as any).programUri,
              (q as any).progrmUrl,
              (q as any).programUrl,
            ].map(normalize);
            let matched = false;
            for (const qc of qCandidates) {
              if (!qc) continue;
              if (candidates.includes(qc)) {
                const nextRoute = legacyToNextRoute[qc];
                if (nextRoute) {
                  const nid = routeToNodeId[nextRoute];
                  if (nid) {
                    nodeId = nid;
                    matched = true;
                    break;
                  }
                }
              }
            }
            if (matched) break;
            // try name match on full list
            const qName =
              (q as any).programNm ||
              (q as any).programName ||
              (q as any).progrmNm;
            if (qName) {
              const byName = findNodeIdByName(menuTree, String(qName).trim());
              if (byName) {
                nodeId = byName;
                break;
              }
            }
          }
        }

        if (!nodeId) return; // cannot map this assigned row to a UI node

        // determine progrmSn via several possible fields
        let progrmSn =
          (p as any).progrmSn ??
          (p as any).progrmId ??
          (p as any).progrmSno ??
          null;

        // if missing, try to find in fullList by name or uri
        if (
          (progrmSn == null || progrmSn === "") &&
          Array.isArray(fullList) &&
          fullList.length > 0
        ) {
          const nameCandidate =
            (p as any).programNm ||
            (p as any).progrmNm ||
            (p as any).programName ||
            "";
          const match = fullList.find((q) => {
            const qName = String(
              (q as any).programNm || (q as any).progrmNm || "",
            ).trim();
            if (
              qName &&
              nameCandidate &&
              qName === String(nameCandidate).trim()
            )
              return true;
            const qcands = [
              (q as any).progrmUri,
              (q as any).programUri,
              (q as any).progrmUrl,
              (q as any).programUrl,
            ].map(normalize);
            const firstCandidate = candidates.find(Boolean);
            if (firstCandidate && qcands.includes(firstCandidate)) return true;
            return false;
          });
          if (match) {
            progrmSn =
              (match as any).progrmSn ??
              (match as any).progrmId ??
              (match as any).progrmSno ??
              null;
          }
        }

        if (progrmSn != null) {
          mapping[nodeId] = String(progrmSn);
          const matchedNode = findNodeById(menuTree, nodeId);
          if (matchedNode) nameMap[matchedNode.name] = String(progrmSn);
          if ((p as any).menuIndictYn === "Y")
            assignedProgrmSnsLocal.add(String(progrmSn));
          else if ((p as any).menuIndictYn === "N")
            explicitUncheckProgrmSnsLocal.add(String(progrmSn));
        }

        if ((p as any).menuIndictYn === "Y") assignedNodeIds.add(nodeId);
        else if ((p as any).menuIndictYn === "N")
          explicitUncheckIds.add(nodeId);
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

      // remove any progrmSns that were explicitly unchecked
      explicitUncheckProgrmSnsLocal.forEach((sn) =>
        assignedProgrmSnsLocal.delete(sn),
      );

      // persist sets into state for later use/debugging
      setAssignedProgrmSns(assignedProgrmSnsLocal);
      setExplicitUncheckProgrmSns(explicitUncheckProgrmSnsLocal);

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
      setNodeToProgrmSn(mapping);
      setNameToProgrmSn(nameMap);
    } finally {
      setLoadingRole(null);
    }
  };

  // Load roles (user types) from code types API on mount
  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const codes = await fetchCodeTypes("R0");
        if (!mounted) return;
        // Filter out roles we don't want to display (기관담당자, 상담센터)
        const filtered = codes.filter((c) => {
          const name = (
            (c.cmmnCodeNm as string) ||
            (c.cmmnCodeDc as string) ||
            ""
          ).trim();
          return name !== "기관담당자" && name !== "상담센터";
        });
        const mapped: Role[] = filtered.map((c) => ({
          id: (c.cmmnCode as string) || "",
          name: (c.cmmnCodeNm as string) || (c.cmmnCodeDc as string) || "",
          color: "#E0E0E0",
        }));
        setRoles(mapped);
        if (mapped.length > 0) {
          setSelectedRole(mapped[0]);
          // load program access for default role
          try {
            await loadProgramAccessForRole(mapped[0].id);
          } catch (err) {
            console.error(
              "Failed to load program access for default role",
              err,
            );
          }
        }
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

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

  const handleSave = async () => {
    const assigned = Array.from(checkedItems);

    if (!selectedRole) return;
    // Build progrmSn set: accept checked items that are already progrmSn,
    // map node ids -> progrmSn, expand folder nodes to descendant progrmSns,
    // and fallback to name-based mapping. Deduplicate results.
    const progrmSnsSet = new Set<string>();
    const missing: string[] = [];

    const allMappedValues = new Set<string>(Object.values(nodeToProgrmSn));

    for (const id of assigned) {
      // If the checked value is already a progrmSn reported by server, accept it
      if (assignedProgrmSns.has(id) || allMappedValues.has(id)) {
        progrmSnsSet.add(id);
        continue;
      }

      const byId = nodeToProgrmSn[id];
      if (byId) {
        progrmSnsSet.add(byId);
        continue;
      }

      // If it's a folder or unmapped node, try to collect descendant progrmSns
      const node = findNodeById(menuTree, id);
      let found = false;
      if (node) {
        const desc = getAllDescendantIds(node);
        for (const d of desc) {
          const v = nodeToProgrmSn[d];
          if (v) {
            progrmSnsSet.add(v);
            found = true;
          }
        }
        if (found) continue;

        // fallback to name-based mapping
        const byName = nameToProgrmSn[node.name];
        if (byName) {
          progrmSnsSet.add(byName);
          continue;
        }
      }

      // nothing matched for this id
      missing.push(id);
    }

    if (missing.length > 0) {
      console.warn("[program-auth] missing mapping for node ids:", missing);
      // Try to fetch a fresh full list and resolve missing by name as a last resort
      try {
        const fresh = await fetchProgramAccessAll(selectedRole.id);
        for (const id of [...missing]) {
          const node = findNodeById(menuTree, id);
          if (!node) continue;
          const name = node.name;
          const match = (fresh || []).find((q: any) => {
            const qName = String(
              q.programNm ?? q.progrmNm ?? q.programName ?? "",
            ).trim();
            if (qName && qName === name) return true;
            // try url-based match if available
            const uCandidates = [
              q.progrmUri,
              q.programUri,
              q.progrmUrl,
              q.programUrl,
            ]
              .filter(Boolean)
              .map((u: any) => String(u).split("?")[0]);
            for (const uc of uCandidates) {
              const nextRoute = legacyToNextRoute[uc];
              if (nextRoute && routeToNodeId[nextRoute] === id) return true;
            }
            return false;
          });
          if (match) {
            const sn =
              match.progrmSn ?? match.progrmId ?? match.progrmSno ?? null;
            if (sn) {
              progrmSnsSet.add(String(sn));
              // remove from missing
              const idx = missing.indexOf(id);
              if (idx >= 0) missing.splice(idx, 1);
            }
          }
        }
      } catch (err) {
        console.debug(
          "[program-auth] fetchProgramAccessAll during save failed",
          err,
        );
      }
    }

    const progrmSns = Array.from(progrmSnsSet);
    console.debug("Mapped progrmSns to send:", progrmSns);
    // call PUT /api/v1/program-access/{authorCode}
    try {
      const res = await updateProgramAccess(selectedRole.id, progrmSns);
      console.log("Update result", res);
    } catch (err) {
      console.error("Failed to update program access", err);
    }
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
                    selectedRole?.id === role.id ? "primary.main" : role.color,
                  border: "2px solid",
                  borderColor:
                    selectedRole?.id === role.id ? "primary.main" : "divider",
                  borderRadius: 2.5,
                  transition: "all 0.2s ease",
                  boxShadow:
                    selectedRole?.id === role.id
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
                        selectedRole?.id === role.id
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
                      color: selectedRole?.id === role.id ? "white" : "#1a1a1a",
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
                {selectedRole?.name ?? ""}
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
