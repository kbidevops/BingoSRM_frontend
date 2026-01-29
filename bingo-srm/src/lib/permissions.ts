// Small permissions utilities: canonical menu tree, mappings, and helpers
export interface MenuNode {
  id: string;
  name: string;
  isFolder?: boolean;
  children?: MenuNode[];
}

// canonical tree used in ProgramAuth UI and for navbar filtering
export const menuTree: MenuNode[] = [
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

// Map legacy backend URIs to new app routes
export const legacyToNextRoute: Record<string, string> = {
  "/user/mngr/retrievePagingList.do": "/user/user-management",
  "/syscharger/mngr/retrieveList.do": "/user/system-manager",
  "/progrm/mngr/retrieveTreeList.do": "/user/program",
  "/progrmaccesauthor/mngr/retrieveTreeList.do": "/user/program-auth",

  "/srvcrspons/site/retrieveSrReqList.do": "/sr/request",
  "/srvcrspons/site/retrieveSrRcvList.do": "/sr/receive",
  "/srvcrspons/mngr/retrieveSrProcList.do": "/sr/process",
  "/srvcrspons/mngr/retrieveSrVrList.do": "/sr/verify",
  "/srvcrspons/mngr/retrieveSrFnList.do": "/sr/complete",
  "/srvcrspons/mngr/retrieveSrEvList.do": "/sr/evaluation",
};

// Map next-route paths to our local tree node ids
export const routeToNodeId: Record<string, string> = {
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

// Normalize a URI string (strip query and trim)
export const normalizeUri = (u: any) => {
  if (!u || typeof u !== "string") return "";
  const idx = u.indexOf("?");
  return (idx >= 0 ? u.slice(0, idx) : u).trim();
};

// Export a small helper that given assigned rows and an optional fullList
// returns a Set of allowed node ids and progrmSns. This centralizes
// the mapping logic so nav components and program-auth share the same rules.
export function mapAssignedRowsToAllowed(
  assignedRows: any[],
  fullList: any[] = [],
): { allowedNodeIds: Set<string>; allowedProgrmSns: Set<string> } {
  const allowedNodeIds = new Set<string>();
  const allowedProgrmSns = new Set<string>();

  const findNodeIdByName = (nodes: MenuNode[], name: string): string | null => {
    for (const node of nodes) {
      if (node.name === name) return node.id;
      if (node.children) {
        const found = findNodeIdByName(node.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  assignedRows.forEach((p) => {
    const candidates = [
      (p as any).progrmUri,
      (p as any).programUri,
      (p as any).progrmUrl,
      (p as any).programUrl,
      (p as any).progrmPath,
      (p as any).menuUrl,
      (p as any).uri,
    ].map(normalizeUri);

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

    if (!nodeId) {
      const nameCandidate =
        (p as any).programNm ||
        (p as any).progrmNm ||
        (p as any).programName ||
        "";
      if (nameCandidate) {
        const byName = findNodeIdByName(menuTree, String(nameCandidate).trim());
        if (byName) nodeId = byName;
      }
    }

    // try fullList fallback
    if (!nodeId && Array.isArray(fullList) && fullList.length > 0) {
      for (const q of fullList) {
        const qCandidates = [
          (q as any).progrmUri,
          (q as any).programUri,
          (q as any).progrmUrl,
          (q as any).programUrl,
        ].map(normalizeUri);
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
        const qName =
          (q as any).programNm || (q as any).programName || (q as any).progrmNm;
        if (qName) {
          const byName = findNodeIdByName(menuTree, String(qName).trim());
          if (byName) {
            nodeId = byName;
            break;
          }
        }
      }
    }

    if (!nodeId) return;

    // extract progrmSn-ish values
    let progrmSn =
      (p as any).progrmSn ??
      (p as any).progrmId ??
      (p as any).progrmSno ??
      null;
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
        if (qName && nameCandidate && qName === String(nameCandidate).trim())
          return true;
        const qcands = [
          (q as any).progrmUri,
          (q as any).programUri,
          (q as any).progrmUrl,
          (q as any).programUrl,
        ].map(normalizeUri);
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

    if (progrmSn != null) allowedProgrmSns.add(String(progrmSn));
    allowedNodeIds.add(nodeId);
  });

  return { allowedNodeIds, allowedProgrmSns };
}
