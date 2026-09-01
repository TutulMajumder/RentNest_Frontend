"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createReviewAction } from "../_actions/reviewActions";

export function ReviewDialog({
  rentalRequestId,
  propertyTitle,
}: {
  rentalRequestId: string;
  propertyTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [state, formAction, actionPending] = useActionState(
    createReviewAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const submit = () => {
    const fd = new FormData();
    fd.set("rentalRequestId", rentalRequestId);
    fd.set("rating", String(rating));
    if (comment.trim()) fd.set("comment", comment.trim());
    startTransition(() => formAction(fd));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Leave review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your stay</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "size-7 transition-colors",
                    (hover || rating) >= n
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>

          <Textarea
            rows={3}
            placeholder="Share a few words about the property (optional)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={pending || rating === 0}>
            {pending ? "Submitting…" : "Submit review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
