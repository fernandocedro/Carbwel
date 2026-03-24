import { NextResponse } from 'next/server';



export const dynamic = 'force-dynamic';



export async function GET() {

  const SELLER_ID = "72983036";

  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;



  try {

    // Trocamos 'me' pelo SELLER_ID real para evitar o erro "UserID is mandatory"

    const res = await fetch(`https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active`, {

      cache: 'no-store',

      headers: {

        'Authorization': `Bearer ${ACCESS_TOKEN}`,

        'User-Agent': 'CarbwelSite/1.0'

      }

    });



    if (!res.ok) {

      const errorData = await res.json();

      return NextResponse.json({ ok: false, error: "Erro na API", details: errorData }, { status: res.status });

    }



    const searchData = await res.json();

    const itemIds = searchData.results || [];



    if (itemIds.length === 0) {

      return NextResponse.json({ ok: true, message: "Nenhum produto ativo encontrado", results: [] });

    }



    // Busca os detalhes dos itens (limite de 20 para carregar rápido)

    const idsString = itemIds.slice(0, 20).join(',');

    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {

       headers: { 

         'Authorization': `Bearer ${ACCESS_TOKEN}`,

         'User-Agent': 'CarbwelSite/1.0'

       }

    });



    const itemsData = await itemsRes.json();

    

    // Filtramos apenas os itens que retornaram com sucesso (code 200)

    const finalProducts = itemsData

      .filter((item: any) => item.code === 200)

      .map((item: any) => item.body);



    return NextResponse.json(finalProducts);



  } catch (error) {

    console.error("Erro técnico:", error);

    return NextResponse.json({ ok: false, error: "Erro de conexão" }, { status: 500 });

  }

}
