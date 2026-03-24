import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pegamos a página atual. Se não vier nada, assume 1.
  const page = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // 1. Buscamos os IDs respeitando o offset e o limit (PAGINAÇÃO REAL)
    // Se houver busca (query), usamos a busca geral. Se não, usamos a busca de itens do usuário.
    let searchUrl = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    if (query) {
      searchUrl += `&q=${encodeURIComponent(query)}`;
    }

    const res = await fetch(searchUrl, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'CarbwelSite/1.0'
      }
    });

    const searchData = await res.json();
    
    // O Mercado Livre já devolve os dados básicos no search, 
    // então não precisamos fazer um segundo fetch por IDs a menos que queira dados muito específicos.
    // Isso deixa sua API muito mais rápida!
    const results = searchData.results || [];
    const total = searchData.paging?.total || 0;

    // Retornamos um objeto que a sua Home entende (com results e total)
    return NextResponse.json({
      results: results,
      total: total,
      paging: searchData.paging // Passamos o paging original para garantir
    });

  } catch (error) {
    console.error("Erro técnico:", error);
    return NextResponse.json({ ok: false, error: "Erro de conexão" }, { status: 500 });
  }
}
