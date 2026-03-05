import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Código não encontrado' }, { status: 400 });
  }

  try {
    // Trocando o código temporário pelo Token Real
    const resML = await fetch('https://api.mercadolibre.com/oauth/token', {
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

    const data = await resML.json();

    if (data.access_token) {
      // Criamos a resposta de sucesso
      const response = NextResponse.json({ 
        message: "Conectado com sucesso!", 
        token: data.access_token,
        expires: data.expires_in 
      });

      // SALVANDO O TOKEN NO NAVEGADOR (Cookie)
      // Isso impede que o login "suma" quando a Vercel reiniciar
      response.cookies.set('ml_tokens', JSON.stringify(data), {
        httpOnly: true, // Mais segurança para sua conta Certificada
        secure: true,   // Apenas via HTTPS (Vercel)
        maxAge: 21600,  // Dura 6 horas (mesmo tempo do token do ML)
        path: '/',      // Disponível em todo o site Carbwel
      });

      return response;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao trocar token' }, { status: 500 });
  }
}
