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
    // --- LÓGICA DE BUSCA INTELIGENTE (FUZZY LIGHT) ---
    let cleanQuery = rawQuery.trim().toLowerCase();
    
    if (cleanQuery !== "") {
      // 1. Remove "s" do final para bater plural com singular (Ex: pastilhas -> pastilha)
      // 2. Remove preposições e espaços extras
      cleanQuery = cleanQuery
        .replace(/s\b/g, "") // Remove 's' no final das palavras
        .replace(/\b(de|para|com|e|o|a|os|as)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    if (cleanQuery !== "") {
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
    const itemIds = searchData.results || [];

    if (itemIds.length === 0) {
      // Fallback: Se não achou nada com a busca limpa, tenta a busca original sem o tratamento
      // Isso ajuda caso a peça realmente tenha 'S' no nome (Ex: Discos)
      return fetchFallback(rawQuery, offset, limit, SELLER_ID, ACCESS_TOKEN);
    }

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
    console.error("Erro técnico:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}

// Função de Fallback para garantir que nada se perca
async function fetchFallback(q: string, offset: number, limit: number, sellerId: string, token: any) {
    const res = await fetch(`https://api.mercadolibre.com/users/${sellerId}/items/search?status=active&offset=${offset}&limit=${limit}&q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const ids = data.results || [];
    if (ids.length === 0) return NextResponse.json({ results: [], total: 0 });
    
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${ids.join(',')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const itemsData = await itemsRes.json();
    const products = itemsData.filter((i: any) => i.code === 200).map((i: any) => i.body);
    
    return NextResponse.json({ results: products, total: data.paging?.total || 0 });
}
