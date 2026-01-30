import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAuthUrl } from "../../../../lib/mlClient";

export async function GET() {
  try {
    // Gera state para segurança OAuth
    const state = crypto.randomBytes(16).toString("hex");

    // Monta URL de login Mercado Livre
    const url = getAuthUrl(state);

    // Redireciona para login do Mercado Livre
    return NextResponse.redirect(url);

  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao gerar URL de login ML",
      },
      { status: 500 }
    );
  }
}
