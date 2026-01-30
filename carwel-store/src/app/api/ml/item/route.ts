import { NextResponse } from "next/server";
import { mlFetch } from "../../../../lib/mlClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { ok: false, error: "Parâmetro 'id' é obrigatório" },
        { status: 400 }
      );
    }

    // Busca dados completos do item no Mercado Livre
    const data = await mlFetch(`/items/${itemId}`);

    return NextResponse.json({
      ok: true,
      data,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao buscar item no Mercado Livre",
      },
      { status: 500 }
    );
  }
}
