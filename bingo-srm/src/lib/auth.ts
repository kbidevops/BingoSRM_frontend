const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";

export interface LoginRequest {
  userId: string;
  userPassword: string;
}

export interface LoginResponse {
  authenticated: boolean;
  userId?: string;
  userTyCode?: string;
  userSttusCode?: string;
  status?: "OK" | "WAIT" | "STOP";
  passwordExpired?: boolean;
  locked?: boolean;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.authenticated) {
    // Store user info in localStorage for subsequent API calls
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userTyCode", data.userTyCode);
    localStorage.setItem("isAuthenticated", "true");
  }

  return data;
}

export function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userTyCode");
  localStorage.removeItem("isAuthenticated");
}

export function isAuthenticated(): boolean {
  return localStorage.getItem("isAuthenticated") === "true";
}

export function getCurrentUser() {
  return {
    userId: localStorage.getItem("userId"),
    userTyCode: localStorage.getItem("userTyCode"),
  };
}

// Menu/Program Access Types
export interface AssignedMenu {
  menuIndictYn: string;
  programId: string;
  programNm?: string;
  programUrl?: string;
  programDc?: string;
  sortOrdr?: number;
  upperMenuId?: string;
  menuLevel?: number;
  menuOrdr?: number;
  relateImagePath?: string;
  relateImageNm?: string;
  [key: string]: unknown; // Allow additional properties
}

export async function fetchAssignedMenus(
  userRoleCode?: string,
): Promise<AssignedMenu[]> {
  // Get authentication info from localStorage or use provided role code
  const userId = localStorage.getItem("userId");
  const userTyCode = userRoleCode || localStorage.getItem("userTyCode");

  if (!userTyCode) {
    throw new Error("User role code is required to fetch assigned menus");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/program-access/${userTyCode}/assigned`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Ty-Code": userTyCode,
        "X-User-Id": userId || "",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch assigned menus: ${response.statusText}`);
  }

  const assignedMenus: AssignedMenu[] = await response.json();
  return assignedMenus;
}

export async function fetchVisibleMenus(
  userRoleCode?: string,
): Promise<AssignedMenu[]> {
  const assignedMenus = await fetchAssignedMenus(userRoleCode);
  // Filter where menuIndictYn === 'Y' for visible menu items
  return assignedMenus.filter((menu) => menu.menuIndictYn === "Y");
}

// Update User Password
export interface UpdatePasswordRequest {
  userPassword: string;
  changePasswordYN?: "Y" | "N";
}

export interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}

export async function updateUserPassword(
  userId: string,
  passwordData: UpdatePasswordRequest,
  authHeaders?: { userId: string; userTyCode: string },
): Promise<UpdatePasswordResponse> {
  // Get authentication info from localStorage or use provided headers
  const currentUserId =
    authHeaders?.userId || localStorage.getItem("userId") || userId;
  const userTyCode =
    authHeaders?.userTyCode || localStorage.getItem("userTyCode") || "";

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": currentUserId,
      "X-User-Ty-Code": userTyCode,
    },
    body: JSON.stringify({
      userPassword: passwordData.userPassword,
      changePasswordYN: passwordData.changePasswordYN || "Y",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Password update failed:", response.status, errorText);
    throw new Error(`Failed to update password: ${response.statusText}`);
  }

  // Handle 204 No Content - successful but no response body
  if (response.status === 204) {
    return { success: true, message: "Password updated successfully" };
  }

  const data = await response.json();
  return { success: true, message: data.message };
}

// Update User
export interface UpdateUserRequest {
  userNm?: string;
  userTyCode?: string;
  userSttusCode?: string;
  psitn?: string;
  clsf?: string;
  moblphon?: string;
  email?: string;
  acntReqstResn?: string;
  changePasswordYN?: "Y" | "N";
  userPassword?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message?: string;
}

export async function updateUser(
  userId: string,
  userData: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  // Get authentication info from localStorage
  const currentUserId = localStorage.getItem("userId");
  const userTyCode = localStorage.getItem("userTyCode");

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": currentUserId || "",
      "X-User-Ty-Code": userTyCode || "",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("User update failed:", response.status, errorText);
    throw new Error(`Failed to update user: ${response.statusText}`);
  }

  // Handle 204 No Content - successful but no response body
  if (response.status === 204) {
    return { success: true, message: "User updated successfully" };
  }

  const data = await response.json();
  return { success: true, message: data.message };
}

// User List Types
export interface UserPagination {
  recordCountPerPage: number;
  pageIndex: number;
  totalCount: number;
}

export interface UserData {
  rowNum: null | number;
  searchCondition: string;
  searchKeyword: string;
  searchUseYn: string;
  pageIndex: number;
  pageUnit: number;
  pageSize: number;
  firstIndex: number;
  lastIndex: number;
  recordCountPerPage: number;
  saveToken: null | string;
  creatDt: string;
  creatId: string;
  creatUserNm: string;
  updtDt: string;
  updtId: string;
  updtUserNm: string;
  deleteYn: string;
  createDtDisplay: string;
  updtDtDisplay: string;
  returnListMode: null | string;
  userId: string;
  userPassword: string;
  userNm: string;
  userTyCode2: null | string;
  userTyCode: string;
  userTyCodeNm: string;
  userSttusCode: string;
  userSttusCodeNm: string;
  psitn: string;
  clsf: string;
  email: string;
  moblphon: string | null;
  acntReqstResn: string;
  changePasswordYN: string;
  conectIp: null | string;
  comboName: null | string;
  sysChargerVOList: unknown[];
  userLocat: null | string;
  userSignature: null | string;
  userSignatureFileName: null | string;
  userSignatureFileSize: null | number;
  deleteSignature: null | string;
  userSignatureFileSizeCalculated: string;
  decorator_POPUP: string;
  decorator_MAIN: string;
}

export interface UserListResponse {
  pagination: UserPagination;
  resultList: UserData[];
}

export interface UserListRequest {
  pageIndex?: number;
  recordCountPerPage?: number;
  searchCondition?: string;
  searchKeyword?: string;
  searchUseYn?: string;
  // Direct search parameters (legacy support)
  userId?: string;
  userNm?: string;
  psitn?: string;
  moblphon?: string;
  email?: string;
  userSttusCode?: string;
  userTyCode?: string; // <-- add this line
}

export async function fetchUserList(
  params?: UserListRequest,
): Promise<UserListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.pageIndex)
    queryParams.append("pageIndex", params.pageIndex.toString());
  if (params?.recordCountPerPage)
    queryParams.append(
      "recordCountPerPage",
      params.recordCountPerPage.toString(),
    );
  if (params?.searchCondition)
    queryParams.append("searchCondition", params.searchCondition);
  if (params?.searchKeyword)
    queryParams.append("searchKeyword", params.searchKeyword);
  if (params?.searchUseYn)
    queryParams.append("searchUseYn", params.searchUseYn);

  // Direct search parameters (legacy support)
  if (params?.userId) queryParams.append("userId", params.userId);
  if (params?.userNm) queryParams.append("userNm", params.userNm);
  if (params?.psitn) queryParams.append("psitn", params.psitn);
  if (params?.moblphon) queryParams.append("moblphon", params.moblphon);
  if (params?.email) queryParams.append("email", params.email);
  if (params?.userSttusCode)
    queryParams.append("userSttusCode", params.userSttusCode);
  if (params?.userTyCode) queryParams.append("userTyCode", params.userTyCode);

  const url = `${API_BASE_URL}/api/v1/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  // Get authentication info from localStorage
  const userId = localStorage.getItem("userId");
  const userTyCode = localStorage.getItem("userTyCode");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId || "",
      "X-User-Ty-Code": userTyCode || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data: UserListResponse = await response.json();
  return data;
}

// Get specific user
export interface UserDetailResponse {
  userId: string;
  userNm: string;
  userTyCode: string;
  userTyCodeNm?: string;
  userSttusCode: string;
  userSttusCodeNm?: string;
  psitn?: string;
  clsf?: string;
  moblphon?: string;
  email?: string;
  acntReqstResn?: string;
  creatDt?: string;
  creatId?: string;
  updtDt?: string;
  updtId?: string;
  conectIp?: string;
  userSignature?: string;
  userSignatureFileName?: string;
  [key: string]: unknown;
}

export async function fetchUserDetail(
  userId: string,
): Promise<UserDetailResponse> {
  // Get authentication info from localStorage
  const currentUserId = localStorage.getItem("userId");
  const userTyCode = localStorage.getItem("userTyCode");

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": currentUserId || "",
      "X-User-Ty-Code": userTyCode || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user detail: ${response.statusText}`);
  }

  const data: UserDetailResponse = await response.json();
  return data;
}

// Code Types
export interface CodeItem {
  cmmnCode?: string; // Code value (e.g., "U001")
  cmmnCodeDc?: string; // Code description
  cmmnCodeNm?: string; // Code name
  cmmnCodeTy?: string; // Code type (e.g., "U0")
  cmmnCodeTyNm?: string; // Code type name
  sortNo?: string; // Sort order
  deleteYn?: string; // Delete flag
  [key: string]: unknown;
}

export async function fetchCodeTypes(codeType: string): Promise<CodeItem[]> {
  // Get authentication info from localStorage
  const userId = localStorage.getItem("userId");
  const userTyCode = localStorage.getItem("userTyCode");

  const response = await fetch(
    `${API_BASE_URL}/api/v1/code-types/${codeType}/codes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId || "",
        "X-User-Ty-Code": userTyCode || "",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch code types: ${response.statusText}`);
  }

  // Response is directly an array, not wrapped in an object
  const data: CodeItem[] = await response.json();
  return data || [];
}
