"use client";

import {
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconX,
} from "@tabler/icons-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CVModalProps {
  cvUrl: string;
  isOpen: boolean;
  name: string;
  onClose: () => void;
}

const cvActions = [
  {
    desktopOnly: true,
    download: false,
    Icon: IconExternalLink,
    label: "Open",
    mobileLabel: "View PDF",
    type: "open",
  },
  {
    desktopOnly: false,
    download: true,
    Icon: IconDownload,
    label: "Download",
    mobileLabel: "Download",
    type: "download",
  },
] as const;

export function CVModal({ isOpen, onClose, cvUrl, name }: CVModalProps) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent
        className="modal-shadow flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-[min(56rem,calc(100%-4rem))]"
        showCloseButton={false}
      >
        <header className="flex items-center justify-between border-b border-border p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-none bg-foreground/[0.06] p-2 ring-1 ring-border">
              <IconFileText className="size-5 text-foreground/60" />
            </div>
            <div>
              <DialogTitle
                className={cn(
                  "font-syne",
                  "text-lg font-semibold text-foreground sm:text-xl"
                )}
              >
                {name}&apos;s Resume
              </DialogTitle>
              <DialogDescription className="sr-only">
                View or download {name}&apos;s resume in PDF format
              </DialogDescription>
              <p className="text-sm text-muted-foreground">
                View or download my resume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cvActions.map((action) => (
              <a
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: action.download ? "default" : "secondary",
                  }),
                  "rounded-none",
                  action.desktopOnly ? "hidden sm:inline-flex" : "inline-flex"
                )}
                download={action.download || undefined}
                href={cvUrl}
                key={action.type}
                rel={action.download ? undefined : "noopener noreferrer"}
                target={action.download ? undefined : "_blank"}
              >
                <action.Icon data-icon="inline-start" />
                {action.label}
              </a>
            ))}

            <DialogClose
              render={
                <Button
                  aria-label="Close resume"
                  className="rounded-none bg-foreground/[0.06] hover:bg-foreground/[0.10]"
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <IconX className="text-foreground/60" />
            </DialogClose>
          </div>
        </header>

        <div className="relative h-[60vh] max-h-[600px] min-h-[420px] w-full flex-1 bg-gray-50 sm:h-[70vh]">
          <iframe
            className="size-full"
            src={`${cvUrl}#toolbar=0&navpanes=0`}
            title="Resume PDF"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 sm:hidden">
            <IconFileText className="size-16 text-foreground/25" />
            <p className="px-4 text-center text-muted-foreground">
              PDF preview is best viewed on desktop
            </p>
            <div className="flex gap-3">
              {cvActions.map((action) => (
                <a
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: action.download ? "default" : "secondary",
                    }),
                    "rounded-none"
                  )}
                  download={action.download || undefined}
                  href={cvUrl}
                  key={action.type}
                  rel={action.download ? undefined : "noopener noreferrer"}
                  target={action.download ? undefined : "_blank"}
                >
                  <action.Icon data-icon="inline-start" />
                  {action.mobileLabel}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
