import { cookies } from 'next/headers';

const ML_API_BASE = "https://api.mercadolibre.com";

// 1. ADICIONE O EXPORT AQUI (O erro do build foi por falta disso)
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

// 2. CERTIFIQUE-SE DE QUE ESTA TAMBÉM TEM EXPORT
export async function exchangeCodeForToken(code: string) {
  const clientId = process.env.ML_APP_ID;
  const secret = process.env.ML_CLIENT_SECRET;
  const redirect = process.env.ML_REDIRECT_URI;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId!,
    client_secret: secret!,
    code: code,
    redirect_uri: redirect!,
  });

  const r = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  return await r.json();
}

// 3. FUNÇÃO DE BUSCA DE TOKENS (ASSÍNCRONA PARA O NEXT 16)
export async function getValidTokens() {
  try {
    const cookieStore = await cookies();
    const tokenData = cookieStore.get('ml_tokens')?.value;
    return tokenData ? JSON.parse(tokenData) : null;
  } catch (e) {
    return null; // Essencial para o build passar
  }
}

// 4. FUNÇÃO DE BUSCA DE PRODUTOS
export async function mlFetch(path: string) {
  const tokens = await getValidTokens();
  
  if (!tokens?.access_token) {
    return { error: "unauthorized", message: "Necessário login" };
  }

  const r = await fetch(`${ML_API_BASE}${path}`, {
    headers: { 
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json'
    },
    cache: "no-store",
  });

  return await r.json();
}
