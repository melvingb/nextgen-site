import { NextResponse } from "next/server";
import {
  ADMIN_GITHUB_USER_ID,
  ADMIN_SESSION_COOKIE,
  OAUTH_STATE_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-session";

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GitHubUser = {
  id: number;
  login: string;
  avatar_url?: string;
};

function loginError(request: Request, error: string) {
  return NextResponse.redirect(
    new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url)
  );
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const stateCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${OAUTH_STATE_COOKIE}=`))
    ?.slice(OAUTH_STATE_COOKIE.length + 1);

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return loginError(request, "OAuthCallback");
  }

  const clientId = process.env.AUTH_GITHUB_ID?.trim();
  const clientSecret = process.env.AUTH_GITHUB_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return loginError(request, "Configuration");
  }

  const redirectUri = `${url.origin}/api/auth/callback/github`;

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const tokenData = (await tokenResponse.json()) as TokenResponse;

  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error("[nextgen-oauth] token exchange failed", {
      status: tokenResponse.status,
      error: tokenData.error,
      description: tokenData.error_description,
    });
    return loginError(request, "OAuthCallback");
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenData.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "nextgen-site-admin",
    },
    cache: "no-store",
  });

  if (!userResponse.ok) {
    console.error("[nextgen-oauth] user lookup failed", {
      status: userResponse.status,
    });
    return loginError(request, "OAuthCallback");
  }

  const user = (await userResponse.json()) as GitHubUser;

  if (String(user.id) !== ADMIN_GITHUB_USER_ID) {
    return loginError(request, "AccessDenied");
  }

  const sessionToken = createAdminSessionToken({
    githubId: String(user.id),
    login: user.login,
    avatarUrl: user.avatar_url,
  });

  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  response.cookies.set(OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
