import { customAlphabet } from "nanoid";
import { NextResponse } from "next/server";
import { runFullGenerationPipeline } from "@/lib/generation";
import { getAppBaseUrl } from "@/lib/appUrl";
import { computeUpdatedTabs } from "@/lib/sectionDiff";
import {
  fetchPlanBySlug,
  insertPlanRow,
  isSupabaseConfigured,
  updatePlanRow,
} from "@/lib/supabase";
import type { BuilderOutputs, IntakeInputs } from "@/types";

const slugAlphabet = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  8
);

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function validateBody(body: unknown): {
  inputs: IntakeInputs;
  changeDescription?: string;
  previousOutputs?: BuilderOutputs;
  slug?: string;
} | null {
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
  const inputs: IntakeInputs = {
    productIdea,
    timeline,
    platform,
    targetAudience,
    techPreferences: opt("techPreferences"),
    designStyle: opt("designStyle"),
    featurePrioritization: opt("featurePrioritization"),
    integrations: opt("integrations"),
  };

  const changeDescription =
    typeof b.changeDescription === "string" ? b.changeDescription.trim() : "";
  const slug = typeof b.slug === "string" ? b.slug.trim() : undefined;
  let previousOutputs: BuilderOutputs | undefined;
  if (b.previousOutputs && typeof b.previousOutputs === "object") {
    previousOutputs = b.previousOutputs as BuilderOutputs;
  }

  if (changeDescription) {
    if (!previousOutputs) {
      return null;
    }
  }

  return {
    inputs,
    changeDescription: changeDescription || undefined,
    previousOutputs,
    slug,
  };
}

async function allocateSlugAndInsert(
  inputs: IntakeInputs,
  persisted: import("@/types").PersistedPlanOutputs
): Promise<string | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  for (let attempt = 0; attempt < 8; attempt++) {
    const slug = slugAlphabet();
    const ok = await insertPlanRow(slug, inputs, persisted);
    if (ok) return slug;
  }
  return undefined;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const parsed = validateBody(json);
  if (!parsed) {
    return bad(
      "Missing or invalid fields. Required: productIdea, timeline, platform, targetAudience. Refinement requires previousOutputs and changeDescription."
    );
  }

  const { inputs, changeDescription, previousOutputs, slug: existingSlug } =
    parsed;

  try {
    const { outputs, persisted } = await runFullGenerationPipeline(inputs, {
      previousOutputs,
      changeDescription,
    });

    let slug = existingSlug;
    let updatedTabs: import("@/types").TabId[] | undefined;

    if (changeDescription && previousOutputs) {
      updatedTabs = computeUpdatedTabs(previousOutputs, outputs);
    }

    if (isSupabaseConfigured()) {
      if (existingSlug) {
        const row = await fetchPlanBySlug(existingSlug);
        if (row) {
          await updatePlanRow(existingSlug, inputs, persisted);
        } else {
          const newSlug = await allocateSlugAndInsert(inputs, persisted);
          slug = newSlug ?? slug;
        }
      } else {
        const newSlug = await allocateSlugAndInsert(inputs, persisted);
        slug = newSlug;
      }
    }

    const baseUrl = getAppBaseUrl();
    const shareUrl = slug ? `${baseUrl}/plan/${slug}` : undefined;

    return NextResponse.json({
      outputs,
      inputs,
      slug,
      shareUrl,
      feasibility: persisted.feasibility,
      complexityByPhase: persisted.complexityByPhase,
      updatedTabs,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Generation failed unexpectedly";
    const isConfig = message.includes("ANTHROPIC_API_KEY");
    const status = isConfig ? 500 : message.includes("parse") ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
