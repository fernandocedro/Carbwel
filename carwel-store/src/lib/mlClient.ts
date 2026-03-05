import { cookies } from 'next/headers';

const ML_API_BASE = "https://api.mercadolibre.com";

export function getValidTokens() {
  const cookieStore = cookies();
  const tokenData = cookieStore.get('ml_tokens')?.value;
  return tokenData ? JSON.parse(tokenData) : null;
}

export function writeTokens(data: any) {
  // O salvamento real agora acontece no arquivo de callback/route.ts via Cookie
  return data;
}

export async function mlFetch(path: string) {
  const tokens = getValidTokens();
  
  if (!tokens?.access_token) {
    throw new Error("Não conectado. Acesse /api/ml/login");
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
