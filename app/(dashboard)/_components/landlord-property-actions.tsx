"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Property } from "@/lib/types";
import {
  deletePropertyAction,
  setAvailabilityAction,
} from "../_actions/propertyActions";

export function LandlordPropertyActions({ property }: { property: Property }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isAvailable = property.availabilityStatus === "AVAILABLE";
  const canToggle =
    property.availabilityStatus === "AVAILABLE" ||
    property.availabilityStatus === "UNAVAILABLE";

  const run = (fn: () => Promise<{ success: boolean; message: string }>) =>
    startTransition(async () => {
      const res = await fn();
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
      router.refresh();
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" disabled={isPending}>
            <MoreHorizontal />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/properties/${property.id}`}>View listing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
              Edit
            </Link>
          </DropdownMenuItem>
          {canToggle && (
            <DropdownMenuItem
              onClick={() =>
                run(() =>
                  setAvailabilityAction(
                    property.id,
                    isAvailable ? "UNAVAILABLE" : "AVAILABLE",
                  ),
                )
              }
            >
              Mark as {isAvailable ? "unavailable" : "available"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this property?</DialogTitle>
            <DialogDescription>
              “{property.title}” will be removed from listings. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                setConfirmOpen(false);
                run(() => deletePropertyAction(property.id));
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
