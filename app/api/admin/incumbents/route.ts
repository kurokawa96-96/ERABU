import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "erabu2025";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === PASSWORD;
}

async function getFile(path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to get ${path}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(content), sha: data.sha };
}

async function putFile(path: string, content: unknown, sha: string) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "現職議員データを更新", content: encoded, sha }),
    }
  );
  if (!res.ok) throw new Error(`Failed to put ${path}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content, sha } = await getFile("data/incumbents.json");
    return NextResponse.json({ data: content, sha });
  } catch {
    return NextResponse.json({ data: [], sha: "" });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { incumbents, sha } = await req.json();
  await putFile("data/incumbents.json", incumbents, sha);
  return NextResponse.json({ ok: true });
}
