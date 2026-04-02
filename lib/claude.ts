import Anthropic, { APIError } from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey: key });

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      temperature: 0,
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
