"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function SharePlanSection({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  return (
    <section className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5">
      <h2 className="text-sm font-semibold text-violet-100">
        Share your plan
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Anyone with the link can view this plan. No sign-up required.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 break-all rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-xs text-zinc-300">
          {shareUrl}
        </code>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 sm:min-w-[120px]"
          onClick={copy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy link
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
