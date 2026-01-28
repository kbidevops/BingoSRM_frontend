// Centralized fetch wrapper with automatic token refresh and retry
import { refreshAccessToken } from "./authRefresh";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let accessToken = localStorage.getItem("accessToken");
  const expiresIn = Number(localStorage.getItem("expiresIn") || "0");
  const tokenSetTime = Number(localStorage.getItem("tokenSetTime") || "0");
  const now = Date.now();

  // If token is expired or about to expire in 1 min, refresh it
  if (
    accessToken &&
    tokenSetTime &&
    expiresIn &&
    now - tokenSetTime > (expiresIn - 60) * 1000
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }
    accessToken = await refreshPromise;
  }

  // Attach token
  const headers = {
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try refresh and retry once
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }
    accessToken = await refreshPromise;
    if (accessToken) {
      response = await fetch(url, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      });
    }
  }

  // If still unauthorized, logout
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }

  return response;
}
