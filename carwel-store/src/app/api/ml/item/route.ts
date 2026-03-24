import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || ''; // NOVO: Pega o ID da categoria
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // 1. URL Base de busca do vendedor
    let url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&offset=${offset}&limit=${limit}`;

    // 2. PRIORIDADE 1: Se houver Category ID, busca direto na "gaveta" (Assertividade 100%)
    if (categoryId && categoryId !== "") {
      url += `&category=${categoryId}`;
    } 
    // 3. PRIORIDADE 2: Se não houver categoria, usa a busca por texto com limpeza
    else if (rawQuery.trim() !== "") {
      const cleanQ = rawQuery
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\b(para|veiculos|carros|caminhonetes|escravos|jardim|completos|receptor|bolas|jogos|veiculo)\b/gi, "")
        .replace(/\b(de|da|do|e|o|a|os|as)\b/gi, "")
        .replace(/\s+/g, ' ')
        .trim();

      url += `&q=${encodeURIComponent(cleanQ)}`;
    }

    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const searchData = await res.json();
    const itemIds = searchData.results || [];

    if (itemIds.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    // 4. Busca os detalhes dos produtos (fotos, preço, título)
    const idsString = itemIds.join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const itemsData = await itemsRes.json();
    const finalProducts = itemsData
      .filter((i: any) => i.code === 200)
      .map((i: any) => i.body);

    return NextResponse.json({ 
      results: finalProducts, 
      total: searchData.paging?.total || 0 
    });

  } catch (error) {
    console.error("Erro na API ML:", error);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
