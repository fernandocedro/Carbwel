import { NextResponse } from "next/server";
import { getValidTokens, mlFetch } from "../../../../lib/mlClient";

export async function GET() {
  const tokens = await getValidTokens();
  
  // Verifica se o token existe e é válido
  if (!tokens?.access_token || !tokens?.user_id) {
    return NextResponse.json(
      { ok: false, error: "Não conectado. Faça login em /api/ml/login" },
      { status: 401 }
    );
  }

  try {
    // 1. Mudamos a rota para garantir que a busca seja feita no Seller ID correto
    // 2. Adicionamos o parâmetro 'status=active' para pegar seus 5.582 anúncios ativos
    const data = await mlFetch(`/sites/MLB/search?seller_id=${tokens.user_id}&status=active`);
    
    // Se a API retornar erro de permissão interno
    if (data.error === "forbidden" || data.status === 403) {
       return NextResponse.json(
        { ok: false, error: "Mercado Livre ainda processando certificação. Tente novamente em instantes.", details: data },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      user_id: tokens.user_id, 
      total_items: data.paging?.total || 0,
      products: data.results || [] 
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: "Erro ao conectar com a API do Mercado Livre", message: error.message },
      { status: 500 }
    );
  }
}
