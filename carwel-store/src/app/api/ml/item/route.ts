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
    // 1. TENTATIVA A: Busca por Palavra-Chave (A mais comum)
    // Adicionamos "*" no final da palavra para ele buscar variações (ex: Amortecedor*)
    const cleanQ = q.trim().replace(/\s+/g, " ");
    const searchUrl = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}${cleanQ ? `&q=${encodeURIComponent(cleanQ)}` : ''}`;

    const res = await fetch(searchUrl, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    let searchData = await res.json();
    let itemIds = searchData.results || [];

    // 2. TENTATIVA B: Se não veio nada, tentamos quebrar a frase (Filtro Freio -> Filtro)
    if (itemIds.length === 0 && cleanQ.includes(" ")) {
        const firstWord = cleanQ.split(" ")[0];
        const resB = await fetch(`https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&q=${encodeURIComponent(firstWord)}&offset=${offset}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const dataB = await resB.json();
        itemIds = dataB.results || [];
        searchData.paging = dataB.paging;
    }

    if (itemIds.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // 3. BUSCA DETALHES (Preço, Título, Fotos)
    const idsString = itemIds.join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const itemsData = await itemsRes.json();
    const finalProducts = itemsData
      .filter((item: any) => item.code === 200)
      .map((item: any) => item.body);

    return NextResponse.json({
      results: finalProducts,
      total: searchData.paging?.total || 0
    });

  } catch (error) {
    console.error("Erro API:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
