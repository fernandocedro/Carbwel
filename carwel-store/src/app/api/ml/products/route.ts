import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // URL de busca padrão para vendedores brasileiros (MLB)
    // Importante: Não enviamos o Q se ele estiver vazio para a API não se confundir
    let searchUrl = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    if (query && query.trim() !== "") {
      searchUrl += `&q=${encodeURIComponent(query)}`;
    }

    const res = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 } // Força o Next.js a não cachear erro
    });

    const searchData = await res.json();

    // Se o Mercado Livre retornar resultados vazios na busca geral, 
    // pode ser que o SELLER_ID precise de uma busca de itens específica (como você tinha antes)
    if (!searchData.results || searchData.results.length === 0) {
       // FALLBACK: Caso a busca geral falhe, usamos a lista de IDs e buscamos os detalhes
       // Mas aqui injetamos o TOTAL para a paginação não sumir
       return NextResponse.json({
         results: [],
         total: 0,
         message: "Nenhum resultado na busca do Seller"
       });
    }

    // Retorno de SUCESSO com os dados que o page.tsx precisa
    return NextResponse.json({
      results: searchData.results,
      total: searchData.paging?.total || 0,
      paging: searchData.paging
    });

  } catch (error) {
    console.error("Erro técnico na API:", error);
    return NextResponse.json({ error: "Erro de conexão" }, { status: 500 });
  }
}
