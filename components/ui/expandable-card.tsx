"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ExperienceCardItem {
  company: string;
  date: string;
  description?: readonly string[];
  icon: string;
  id: string;
  location: string;
  title: string;
}

export interface ExpandableCardProps {
  className?: string;
  items: ExperienceCardItem[];
}

export default function ExpandableCard({
  items,
  className,
}: ExpandableCardProps) {
  return (
    <div className={cn("relative flex w-full flex-col gap-3", className)}>
      {items.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger
            render={
              <Button
                className="experience-card group h-auto w-full justify-start gap-3 whitespace-normal rounded-none border border-border bg-card/70 p-4 text-left hover:bg-card sm:gap-4 sm:p-5"
                variant="ghost"
              />
            }
          >
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden border border-border bg-card sm:size-14">
              <Image alt="" height={32} src={item.icon} width={32} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="ui-label mb-0.5 block text-muted-foreground">
                {item.date}
              </span>
              <span className="font-sans block break-words text-base font-semibold text-foreground sm:text-[1.0625rem]">
                {item.title}
              </span>
              <span className="block text-sm text-muted-foreground">
                {item.company} · {item.location}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="ui-label hidden shrink-0 text-muted-foreground sm:block"
            >
              Expand
            </span>
          </DialogTrigger>
          <DialogContent className="modal-shadow max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl sm:p-8">
            <div className="mb-4 flex items-start gap-3 pr-8 sm:gap-4">
              <Image
                alt=""
                className="size-10 shrink-0 border border-border p-2 sm:size-14"
                height={56}
                src={item.icon}
                width={56}
              />
              <div className="min-w-0">
                <p className="ui-label mb-2 text-muted-foreground">
                  {item.date}
                </p>
                <DialogTitle className="font-sans break-words text-xl font-semibold sm:text-2xl">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {item.company} · {item.location}
                </DialogDescription>
              </div>
            </div>
            {item.description?.length ? (
              <ul className="flex list-disc flex-col gap-3 pl-5 text-base leading-7 text-muted-foreground">
                {item.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            ) : null}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
