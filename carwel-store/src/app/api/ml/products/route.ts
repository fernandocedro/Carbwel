import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. CAPTURAMOS OS PARÂMETROS DE PÁGINA QUE O SITE ENVIA
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // 2. BUSCAMOS OS IDS USANDO OFFSET E LIMIT (PAGINAÇÃO REAL)
    const res = await fetch(
      `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`, 
      {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'User-Agent': 'CarbwelSite/1.0'
        }
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ ok: false, error: "Erro na API", details: errorData }, { status: res.status });
    }

    const searchData = await res.json();
    const itemIds = searchData.results || [];
    
    // 3. CAPTURAMOS O TOTAL REAL (OS 3.000+)
    const totalItems = searchData.paging?.total || 0;

    if (itemIds.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // 4. BUSCAMOS OS DETALHES DOS 20 ITENS DA PÁGINA ATUAL
    const idsString = itemIds.join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'User-Agent': 'CarbwelSite/1.0'
       }
    });

    const itemsData = await itemsRes.json();
    
    const finalProducts = itemsData
      .filter((item: any) => item.code === 200)
      .map((item: any) => item.body);

    // 5. RETORNAMOS O FORMATO QUE A PÁGINA INICIAL PRECISA
    return NextResponse.json({
      results: finalProducts,
      total: totalItems
    });

  } catch (error) {
    console.error("Erro técnico:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
