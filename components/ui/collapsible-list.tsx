"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";

interface CollapsibleListProps<T> {
  initial?: number;
  items: T[];
  noun?: string;
  renderList: (visible: T[]) => ReactNode;
}

export function CollapsibleList<T>({
  items,
  initial = 4,
  noun,
  renderList,
}: CollapsibleListProps<T>) {
  const [open, setOpen] = useState(false);
  const hiddenCount = Math.max(0, items.length - initial);
  return (
    <Collapsible.Root onOpenChange={setOpen} open={open}>
      {renderList(items.slice(0, initial))}
      {hiddenCount > 0 && (
        <>
          <Collapsible.Panel className="pt-3">
            {renderList(items.slice(initial))}
          </Collapsible.Panel>
          <div className="mt-4 flex justify-center">
            <Collapsible.Trigger render={<Button variant="secondary" />}>
              {open
                ? "Show less"
                : `Show ${hiddenCount} more${noun ? ` ${noun}` : ""}`}
              <IconChevronDown
                aria-hidden="true"
                className={open ? "rotate-180" : undefined}
              />
            </Collapsible.Trigger>
          </div>
        </>
      )}
    </Collapsible.Root>
  );
}
