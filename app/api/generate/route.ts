import { NextResponse } from "next/server";
import { generateAllOutputs } from "@/lib/prompts";
import type { IntakeInputs } from "@/types";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function validateBody(body: unknown): IntakeInputs | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const req = (k: string) =>
    typeof b[k] === "string" ? (b[k] as string).trim() : "";
  const productIdea = req("productIdea");
  const timeline = req("timeline");
  const platform = req("platform");
  const targetAudience = req("targetAudience");
  if (!productIdea || !timeline || !platform || !targetAudience) {
    return null;
  }
  const opt = (k: string) => {
    const v = b[k];
    return typeof v === "string" ? v.trim() : undefined;
  };
  return {
    productIdea,
    timeline,
    platform,
    targetAudience,
    techPreferences: opt("techPreferences"),
    designStyle: opt("designStyle"),
    featurePrioritization: opt("featurePrioritization"),
    integrations: opt("integrations"),
  };
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const inputs = validateBody(json);
  if (!inputs) {
    return bad(
      "Missing required fields: productIdea, timeline, platform, targetAudience"
    );
  }

  try {
    const outputs = await generateAllOutputs(inputs);
    return NextResponse.json({ outputs, inputs });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Generation failed unexpectedly";
    const isConfig = message.includes("ANTHROPIC_API_KEY");
    const status = isConfig ? 500 : message.includes("parse") ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
