import { NextResponse } from "next/server";
import { getValidTokens } from "../../../../lib/mlClient";

export async function GET() {
  const tokens = await getValidTokens();
  return NextResponse.json({ ok: true, tokens });
}
