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
  // Avoid including unnecessary headers that trigger CORS preflights.
  // In particular, don't send `Content-Type: application/json` on GET/HEAD requests.
  const method = (options.method || "GET").toString().toUpperCase();
  const incomingHeaders: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (
    (method === "GET" || method === "HEAD") &&
    incomingHeaders["Content-Type"]
  ) {
    // content-type on GET/HEAD often unnecessary and makes request non-simple
    delete incomingHeaders["Content-Type"];
    delete incomingHeaders["content-type"];
  }

  const headers = {
    ...incomingHeaders,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // Debug: warn when a preflight is likely (Authorization or non-simple content-type)
  if (headers.Authorization) {
    // Authorization header makes the request non-simple and will trigger a preflight
    console.debug(
      "[authFetch] Authorization present — browser will perform preflight OPTIONS request",
    );
  }

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
