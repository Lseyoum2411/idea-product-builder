import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { IntakeInputs, PersistedPlanOutputs } from "@/types";

let _admin: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  if (!_admin) {
    _admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

export type PlanRow = {
  id: string;
  slug: string;
  inputs: IntakeInputs;
  outputs: PersistedPlanOutputs;
  created_at: string;
};

export function isSupabaseConfigured(): boolean {
  return !!getAdminClient();
}

export async function insertPlanRow(
  slug: string,
  inputs: IntakeInputs,
  outputs: PersistedPlanOutputs
): Promise<boolean> {
  const sb = getAdminClient();
  if (!sb) return false;
  const { error } = await sb.from("plans").insert({
    slug,
    inputs,
    outputs,
  });
  if (error) {
    console.error("[supabase] insertPlanRow", error.message);
    return false;
  }
  return true;
}

export async function updatePlanRow(
  slug: string,
  inputs: IntakeInputs,
  outputs: PersistedPlanOutputs
): Promise<boolean> {
  const sb = getAdminClient();
  if (!sb) return false;
  const { error } = await sb
    .from("plans")
    .update({ inputs, outputs })
    .eq("slug", slug);
  if (error) {
    console.error("[supabase] updatePlanRow", error.message);
    return false;
  }
  return true;
}

export async function fetchPlanBySlug(
  slug: string
): Promise<PlanRow | null> {
  const sb = getAdminClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("plans")
    .select("id, slug, inputs, outputs, created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[supabase] fetchPlanBySlug", error.message);
    return null;
  }
  if (!data) return null;
  return data as PlanRow;
}
