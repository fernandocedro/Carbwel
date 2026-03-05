import { cookies } from 'next/headers';

const ML_API_BASE = "https://api.mercadolibre.com";

export async function getValidTokens() {
  try {
    // O await é necessário nas versões mais recentes do Next.js para cookies()
    const cookieStore = await cookies();
    const tokenData = cookieStore.get('ml_tokens')?.value;
    return tokenData ? JSON.parse(tokenData) : null;
  } catch (e) {
    // Durante o build (prerender), o Next.js não tem acesso a cookies.
    // Retornamos null para o build passar sem erro.
    return null;
  }
}

export async function mlFetch(path: string) {
  const tokens = await getValidTokens();
  
  if (!tokens?.access_token) {
    // Em vez de dar erro crítico que trava o build, retornamos um objeto de erro amigável
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

// Mantemos as outras funções (getAuthUrl, exchangeCodeForToken) como estavam
