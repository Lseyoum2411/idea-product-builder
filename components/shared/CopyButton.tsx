"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button";

export function CopyButton({
  text,
  label = "Copy",
  className,
  variant = "outline",
}: {
  text: string;
  label?: string;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  const [ok, setOk] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch {
      setOk(false);
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={copy}
      aria-label={label}
    >
      {ok ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {ok ? "Copied" : label}
    </Button>
  );
}
