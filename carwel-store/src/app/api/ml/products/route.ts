import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('ml_access_token')?.value;
  const userId = "72983036"; // Seu User ID da Carbwel

  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'Não conectado' }, { status: 401 });
  }

  try {
    // Mudamos para buscar direto os itens do SEU usuário
    const response = await fetch(
      `https://api.mercadolibre.com/users/${userId}/items/search?access_token=${accessToken}&limit=50`
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Mercado Livre ainda processando acesso privado.',
        details: data 
      }, { status: response.status });
    }

    // O ML retorna uma lista de IDs em /users/me/items. 
    // Para simplificar agora, vamos manter a estrutura de busca que você já tinha:
    const searchResponse = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`
    );
    const searchData = await searchResponse.json();

    return NextResponse.json({ ok: true, results: searchData.results });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Erro de conexão' }, { status: 500 });
  }
}
