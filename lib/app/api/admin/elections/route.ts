import { NextRequest, NextResponse } from "next/server";
import { getElections, saveElections } from "@/lib/github";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "erabu2025";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content, sha } = await getElections();
    return NextResponse.json({ data: content, sha });
  } catch {
    return NextResponse.json({ data: [], sha: "" });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { elections, sha } = await req.json();
  await saveElections(elections, sha);
  return NextResponse.json({ ok: true });
}
