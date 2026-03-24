import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // Usamos a busca geral do site MLB, filtrando pelo seu SELLER_ID
    // Essa rota é muito melhor para processar o texto da busca (Ex: "VELA")
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;

    if (q.trim() !== "") {
      url += `&q=${encodeURIComponent(q.trim())}`;
    }

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    // O retorno dessa API já traz os resultados completos (não precisa de segundo fetch)
    return NextResponse.json({
      results: data.results || [],
      total: data.paging?.total || 0,
      paging: data.paging
    });

  } catch (error) {
    console.error("Erro na busca:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
