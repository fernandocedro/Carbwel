import { NextResponse } from 'next/server';

export async function GET() {
  const userId = "72983036";
  
  // Voltando para a forma simples: apenas um Token Direto
  const accessToken = process.env.ML_ACCESS_TOKEN; 

  if (!accessToken) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Token não encontrado. Adicione ML_ACCESS_TOKEN na Vercel.' 
    }, { status: 500 });
  }

  try {
    // Busca direta dos produtos sem tentar renovar nada
    const mlResponse = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Carbwel-App/1.0'
        },
        cache: 'no-store'
      }
    );

    const data = await mlResponse.json();

    if (!mlResponse.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Erro na API do Mercado Livre', 
        details: data 
      }, { status: mlResponse.status });
    }

    return NextResponse.json({ ok: true, results: data.results });

  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Erro interno no servidor' }, { status: 500 });
  }
}
