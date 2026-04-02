import { NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

function stripId(raw: string): string {
  return raw.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
}

function toNotionUuid(hex32: string): string | null {
  if (hex32.length !== 32) return null;
  return [
    hex32.slice(0, 8),
    hex32.slice(8, 12),
    hex32.slice(12, 16),
    hex32.slice(16, 20),
    hex32.slice(20, 32),
  ].join("-");
}

function heading2(text: string) {
  return {
    object: "block" as const,
    type: "heading_2" as const,
    heading_2: {
      rich_text: [
        { type: "text" as const, text: { content: text.slice(0, 2000) } },
      ],
    },
  };
}

function toDoBlock(text: string) {
  return {
    object: "block" as const,
    type: "to_do" as const,
    to_do: {
      rich_text: [
        { type: "text" as const, text: { content: text.slice(0, 2000) } },
      ],
      checked: false,
    },
  };
}

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad("Invalid JSON");
  }
  if (!json || typeof json !== "object") return bad("Invalid body");
  const b = json as Record<string, unknown>;

  const notionApiKey =
    typeof b.notionApiKey === "string" ? b.notionApiKey.trim() : "";
  const parentRaw =
    typeof b.parentPageId === "string" ? b.parentPageId.trim() : "";
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const phases = b.phases;

  if (!notionApiKey) return bad("Missing notionApiKey");
  if (!parentRaw) return bad("Missing parentPageId");
  if (!title) return bad("Missing title");
  if (!Array.isArray(phases) || phases.length === 0) {
    return bad("Missing phases");
  }

  const parentUuid = toNotionUuid(stripId(parentRaw));
  if (!parentUuid) return bad("parentPageId must be a 32-character UUID");

  const children: Array<ReturnType<typeof heading2> | ReturnType<typeof toDoBlock>> = [];
  for (const p of phases) {
    if (!p || typeof p !== "object") continue;
    const row = p as Record<string, unknown>;
    const phase =
      typeof row.phase === "string" ? row.phase.trim() : "";
    const tasks = Array.isArray(row.tasks) ? row.tasks : [];
    if (!phase) continue;
    children.push(heading2(phase));
    for (const t of tasks) {
      const text = typeof t === "string" ? t.trim() : "";
      if (text) children.push(toDoBlock(text));
    }
  }

  if (children.length === 0) return bad("No checklist content to export");

  const headers = {
    Authorization: `Bearer ${notionApiKey}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  const firstBatch = children.slice(0, 100);
  const rest = children.slice(100);

  const createRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { page_id: parentUuid },
      properties: {
        title: {
          title: [{ text: { content: title.slice(0, 2000) } }],
        },
      },
      children: firstBatch,
    }),
  });

  const createData = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    const msg =
      typeof createData.message === "string"
        ? createData.message
        : "Notion API error creating page";
    return bad(msg, createRes.status >= 400 && createRes.status < 600 ? createRes.status : 502);
  }

  const pageId = createData.id as string | undefined;
  if (!pageId) {
    return bad("Notion did not return a page id", 502);
  }

  for (let i = 0; i < rest.length; i += 100) {
    const chunk = rest.slice(i, i + 100);
    const appendRes = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ children: chunk }),
      }
    );
    if (!appendRes.ok) {
      const err = await appendRes.json().catch(() => ({}));
      const msg =
        typeof err.message === "string" ? err.message : "Notion append failed";
      return bad(msg, 502);
    }
  }

  const pageUrl =
    typeof createData.url === "string" ? createData.url : undefined;

  return NextResponse.json({
    ok: true,
    pageId,
    url: pageUrl,
  });
}
