// Utility to refresh access token using refresh token
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;
  const data = await response.json();

  // Save new tokens and expiry
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("expiresIn", data.expiresIn.toString());
  localStorage.setItem("tokenSetTime", Date.now().toString());
  if (data.refreshToken)
    localStorage.setItem("refreshToken", data.refreshToken);

  return data.accessToken;
}
