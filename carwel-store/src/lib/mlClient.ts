const ML_API_BASE = "https://api.mercadolibre.com";

// VARIÁVEL GLOBAL EM MEMÓRIA (Paliativo para a Vercel não apagar o token imediatamente)
// Nota: Para produção definitiva, use Vercel KV ou um Banco de Dados.
let globalTokens: any = null;

export function getAuthUrl(state: string) {
  const clientId = process.env.ML_APP_ID;
  const redirect = process.env.ML_REDIRECT_URI;

  if (!clientId || !redirect) {
    throw new Error("Faltou ML_APP_ID ou ML_REDIRECT_URI no painel da Vercel");
  }

  return `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirect
  )}&state=${state}`;
}

export async function exchangeCodeForToken(code: string) {
  const clientId = process.env.ML_APP_ID;
  const secret = process.env.ML_CLIENT_SECRET;
  const redirect = process.env.ML_REDIRECT_URI;

  if (!clientId || !secret || !redirect) {
    throw new Error("Faltou ML_APP_ID / ML_CLIENT_SECRET / ML_REDIRECT_URI no painel da Vercel");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: secret,
    code: code,
    redirect_uri: redirect,
  });

  const r = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = await r.json();
  
  if (!r.ok) {
    throw new Error(`Erro ao gerar Token: ${JSON.stringify(data)}`);
  }

  // SALVANDO NA MEMÓRIA EM VEZ DE ARQUIVO FÍSICO
  globalTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    expires_in: data.expires_in,
    token_type: data.token_type,
    updated_at: Date.now()
  };

  return { user_id: data.user_id, expires_in: data.expires_in };
}

export function getValidTokens() {
  // Retorna o que está guardado na memória do servidor
  return globalTokens;
}

export async function mlFetch(path: string) {
  const tokens = getValidTokens();
  
  if (!tokens?.access_token) {
    throw new Error("Não conectado no Mercado Livre. Acesse /api/ml/login");
  }

  const r = await fetch(`${ML_API_BASE}${path}`, {
    headers: { 
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json'
    },
    cache: "no-store",
  });

  const data = await r.json();
  
  if (!r.ok) {
    // Se o erro for 403, pode ser que a certificação ainda esteja propagando
    if (r.status === 403) {
       console.error("Erro 403: Verifique se a aplicação está CERTIFICADA no painel do ML.");
    }
    throw new Error(`Erro na API ML: ${JSON.stringify(data)}`);
  }
  
  return data;
}
