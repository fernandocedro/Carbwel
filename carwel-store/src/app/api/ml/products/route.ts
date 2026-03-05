import { NextResponse } from 'next/server';

export async function GET() {
  const userId = "72983036";
  
  // Pegando as chaves das Variáveis de Ambiente exatamente como estão no seu print da Vercel
  const clientId = process.env.ML_APP_ID;         // Ajustado para bater com seu print
  const clientSecret = process.env.ML_CLIENT_SECRET;
  const currentRefreshToken = process.env.ML_REFRESH_TOKEN; // Certifique-se de ter criado esta chave na Vercel

  try {
    // 1. SOLICITAR UM NOVO ACCESS TOKEN AO MERCADO LIVRE
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId || '',
        client_secret: clientSecret || '',
        refresh_token: currentRefreshToken || ''
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Erro ao renovar token:", tokenData);
      return NextResponse.json({ 
        ok: false, 
        error: 'Falha ao renovar credenciais. Verifique o ML_REFRESH_TOKEN na Vercel.', 
        details: tokenData 
      }, { status: 401 });
    }

    const newAccessToken = tokenData.access_token;
    
    // 2. BUSCAR OS PRODUTOS COM O NOVO TOKEN VÁLIDO
    const mlResponse = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?seller_id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${newAccessToken}`,
          'User-Agent': 'Carbwel-App/1.0'
        },
        cache: 'no-store'
      }
    );

    const data = await mlResponse.json();

    if (!mlResponse.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Mercado Livre recusou a busca de produtos (Erro 403 ou similar).', 
        details: data 
      }, { status: mlResponse.status });
    }

    return NextResponse.json({ ok: true, results: data.results });

  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ ok: false, error: 'Erro interno no servidor da Vercel' }, { status: 500 });
  }
}
