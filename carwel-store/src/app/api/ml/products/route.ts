import { NextResponse } from "next/server";
import { getValidTokens, mlFetch } from "../../../../lib/mlClient";

export async function GET() {
  const tokens = await getValidTokens();
  if (!tokens?.user_id) {
    return NextResponse.json(
      { ok: false, error: "Não conectado. Faça login em /api/ml/login" },
      { status: 401 }
    );
  }

  const data = await mlFetch(`/users/${tokens.user_id}/items/search`);
  return NextResponse.json({ ok: true, user_id: tokens.user_id, ...data });
}