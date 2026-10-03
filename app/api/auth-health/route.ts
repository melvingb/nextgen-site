import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return NextResponse.json(
    {
      ok:
        Boolean(process.env.AUTH_SECRET) &&
        Boolean(process.env.AUTH_GITHUB_ID) &&
        Boolean(process.env.AUTH_GITHUB_SECRET),
      env: {
        AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
        AUTH_GITHUB_ID: Boolean(process.env.AUTH_GITHUB_ID),
        AUTH_GITHUB_SECRET: Boolean(process.env.AUTH_GITHUB_SECRET),
        ADMIN_GITHUB_LOGIN: Boolean(process.env.ADMIN_GITHUB_LOGIN),
      },
      host: url.host,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
