import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "kurokuro96";
const GITHUB_API = "https://api.github.com";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === PASSWORD;
}

async function getFile() {
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/data/candidates.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to get candidates");
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(content), sha: data.sha };
}

async function putFile(content: unknown, sha: string) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/data/candidates.json`,
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
  if (!res.ok) throw new Error("Failed to put candidates");
  return res.json();
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content, sha } = await getFile();
    return NextResponse.json({ data: content, sha });
  } catch {
    return NextResponse.json({ data: [], sha: "" });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { candidates, sha } = await req.json();
    await putFile(candidates, sha);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("candidate save error:", error);

    return NextResponse.json(
      {
        error: String(error)
      },
      { status: 500 }
    );
  }
}
