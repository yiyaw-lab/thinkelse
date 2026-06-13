import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const quest = await generateQuest({
      childName: "Yivin",
      age: 8,
      interests: ["animals", "drawing", "space"],
    });

    return NextResponse.json({
      ok: true,
      quest,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Quest generation failed.",
      },
      { status: 500 },
    );
  }
}
