import Anthropic, { APIError } from "@anthropic-ai/sdk";

export const MODEL_SONNET = "claude-sonnet-4-20250514";
export const MODEL_HAIKU = "claude-haiku-4-5-20251001";

export type CallClaudeOptions = {
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options?: CallClaudeOptions
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey: key });
  const model = options?.model ?? MODEL_SONNET;
  const max_tokens = options?.maxTokens ?? 4096;
  const temperature = options?.temperature ?? 0;

  try {
    const res = await client.messages.create({
      model,
      max_tokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = res.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("Model returned no text content");
    }
    return block.text;
  } catch (e: unknown) {
    if (e instanceof APIError) {
      throw new Error(
        e.message || `Anthropic API error (${e.status ?? "unknown"})`
      );
    }
    if (e instanceof Error) throw e;
    throw new Error("Unknown error calling Anthropic");
  }
}
