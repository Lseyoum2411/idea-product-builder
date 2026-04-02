"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { FieldLabel } from "@/components/shared/FieldLabel";

const LS_KEY_TOKEN = "productbuddy-notion-api-key";
const LS_KEY_PARENT = "productbuddy-notion-parent-id";

export function NotionExportModal({
  open,
  onClose,
  productTitle,
  phases,
}: {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  phases: { phase: string; tasks: string[] }[];
}) {
  const [token, setToken] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    try {
      setToken(localStorage.getItem(LS_KEY_TOKEN) ?? "");
      setParentId(localStorage.getItem(LS_KEY_PARENT) ?? "");
    } catch {
      /* ignore */
    }
    setError(null);
    setSuccess(false);
  }, [open]);

  const submit = useCallback(async () => {
    setError(null);
    setSuccess(false);
    const t = token.trim();
    const p = parentId.trim();
    if (!t || !p) {
      setError("API key and parent page ID are required.");
      return;
    }
    try {
      localStorage.setItem(LS_KEY_TOKEN, t);
      localStorage.setItem(LS_KEY_PARENT, p);
    } catch {
      /* ignore */
    }

    setLoading(true);
    try {
      const res = await fetch("/api/export/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notionApiKey: t,
          parentPageId: p,
          title: productTitle.slice(0, 2000),
          phases,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Export failed"
        );
      }
      setSuccess(true);
      const url = typeof data.url === "string" ? data.url : null;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }, [token, parentId, productTitle, phases]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notion-export-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/[0.1] bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="notion-export-title"
            className="text-lg font-semibold text-zinc-50"
          >
            Export to Notion
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Your key is sent only to this app&apos;s server for the request and is
          not stored on our servers. It is saved in{" "}
          <strong className="text-zinc-400">your browser&apos;s</strong>{" "}
          localStorage.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <FieldLabel>Notion integration secret</FieldLabel>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="secret_…"
              autoComplete="off"
              className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
            />
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-violet-400 hover:text-violet-300"
            >
              Create / copy integration token →
            </a>
          </div>
          <div>
            <FieldLabel>Parent page ID</FieldLabel>
            <input
              type="text"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              placeholder="UUID of the page where new pages are added"
              className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
            />
            <a
              href="https://www.notion.so/help/add-and-manage-connections-with-the-api"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-violet-400 hover:text-violet-300"
            >
              Share the parent page with your integration, then copy its page ID →
            </a>
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-rose-300">{error}</p>
        ) : null}
        {success ? (
          <p className="mt-3 text-sm text-emerald-300">
            Opened in Notion ✓
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={loading}
            onClick={submit}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting…
              </>
            ) : (
              "Export"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
