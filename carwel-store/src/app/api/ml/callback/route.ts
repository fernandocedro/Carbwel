import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "../../../../lib/mlClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  // Se o Mercado Livre devolveu erro
  if (error) {
    return NextResponse.json(
      { ok: false, where: "ml_callback", error, error_description: errorDesc },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        ok: false,
        where: "ml_callback",
        error: "Callback sem code. Verifique o redirect_uri cadastrado no app do Mercado Livre.",
      },
      { status: 400 }
    );
  }

  try {
    const saved = await exchangeCodeForToken(code);
    return NextResponse.json({ ok: true, saved });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, where: "exchangeCodeForToken", error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
