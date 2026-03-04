import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Código não encontrado' }, { status: 400 });
  }

  try {
    // Trocando o código temporário pelo Token Real
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ML_APP_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.ML_REDIRECT_URI!,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      // Por enquanto, vamos exibir o token na tela para você ver que funcionou
      // Em produção, salvaríamos isso num banco de dados
      return NextResponse.json({ 
        message: "Conectado com sucesso!", 
        token: data.access_token,
        expires: data.expires_in 
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao trocar token' }, { status: 500 });
  }
}
