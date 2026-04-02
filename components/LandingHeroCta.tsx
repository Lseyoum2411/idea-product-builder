"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

export function LandingHeroCta() {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="primary"
      className="mt-8 px-6 py-3 text-base"
      onClick={() => router.push("/new")}
    >
      Build my plan →
    </Button>
  );
}
