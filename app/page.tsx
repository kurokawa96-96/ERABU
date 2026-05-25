import { promises as fs } from "fs";
import path from "path";
import { Election } from "@/lib/types";
import HomeClient from "@/app/components/HomeClient";

async function getElections(): Promise<Election[]> {
  const filePath = path.join(process.cwd(), "data", "elections.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function HomePage() {
  const elections = await getElections();
  return <HomeClient elections={elections} />;
}
