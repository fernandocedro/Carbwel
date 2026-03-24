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
    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    if (rawQuery.trim() !== "") {
      // LÓGICA MESTRA: 
      // 1. Remove caracteres especiais
      // 2. Remove preposições (de, para, com, etc)
      // 3. Transforma em palavras soltas que o ML entende melhor
      const cleanQ = rawQuery
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove tudo que não é letra ou número
        .replace(/\b(de|para|com|e|o|a|os|as|do|da|dos|das|pro|pra|para)\b/gi, "")
        .trim()
        .replace(/\s+/g, " "); // Garante apenas um espaço entre as palavras

      url += `&q=${encodeURIComponent(cleanQ)}`;
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

    // Se não trouxer nada, tentamos uma última vez apenas com a PRIMEIRA palavra da busca
    // (Ex: Se "Bucha Barra Estabilizadora" falhar, busca apenas "Bucha")
    if (itemIds.length === 0 && rawQuery.trim() !== "") {
        const firstWord = rawQuery.trim().split(' ')[0];
        const fallbackRes = await fetch(`${url.split('&q=')[0]}&q=${encodeURIComponent(firstWord)}`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const fallbackData = await fallbackRes.json();
        const fallbackIds = fallbackData.results || [];
        
        if (fallbackIds.length > 0) {
            return await fetchDetails(fallbackIds, fallbackData.paging?.total || 0, ACCESS_TOKEN);
        }
    }

    return await fetchDetails(itemIds, searchData.paging?.total || 0, ACCESS_TOKEN);

  } catch (error) {
    console.error("Erro na busca Carbwel:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}

// Função auxiliar para buscar os detalhes (preço, foto, etc)
async function fetchDetails(itemIds: string[], total: number, token: any) {
    if (itemIds.length === 0) return NextResponse.json({ results: [], total: 0 });
    
    const idsString = itemIds.slice(0, 20).join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 'Authorization': `Bearer ${token}` }
    });
    const itemsData = await itemsRes.json();
    const finalProducts = itemsData.filter((i: any) => i.code === 200).map((i: any) => i.body);
    
    return NextResponse.json({ results: finalProducts, total });
}
