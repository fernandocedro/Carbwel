import { NextResponse } from 'next/server';

export async function GET() {
  const userId = "72983036"; 

  try {
    // Fazendo a requisição pública diretamente, sem usar o token expirado do cookie
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'User-Agent': 'Carbwel-App/1.0' // Ajuda a evitar bloqueios na Vercel
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Mercado Livre recusou o acesso.',
        details: data 
      }, { status: response.status });
    }

    return NextResponse.json({ ok: true, results: data.results });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Erro na conexão com Mercado Livre' }, { status: 500 });
  }
}
