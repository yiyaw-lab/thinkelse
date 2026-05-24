import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Else",
    message: "Think Else is alive.",
  });
}