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

  try {
    // --- LÓGICA DE TRATAMENTO DE BUSCA ---
    let cleanQuery = rawQuery
      .trim()
      .toLowerCase()
      .replace(/s\b/g, "") // Remove 's' no final (pastilhas -> pastilha)
      .replace(/\b(de|para|com|e|o|a|os|as)\b/gi, "") // Remove preposições
      .replace(/\s+/g, " ") // Remove espaços duplos
      .trim();

    // Se o usuário digitou algo, usamos a busca. Se não, listamos tudo.
    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    if (cleanQuery !== "") {
      // DICA: Adicionar asterisco no final ajuda o ML a buscar por "começa com"
      url += `&q=${encodeURIComponent(cleanQuery)}`;
    }

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'CarbwelSite/1.0'
      }
    });

    const searchData = await res.json();
    let itemIds = searchData.results || [];

    // SE NÃO ACHOU NADA COM A BUSCA TRATADA, TENTA A BUSCA ORIGINAL (Fallback)
    if (itemIds.length === 0 && rawQuery !== "") {
      const fallbackRes = await fetch(
        `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}&q=${encodeURIComponent(rawQuery)}`,
        { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }
      );
      const fallbackData = await fallbackRes.json();
      itemIds = fallbackData.results || [];
    }

    if (itemIds.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // BUSCA DE DETALHES
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
    console.error("Erro na API Carbwel:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
