import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ElectionClient from "./ElectionClient";

async function getElection(id: string) {
  const filePath = path.join(process.cwd(), "data", "elections.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const elections = JSON.parse(raw);
  return elections.find((e: { id: string }) => e.id === id) ?? null;
}

async function getCandidates(electionId: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "candidates.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const candidates = JSON.parse(raw);
    return candidates.filter((c: { electionId: string }) => c.electionId === electionId);
  } catch {
    return [];
  }
}

export default async function ElectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const election = await getElection(id);
  if (!election) notFound();

  const candidates = await getCandidates(election.id);

  return <ElectionClient election={election} candidates={candidates} />;
}
