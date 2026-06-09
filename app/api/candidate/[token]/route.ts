import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const GITHUB_API = "https://api.github.com";

async function getFile(filePath: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to get ${filePath}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(content), sha: data.sha };
}

async function putFile(filePath: string, content: unknown, sha: string) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "候補者データを更新", content: encoded, sha }),
    }
  );
  if (!res.ok) throw new Error(`Failed to put ${filePath}`);
  return res.json();
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { content } = await getFile("data/candidates.json");
  const candidate = content.find((c: { editToken?: string }) => c.editToken === token);
  if (!candidate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ candidate });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { content, sha } = await getFile("data/candidates.json");
  const index = content.findIndex((c: { editToken?: string }) => c.editToken === token);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updates = await req.json();
  content[index] = { ...content[index], ...updates, editToken: token };
  await putFile("data/candidates.json", content, sha);
  return NextResponse.json({ ok: true });
}
