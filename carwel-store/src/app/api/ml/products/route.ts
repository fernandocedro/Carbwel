import { NextResponse } from 'next/server';

export async function GET() {
  const userId = "72983036"; // Seu Seller ID da Carbwel
  const accessToken = process.env.ML_ACCESS_TOKEN; 

  if (!accessToken) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Token não configurado na Vercel. Adicione ML_ACCESS_TOKEN.' 
    }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Erro de permissão no Mercado Livre (403)', 
        details: data 
      }, { status: response.status });
    }

    return NextResponse.json({ ok: true, results: data.results });

  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Falha na conexão interna da Vercel',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
