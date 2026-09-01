"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/types";
import { setUserStatusAction } from "../_actions/adminActions";

export function AdminUserActions({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (user.role === "ADMIN") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const banned = user.status === "BLOCKED";

  return (
    <Button
      size="sm"
      variant={banned ? "outline" : "destructive"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await setUserStatusAction(
            user.id,
            banned ? "ACTIVE" : "BLOCKED",
          );
          if (res.success) toast.success(res.message);
          else toast.error(res.message);
          router.refresh();
        })
      }
    >
      {isPending ? "…" : banned ? "Unban" : "Ban"}
    </Button>
  );
}
