import fs from "node:fs";
import path from "node:path";

export type MlTokens = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
  user_id?: number;
  obtained_at: number; // epoch ms
};

function tokenFilePath() {
  const p = process.env.ML_TOKEN_FILE || "./.ml_tokens.json";
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}

export function readTokens(): MlTokens | null {
  const file = tokenFilePath();
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as MlTokens;
}

export function writeTokens(tokens: Omit<MlTokens, "obtained_at">) {
  const file = tokenFilePath();
  const payload: MlTokens = { ...tokens, obtained_at: Date.now() };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}
