import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import {
  deleteRepositoryFile,
  getPublishingBranch,
  listUploadedMedia,
  writeRepositoryBinary,
} from "@/lib/github-admin";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

async function authorized() {
  return Boolean(await getAdminSession());
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const stem = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${stem || "image"}${ext}`;
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await listUploadedMedia();
    return NextResponse.json({ files, branch: getPublishingBranch() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load media." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Images must be 6 MB or smaller." }, { status: 400 });
    }

    const fileName = safeFileName(file.name);
    const path = `public/assets/images/uploads/${Date.now()}-${fileName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await writeRepositoryBinary(
      path,
      bytes,
      `media: upload ${fileName} from admin`
    );

    return NextResponse.json({
      ok: true,
      path,
      publicPath: "/" + path.replace(/^public\//, ""),
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not upload image." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { path?: string };
    const path = body.path?.trim() || "";

    if (!path.startsWith("public/assets/images/uploads/")) {
      return NextResponse.json({ error: "Only admin uploads can be deleted." }, { status: 400 });
    }

    const result = await deleteRepositoryFile(
      path,
      `media: remove ${path.split("/").pop() || "upload"} from admin`
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete image." },
      { status: 500 }
    );
  }
}
