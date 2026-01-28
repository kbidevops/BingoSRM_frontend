// Utility to refresh access token using refresh token
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;
  const data = await response.json();

  // Save new tokens and expiry
  if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
  if (data.expiresIn)
    localStorage.setItem("expiresIn", data.expiresIn.toString());
  localStorage.setItem("tokenSetTime", Date.now().toString());
  if (data.refreshToken)
    localStorage.setItem("refreshToken", data.refreshToken);

  return data.accessToken || null;
}
