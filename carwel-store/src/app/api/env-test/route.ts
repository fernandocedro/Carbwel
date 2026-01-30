import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ML_APP_ID: process.env.ML_APP_ID ?? null,
    ML_REDIRECT_URI: process.env.ML_REDIRECT_URI ?? null,
  });
}