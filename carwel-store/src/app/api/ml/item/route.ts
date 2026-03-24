import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // Mudamos para a rota /sites/MLB/search que é a mesma do site oficial
    // Ela respeita MUITO melhor o filtro de categoria por vendedor
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;

    // SE tiver categoria, usamos o filtro técnico 'category'
    if (categoryId && categoryId !== "") {
      url += `&category=${categoryId}`;
    } 
    // SE NÃO tiver categoria e tiver texto, usamos o 'q'
    else if (q.trim() !== "") {
      const cleanQ = q
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\b(para|veiculos|carros|caminhonetes|veiculo|de|da|do|e)\b/gi, "")
        .replace(/\s+/g, ' ')
        .trim();
      url += `&q=${encodeURIComponent(cleanQ)}`;
    }

    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    // Esta rota já retorna os objetos completos dos produtos no campo 'results'
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // Retornamos os dados diretamente (sem precisar de um segundo fetch por IDs)
    return NextResponse.json({ 
      results: data.results, 
      total: data.paging?.total || 0 
    });

  } catch (error) {
    console.error("Erro na API Carbwel:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
