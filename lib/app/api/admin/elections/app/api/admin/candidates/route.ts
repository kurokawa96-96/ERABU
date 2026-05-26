import { NextRequest, NextResponse } from "next/server";
import { getCandidates, saveCandidates } from "@/lib/github";

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
    const { content, sha } = await getCandidates();
    return NextResponse.json({ data: content, sha });
  } catch {
    return NextResponse.json({ data: [], sha: "" });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { candidates, sha } = await req.json();
  await saveCandidates(candidates, sha);
  return NextResponse.json({ ok: true });
}
