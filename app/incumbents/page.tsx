import { promises as fs } from "fs";
import path from "path";
import IncumbentsBrowser from "./IncumbentsBrowser";
import type { Incumbent } from "./IncumbentsBrowser";

async function getIncumbents(): Promise<Incumbent[]> {
  const filePath = path.join(process.cwd(), "data", "incumbents.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function IncumbentsPage() {
  const incumbents = await getIncumbents();
  return <IncumbentsBrowser incumbents={incumbents} />;
}
