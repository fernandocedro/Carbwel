import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: "Token não configurado" }, { status: 500 });
  }

  try {
    // 1. Limpeza rigorosa da query para evitar erro 400 na API do ML
    let cleanQ = rawQuery
      .trim()
      .replace(/\//g, ' ') // Troca barras por espaço
      .replace(/[^\w\sÀ-ÿ]/g, '') // Remove caracteres especiais, mantém letras e acentos
      .replace(/\s+/g, ' '); // Remove espaços duplos

    // 2. Montagem da URL (Usando a rota de itens do usuário que é a mais estável para o seu token)
    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    if (cleanQ !== "") {
      url += `&q=${encodeURIComponent(cleanQ)}`;
    }

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      }
    });

    const searchData = await res.json();
    const itemIds = searchData.results || [];

    // Se não houver resultados, retorna vazio em vez de dar erro
    if (itemIds.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // 3. Busca os detalhes dos itens encontrados
    const idsString = itemIds.join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const itemsData = await itemsRes.json();
    
    // Filtramos apenas os que retornaram sucesso (status 200)
    const products = itemsData
      .filter((result: any) => result.code === 200)
      .map((result: any) => result.body);

    return NextResponse.json({
      results: products,
      total: searchData.paging?.total || 0
    });

  } catch (error) {
    console.error("Erro na API Carbwel:", error);
    return NextResponse.json({ results: [], total: 0, error: "Falha na conexão" }, { status: 500 });
  }
}
