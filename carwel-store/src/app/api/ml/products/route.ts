import { NextResponse } from 'next/server';

export async function GET() {
  const userId = "72983036"; // ID da Carbwel
  
  // 1. Pegando as chaves do painel da Vercel
  const clientId = process.env.ML_APP_ID;         
  const clientSecret = process.env.ML_CLIENT_SECRET;
  const currentRefreshToken = process.env.ML_REFRESH_TOKEN; 

  // Validação preventiva para não enviar lixo à API
  if (!clientId || !clientSecret || !currentRefreshToken) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Configuração incompleta na Vercel.',
      ajuda: 'Adicione ML_REFRESH_TOKEN nas Environment Variables do projeto.' 
    }, { status: 500 });
  }

  try {
    // 2. Tentar renovar o token expirado
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: currentRefreshToken
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'O Refresh Token expirou ou é inválido.',
        instrucao: 'Faça login novamente em /api/ml/login para gerar um novo token.',
        detalhes: tokenData 
      }, { status: 401 });
    }

    // 3. Buscar os produtos com o novo Access Token gerado
    const mlResponse = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Carbwel-App/1.0'
        },
        cache: 'no-store'
      }
    );

    const data = await mlResponse.json();

    if (!mlResponse.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Mercado Livre recusou a lista de produtos (403).',
        details: data 
      }, { status: mlResponse.status });
    }

    // Retorna os produtos para a sua barra de busca
    return NextResponse.json({ ok: true, results: data.results });

  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Erro de conexão com o servidor' }, { status: 500 });
  }
}
