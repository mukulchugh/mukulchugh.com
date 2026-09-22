"use client";

import { IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Cal = dynamic(
  () => import("@calcom/embed-react").then((module) => module.default),
  {
    loading: () => (
      <div className="flex min-h-[520px] flex-col gap-4 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    ),
    ssr: false,
  }
);

function CalInitializer() {
  useEffect(() => {
    void import("@calcom/embed-react").then(async ({ getCalApi }) => {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "light",
      });
    });
  }, []);

  return null;
}

interface CalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalBookingModal({ isOpen, onClose }: CalBookingModalProps) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent
        className="modal-shadow flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-h-[90vh] sm:max-w-[min(720px,calc(100%-4rem))]"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-border px-6 py-5">
          <DialogTitle
            className={cn(
              "font-sans",
              "text-2xl font-semibold leading-[1.15] tracking-[-0.025em]"
            )}
          >
            Pick a time
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a time for a fifteen minute call.
          </DialogDescription>
          <DialogClose
            render={
              <Button
                aria-label="Close booking"
                className="rounded-none bg-muted text-muted-foreground hover:bg-muted hover:text-foreground/90"
                size="icon"
                variant="ghost"
              />
            }
          >
            <IconX />
          </DialogClose>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isOpen ? (
            <>
              <CalInitializer />
              <Cal
                calLink="mukulchugh/15min"
                config={{ theme: "light" }}
                namespace="15min"
                style={{ height: "100%", minHeight: 520, width: "100%" }}
              />
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
