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
    // 1. Usamos a rota de USER que é a que seu Token tem permissão total
    // Adicionamos status=active para garantir que só venha o que está à venda
    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    // 2. Se houver busca, limpamos o termo para o ML não "alucinar"
    if (q.trim() !== "") {
      // Dica: O ML na rota de /users funciona melhor com termos simples
      const cleanQ = q.trim().split(' ')[0]; // Pega apenas a primeira palavra se for composta
      url += `&q=${encodeURIComponent(q.trim())}`;
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
      return NextResponse.json({ results: [], total: 0 });
    }

    // 3. Buscamos os detalhes reais dos produtos (Preço, Foto, Título)
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
    console.error("Erro na busca Carbwel:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
