"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  IconArrowUpRight,
  IconBook,
  IconBriefcase,
  IconHome,
  IconLayoutKanban,
  IconMail,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { links } from "@/lib/data";
import dockStyles from "./dock.module.css";
import styles from "./genie-window.module.css";

export type Destination = (typeof links)[number]["name"];
export type Launch = {
  x: number;
  y: number;
  trigger: HTMLElement;
  dock: DOMRect;
  tone: string;
  filter?: string;
};
const slices = Array.from({ length: 24 }, (_, i) => i);
function animateShell(
  shape: HTMLElement,
  bounds: DOMRect,
  launch: Launch,
  reduce: boolean
) {
  const originX = launch.x - bounds.left;
  const originY = launch.y - bounds.top;
  const startTime = document.timeline.currentTime;
  return Array.from(shape.children).map((element, index) => {
    const ratio = index / slices.length;
    const frames = Array.from({ length: 25 }, (_, step) => {
      const t = step / 24;
      const progressAt = (r: number) => {
        const delayed = Math.max(
          0,
          Math.min(1, (t - r * 0.42) / (1 - r * 0.42))
        );
        return 1 - (1 - delayed) ** 3;
      };
      const progress = progressAt(ratio);
      const nextRatio = (index + 1) / slices.length;
      const y =
        ratio * bounds.height +
        (originY - ratio * bounds.height) * (1 - progress);
      const nextY =
        nextRatio * bounds.height +
        (originY - nextRatio * bounds.height) * (1 - progressAt(nextRatio));
      // Project each strip into a trapezoid whose lower corners meet the next
      // strip's upper corners. A plain scale leaves stair-stepped side edges.
      const nextProgress = progressAt(nextRatio);
      const topWidth = bounds.width * (0.045 + 0.955 * progress);
      const bottomWidth = bounds.width * (0.045 + 0.955 * nextProgress);
      const topLeft =
        originX * (1 - progress) + (bounds.width * progress) / 2 - topWidth / 2;
      const bottomLeft =
        originX * (1 - nextProgress) +
        (bounds.width * nextProgress) / 2 -
        bottomWidth / 2;
      const sliceHeight = bounds.height / slices.length + 1;
      const perspective = topWidth / bottomWidth - 1;
      const offsetY = y - ratio * bounds.height;
      const xy = (bottomLeft * (perspective + 1) - topLeft) / sliceHeight;
      const yy =
        ((nextY - y + 1) * (perspective + 1) + offsetY * perspective) /
        sliceHeight;
      return {
        opacity: reduce ? t : Math.min(1, t * 8),
        transform: reduce
          ? "none"
          : `matrix3d(${topWidth / bounds.width},0,0,0,${xy},${yy},0,${perspective / sliceHeight},0,0,1,0,${topLeft},${offsetY},0,1)`,
      };
    });
    const animation = element.animate(frames, {
      duration: reduce ? 120 : 440,
      fill: "both",
    });
    animation.startTime = startTime;
    return animation;
  });
}
const icons = {
  About: IconUser,
  Blog: IconBook,
  Contact: IconMail,
  Experience: IconBriefcase,
  Home: IconHome,
  Projects: IconLayoutKanban,
};

export function GenieWindow({
  launch,
  selected,
  pages,
  onSelect,
  onDismiss,
}: {
  launch: Launch | null;
  selected: Destination;
  pages: Partial<Record<Destination, ReactNode>>;
  onSelect: (name: Destination) => void;
  onDismiss: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const animation = useRef<Animation[]>([]);
  const geometry = useRef("");
  const closing = useRef(false);
  const wasOpen = useRef(false);
  const [ready, setReady] = useState(false);
  const [visited, setVisited] = useState<Destination[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!launch) {
      wasOpen.current = false;
      return;
    }
    trigger.current = launch.trigger;
    setVisited((current) =>
      current.includes(selected) ? current : [...current, selected]
    );
    if (wasOpen.current) {
      return;
    }
    closing.current = false;
    setReady(false);
    // Base UI reveals the kept-mounted portal during its layout effects.
    // Measure on the next frame, after that visibility change has committed.
    const frame = requestAnimationFrame(() => {
      const target = panel.current;
      const shape = shell.current;
      if (!(target && shape)) return;
      wasOpen.current = true;
      const bounds = target.getBoundingClientRect();
      geometry.current = [
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        launch.x,
        launch.y,
      ].join(",");
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      shape.style.opacity = "1";
      animation.current.forEach((item) => item.cancel());
      animation.current = animateShell(shape, bounds, launch, reduce);
      Promise.all(animation.current.map((item) => item.finished))
        .then(() => {
          if (!closing.current) {
            setReady(true);
            shape.style.opacity = "0";
          }
        })
        .catch(() => {
          /* Cancellation is expected when reversing or unmounting. */
        });
    });
    return () => cancelAnimationFrame(frame);
  }, [launch, selected]);

  useLayoutEffect(() => {
    if (content.current) content.current.scrollTop = 0;
    if (
      wasOpen.current &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      content.current?.animate([{ opacity: 0.4 }, { opacity: 1 }], {
        duration: 160,
      });
  }, [selected]);

  useLayoutEffect(
    () => () => {
      animation.current.forEach((item) => item.cancel());
    },
    []
  );

  function close() {
    if (closing.current || !launch) return;
    closing.current = true;
    setReady(false);
    if (shell.current) shell.current.style.opacity = "1";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !animation.current.length) {
      onDismiss();
      return;
    }
    const bounds = panel.current?.getBoundingClientRect();
    if (
      bounds &&
      shell.current &&
      geometry.current !==
        [
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          launch.x,
          launch.y,
        ].join(",")
    ) {
      // Resize invalidates the original strip projection. Start its replacement
      // at the fully open pose before reversing, without replaying an entrance.
      animation.current.forEach((item) => item.cancel());
      animation.current = animateShell(shell.current, bounds, launch, false);
      animation.current.forEach((item) => item.finish());
    }
    // Reverse the existing geometry and shared clock, including mid-flight closes.
    // Rebuilding the strips here caused a one-frame reset and a visible jump.
    animation.current.forEach((item) => {
      item.reverse();
    });
    Promise.all(animation.current.map((item) => item.finished))
      .then(onDismiss)
      .catch(() => {
        /* Cancellation is expected on unmount. */
      });
  }

  const destination = links.find((item) => item.name === selected);
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) close();
      }}
      open={Boolean(launch)}
    >
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup
          className={styles.popup}
          finalFocus={() => trigger.current}
          initialFocus={closeRef}
          onClickCapture={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            const anchor = (event.target as Element).closest<HTMLAnchorElement>(
              "a[href]"
            );
            if (
              !anchor ||
              anchor.target === "_blank" ||
              !anchor.getAttribute("href")?.startsWith("/")
            )
              return;
            const url = new URL(anchor.href);
            // Pathname effects cannot observe an overview link on the page
            // already behind this window. Local #section links stay in-window.
            if (
              url.origin === location.origin &&
              url.pathname === location.pathname &&
              url.search === location.search
            )
              onDismiss();
          }}
          style={
            launch
              ? ({
                  bottom: `max(96px, calc(100svh - ${launch.y}px + 52px))`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div
            className={styles.panel}
            data-contact={selected === "Contact"}
            data-ready={ready}
            ref={panel}
          >
            <div aria-hidden="true" className={styles.shell} ref={shell}>
              {slices.map((index) => (
                <div
                  className={styles.slice}
                  key={index}
                  style={{
                    height: `calc(${100 / slices.length}% + 1px)`,
                    top: `${(index * 100) / slices.length}%`,
                  }}
                />
              ))}
            </div>
            <div className={styles.reading}>
              <header className={styles.header}>
                <Dialog.Title>
                  {selected === "Blog" ? "Writing" : selected}
                </Dialog.Title>
                <div className={styles.actions}>
                  <a aria-label="Open dedicated page" href={destination?.hash}>
                    <IconArrowUpRight size={20} />
                  </a>
                  <Dialog.Close aria-label="Close window" ref={closeRef}>
                    <IconX size={20} />
                  </Dialog.Close>
                </div>
              </header>
              <Dialog.Description className="sr-only">
                Portfolio page preview. Open the dedicated page for a standalone
                view.
              </Dialog.Description>
              <div className={styles.content} inert={!ready} ref={content}>
                {(visited.includes(selected)
                  ? visited
                  : [...visited, selected]
                ).map((name) => (
                  <div hidden={selected !== name} key={name}>
                    {pages[name]}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <nav
            aria-label="Window destinations"
            className={`${dockStyles.dock} ${styles.switcher}`}
            data-tone={launch?.tone}
            style={
              launch
                ? {
                    bottom: "auto",
                    height: launch.dock.height,
                    left: launch.dock.left,
                    top: launch.dock.top,
                    transform: "none",
                    width: launch.dock.width,
                  }
                : undefined
            }
          >
            <div
              aria-hidden="true"
              className={dockStyles.material}
              style={{ backdropFilter: launch?.filter }}
            />
            {links.map((item) => {
              const Icon = icons[item.name];
              const label = item.name === "Blog" ? "Writing" : item.name;
              return (
                <button
                  aria-current={selected === item.name ? "page" : undefined}
                  aria-label={label}
                  className={dockStyles.item}
                  key={item.name}
                  onClick={() =>
                    item.name === "Home" ? close() : onSelect(item.name)
                  }
                  type="button"
                >
                  <Icon aria-hidden="true" size={21} stroke={1.65} />
                  <span className={dockStyles.label}>{label}</span>
                </button>
              );
            })}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
