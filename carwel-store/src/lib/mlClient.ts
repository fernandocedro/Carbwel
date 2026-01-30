import { readTokens, writeTokens } from "./mlTokenStore";

const ML_API_BASE = "https://api.mercadolibre.com";

export function getAuthUrl(state: string) {
  const clientId = process.env.ML_APP_ID;
  const redirect = process.env.ML_REDIRECT_URI;

  if (!clientId || !redirect) {
    throw new Error("Faltou ML_APP_ID ou ML_REDIRECT_URI no .env.local");
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
    throw new Error("Faltou ML_APP_ID / ML_CLIENT_SECRET / ML_REDIRECT_URI no .env.local");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: secret,
    code,
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
    throw new Error(`Token error: ${JSON.stringify(data)}`);
  }

  // Salva em .ml_tokens.json (ou no caminho do ML_TOKEN_FILE)
  writeTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
    expires_in: data.expires_in,
    token_type: data.token_type,
  });

  return { user_id: data.user_id, expires_in: data.expires_in };
}

export function getValidTokens() {
  return readTokens();
}

export async function mlFetch(path: string) {
  const tokens = readTokens();
  if (!tokens?.access_token) throw new Error("Não conectado no Mercado Livre.");

  const r = await fetch(`${ML_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    cache: "no-store",
  });

  const data = await r.json();
  if (!r.ok) throw new Error(`ML API error: ${JSON.stringify(data)}`);
  return data;
}
