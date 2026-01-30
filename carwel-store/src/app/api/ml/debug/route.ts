import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAuthUrl } from "../../../../lib/mlClient";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const url = getAuthUrl(state);

  return NextResponse.json({
    ML_APP_ID: process.env.ML_APP_ID,
    ML_REDIRECT_URI: process.env.ML_REDIRECT_URI,
    url,
  });
}
