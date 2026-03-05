import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  // 1. Pegamos o cookie com o nome correto: 'ml_tokens'
  const mlTokensCookie = cookieStore.get('ml_tokens')?.value;

  if (!mlTokensCookie) {
    return NextResponse.json({ ok: false, error: 'Não conectado' }, { status: 401 });
  }

  try {
    // 2. Como você salvou o JSON inteiro, precisamos extrair o access_token
    const tokens = JSON.parse(mlTokensCookie);
    const accessToken = tokens.access_token;
    const userId = "72983036"; 

    if (!accessToken) {
        return NextResponse.json({ ok: false, error: 'Token não encontrado no cookie' }, { status: 401 });
    }

    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
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
    return NextResponse.json({ ok: false, error: 'Erro ao processar tokens ou conexão' }, { status: 500 });
  }
}
