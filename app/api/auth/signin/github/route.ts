import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const clientId = process.env.AUTH_GITHUB_ID?.trim();

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/admin/login?error=Configuration", request.url)
    );
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/github`;
  const state = randomBytes(32).toString("hex");

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
