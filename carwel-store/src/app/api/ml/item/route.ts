import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  // O Mercado Livre usa 'offset' para paginação (Página 1 = 0, Página 2 = 20...)
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // ROTA MESTRA: Esta é a mesma rota que o site do Mercado Livre usa.
    // Ela tem "Fuzzy Search" (entende pastilhas vs pastilha)
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

    // Se a rota pública não retornar nada (por bloqueio de token), 
    // ela tentará o fallback automático para a rota de admin
    if (!data.results || data.results.length === 0) {
       return await fallbackAdminSearch(q, offset, limit, SELLER_ID, ACCESS_TOKEN);
    }

    return NextResponse.json({
      results: data.results, // Aqui já vem o produto completo (foto, preço, título)
      total: data.paging?.total || 0
    });

  } catch (error) {
    console.error("Erro na busca avançada:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}

// Função de segurança caso a primeira falhe
async function fallbackAdminSearch(q: string, offset: number, limit: number, sellerId: string, token: any) {
    const url = `https://api.mercadolibre.com/users/${sellerId}/items/search?status=active&q=${encodeURIComponent(q)}&offset=${offset}&limit=${limit}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const searchData = await res.json();
    const ids = searchData.results || [];
    
    if (ids.length === 0) return NextResponse.json({ results: [], total: 0 });

    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${ids.join(',')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const itemsData = await itemsRes.json();
    const finalProducts = itemsData.filter((i: any) => i.code === 200).map((i: any) => i.body);

    return NextResponse.json({ results: finalProducts, total: searchData.paging?.total || 0 });
}
