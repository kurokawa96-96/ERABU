const GITHUB_API = "https://api.github.com";

async function getFile(path: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${path}`,
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

async function putFile(path: string, content: unknown, sha: string, message: string) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content: encoded, sha }),
    }
  );
  if (!res.ok) throw new Error(`Failed to put ${path}`);
  return res.json();
}

export async function getElections() {
  return getFile("data/elections.json");
}

export async function saveElections(elections: unknown, sha: string) {
  return putFile("data/elections.json", elections, sha, "選挙データを更新");
}

export async function getCandidates() {
  return getFile("data/candidates.json");
}

export async function saveCandidates(candidates: unknown, sha: string) {
  return putFile("data/candidates.json", candidates, sha, "候補者データを更新");
}
