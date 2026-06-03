import { promises as fs } from "fs";
import path from "path";

export async function getElectionsData() {
  const filePath = path.join(process.cwd(), "data", "elections.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function getCandidatesData() {
  const filePath = path.join(process.cwd(), "data", "candidates.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}
