import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import {
  isContentKind,
  normalizeContent,
  type ContentKind,
} from "@/lib/admin-content";
import {
  getPublishingBranch,
  publishAdminContent,
  readAdminContent,
} from "@/lib/github-admin";

function forbidden(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin !== new URL(request.url).origin);
}

async function authorized() {
  return Boolean(await getAdminSession());
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kind } = await params;
  if (!isContentKind(kind)) {
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  }

  try {
    const items = await readAdminContent(kind as ContentKind);
    return NextResponse.json({
      items,
      branch: getPublishingBranch(),
      source: "github",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load content." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (forbidden(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const { kind } = await params;
  if (!isContentKind(kind)) {
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { items?: unknown };
    const items = normalizeContent(kind, body.items);
    const result = await publishAdminContent(kind, items);

    return NextResponse.json({ ok: true, items, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not publish content." },
      { status: 400 }
    );
  }
}
