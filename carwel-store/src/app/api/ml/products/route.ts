import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // O Next.js exige o await para ler os cookies em versões recentes
  const cookieStore = await cookies(); 
  const accessToken = cookieStore.get('ml_access_token')?.value;
  const userId = "72983036"; 

  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'Não conectado' }, { status: 401 });
  }

  try {
    // Vamos direto na busca por seller_id, que é mais estável
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
    return NextResponse.json({ ok: false, error: 'Erro de conexão' }, { status: 500 });
  }
}
