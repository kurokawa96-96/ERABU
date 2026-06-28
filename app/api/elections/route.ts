import { NextResponse } from "next/server";
import { getElections } from "@/lib/github";

export async function GET() {
  try {
    const { content } = await getElections();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json([]);
  }
}
