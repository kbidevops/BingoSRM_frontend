import { UserDetailResponse } from "./auth";

export interface RegisterUserRequest {
  userId: string;
  userPassword: string;
  userNm: string;
  userTyCode: string;
  userSttusCode: string;
  psitn?: string;
  clsf?: string;
  moblphon?: string;
  email?: string;
  acntReqstResn?: string;
  conectIp?: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message?: string;
  user?: UserDetailResponse;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";

export async function registerUser(
  userData: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  const currentUserId = localStorage.getItem("userId");
  const userTyCode = localStorage.getItem("userTyCode");
  const accessToken = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": currentUserId || "",
      "X-User-Ty-Code": userTyCode || "",
      ...(accessToken ? { Authorization: `${tokenType} ${accessToken}` } : {}),
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, message: errorText };
  }

  const data = await response.json();
  return { success: true, user: data, message: data.message };
}

export async function checkUserIdDuplicate(
  userId: string,
): Promise<{ taken: boolean; error?: string }> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return { taken: true };
    }
    if (response.status === 404) {
      return { taken: false };
    }
    return { taken: false, error: `Unexpected status: ${response.status}` };
  } catch (e: unknown) {
    let errorMsg = "Unknown error";
    if (e instanceof Error) {
      errorMsg = e.message;
    }
    return { taken: false, error: errorMsg };
  }
}
