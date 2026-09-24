// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The optical test scroll container must support keyboard scrolling.
"use client";

import {
  IconBook,
  IconBriefcase,
  IconHome,
  IconLayoutKanban,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { trackPortfolioEvent } from "@/lib/analytics";
import { links } from "@/lib/data";
import styles from "./dock.module.css";
import type { Destination, Launch } from "./genie-window";

const loadWindow = () => import("./genie-window");
const GenieWindow = dynamic(() =>
  loadWindow().then((module) => module.GenieWindow)
);

const surfaces = ["light", "dark", "lime", "moving"] as const;
const icons = {
  About: IconUser,
  Blog: IconBook,
  Contact: IconMail,
  Experience: IconBriefcase,
  Home: IconHome,
  Projects: IconLayoutKanban,
};

export function DockNavigation({
  pages,
  study = false,
}: {
  pages: Partial<Record<Destination, ReactNode>>;
  study?: boolean;
}) {
  const pathname = usePathname();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const launchTrigger = launch?.trigger;
  const [selected, setSelected] = useState<Destination>("Contact");
  const stage = useRef<HTMLDivElement>(null);
  const tray = useRef<HTMLElement>(null);
  const filterId = `dock-lens-${useId().replace(/:/g, "")}`;
  const [map, setMap] = useState({ height: 1, url: "", width: 1 });
  const [tone, setTone] = useState("light");
  const [refraction, setRefraction] = useState(false);
  const [supported, setSupported] = useState(false);
  const current = links.find(({ hash: href }) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)
  )?.name;

  useEffect(() => {
    setLaunch(null);
  }, [pathname]);

  useEffect(() => {
    if (!(launchTrigger && tray.current)) return;
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const dock = tray.current?.getBoundingClientRect();
        if (!dock) return;
        const rect = launchTrigger.getBoundingClientRect();
        setLaunch((current) =>
          current
            ? {
                ...current,
                dock,
                x: rect.left + rect.width / 2,
                y: dock.top + dock.height / 2,
              }
            : null
        );
      });
    };
    // A viewport resize can precede the responsive tray's final layout.
    const observer = new ResizeObserver(resize);
    observer.observe(tray.current);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [launchTrigger]);

  useEffect(() => {
    // Parsing support alone cannot establish that displacement is rendered.
    const candidate =
      /Chrome|Chromium|Edg\//.test(navigator.userAgent) &&
      CSS.supports("backdrop-filter", 'url("#test")');
    setSupported(candidate);
    setRefraction(candidate);
    const nav = tray.current;
    const scroll = stage.current;
    if (!nav) return;
    let frame = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    let pendingTone = "";
    let settledTone = "";
    const sample = () => {
      if (nav.style.visibility === "hidden") return;
      if (document.hidden) return;
      const { left, top, width, height } = nav.getBoundingClientRect();
      const tones = [0.15, 0.5, 0.85].map((fraction) => {
        const elements = document
          .elementsFromPoint(left + width * fraction, top + height / 2)
          .filter((element) => !nav.contains(element));
        const surface = elements.find((element) =>
          element.hasAttribute("data-dock-surface")
        );
        if (surface)
          return surface.getAttribute("data-dock-surface") || "light";
        // Sample substantial surfaces, not text, badges, buttons or foreground art.
        for (const element of elements) {
          if (element.matches("img, svg, svg *, button, [role=button]"))
            continue;
          const bounds = element.getBoundingClientRect();
          if (bounds.width < width * 0.75 || bounds.height < height * 2)
            continue;
          const css = getComputedStyle(element);
          if (css.backgroundImage.includes("url(")) return "moving";
          const channels = css.backgroundColor.match(/[\d.]+/g)?.map(Number);
          if (channels && channels.length >= 3 && (channels[3] ?? 1) > 0.8) {
            return channels[0] * 0.2126 +
              channels[1] * 0.7152 +
              channels[2] * 0.0722 <
              140
              ? "dark"
              : "light";
          }
        }
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });
      const next = tones.find(
        (value) => tones.filter((tone) => tone === value).length >= 2
      );
      // A split boundary keeps its previous material instead of flashing a third tone.
      if (!next || next === settledTone) {
        clearTimeout(settle);
        pendingTone = "";
        return;
      }
      if (next === pendingTone) return;
      clearTimeout(settle);
      pendingTone = next;
      const commit = () => {
        pendingTone = "";
        if (nav.style.visibility === "hidden") return;
        settledTone = next;
        setTone(next);
      };
      if (settledTone) settle = setTimeout(commit, 140);
      else commit();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sample);
    };
    const resize = new ResizeObserver(() => {
      const width = Math.round(nav.clientWidth);
      const height = Math.round(nav.clientHeight);
      if (!(width && height)) return;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const pixels = ctx.createImageData(width, height);
      const radius = height / 2;
      const bezel = 10;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - Math.max(radius, Math.min(width - radius, x));
          const dy = y - radius;
          const distance = Math.hypot(dx, dy);
          const depth = radius - distance;
          // A bounded convex rim approximation, not Apple's optical formula.
          const bend =
            depth > 0 && depth < bezel
              ? Math.sin((Math.PI * depth) / bezel) * 0.72
              : 0;
          const index = (y * width + x) * 4;
          pixels.data[index] = Math.round(
            128 - (dx / (distance || 1)) * bend * 127
          );
          pixels.data[index + 1] = Math.round(
            128 - (dy / (distance || 1)) * bend * 127
          );
          pixels.data[index + 2] = 128;
          pixels.data[index + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);
      setMap({ height, url: canvas.toDataURL(), width });
      schedule();
    });
    resize.observe(nav);
    scroll?.addEventListener("scroll", schedule, { passive: true });
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      resize.disconnect();
      theme.disconnect();
      scroll?.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [pathname]);

  if (!study && pathname.startsWith("/prototype/")) return null;

  return (
    <div className={study ? styles.study : undefined}>
      {study && (
        <div className={styles.controls}>
          <fieldset
            aria-label="Test backgrounds"
            className={styles.surfaceButtons}
          >
            {surfaces.map((surface) => (
              <button
                key={surface}
                onClick={() => {
                  const target = stage.current?.querySelector<HTMLElement>(
                    `[data-dock-surface="${surface}"]`
                  );
                  if (target && stage.current)
                    stage.current.scrollTo({
                      behavior: matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                        ? "instant"
                        : "smooth",
                      top: target.offsetTop,
                    });
                }}
                type="button"
              >
                {surface}
              </button>
            ))}
          </fieldset>
          <label className={styles.toggle}>
            <input
              checked={refraction}
              disabled={!supported}
              onChange={(event) => setRefraction(event.target.checked)}
              type="checkbox"
            />
            Experimental refraction
          </label>
        </div>
      )}
      <div className={study ? styles.viewport : undefined}>
        {study && (
          <div
            aria-label="Scroll behind the dock"
            className={styles.stage}
            ref={stage}
            tabIndex={0}
          >
            {surfaces.map((surface) => (
              <section
                className={styles.surface}
                data-active={tone === surface}
                data-dock-surface={surface}
                key={surface}
              >
                <div aria-hidden="true" className={styles.art} />
                <div className={styles.surfaceContent}>
                  <h2>
                    {surface === "light"
                      ? "Clarity, in the light."
                      : surface === "dark"
                        ? "Quiet after dark."
                        : surface === "lime"
                          ? "A little more energy."
                          : "A moving backdrop."}
                  </h2>
                  <p>
                    Scroll this surface behind the dock. The material changes;
                    the destinations stay clear.
                  </p>
                </div>
                <span aria-hidden="true" className={styles.specimen}>
                  Aa / 0123456789
                </span>
              </section>
            ))}
          </div>
        )}
        <nav
          aria-label={study ? "Dock preview" : "Primary"}
          className={`${styles.dock} ${study ? "" : styles.fixed}`}
          data-tone={tone}
          ref={tray}
          style={launch ? { visibility: "hidden" } : undefined}
        >
          <div
            aria-hidden="true"
            className={styles.material}
            style={
              refraction && map.url
                ? {
                    backdropFilter: `url("#${filterId}") blur(4px) saturate(1.2)`,
                  }
                : undefined
            }
          />
          {links.map((item) => {
            const Icon = icons[item.name];
            const label = item.name === "Blog" ? "Writing" : item.name;
            return (
              <Link
                aria-current={
                  !study && current === item.name ? "page" : undefined
                }
                aria-label={label}
                className={styles.item}
                href={item.hash}
                key={item.name}
                onClick={async (event) => {
                  if (
                    item.name === "Home" ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                  )
                    return;
                  event.preventDefault();
                  const trigger = event.currentTarget;
                  try {
                    await loadWindow();
                  } catch {
                    window.location.assign(item.hash);
                    return;
                  }
                  if (!(trigger.isConnected && tray.current)) return;
                  const rect = trigger.getBoundingClientRect();
                  setHasOpened(true);
                  setSelected(item.name);
                  if (!study)
                    trackPortfolioEvent("dock_window_open", {
                      destination: item.hash,
                      surface: "dock",
                    });
                  setLaunch({
                    dock: tray.current!.getBoundingClientRect(),
                    filter:
                      refraction && map.url
                        ? `url("#${filterId}") blur(4px) saturate(1.2)`
                        : undefined,
                    tone,
                    trigger,
                    x: rect.left + rect.width / 2,
                    y:
                      tray.current!.getBoundingClientRect().top +
                      tray.current!.offsetHeight / 2,
                  });
                }}
                onPointerEnter={() => {
                  if (item.name !== "Home")
                    void loadWindow().catch(() => undefined);
                }}
                prefetch={false}
              >
                <Icon aria-hidden="true" size={21} stroke={1.65} />
                <span className={styles.label}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {study && (
        <p className={styles.note} role="status">
          {refraction ? "Experimental live-backdrop lens" : "Frosted fallback"}{" "}
          · Surface: {tone}. Select a destination to open its window. The arrow
          in each window opens the dedicated page.
        </p>
      )}
      {hasOpened && (
        <GenieWindow
          launch={launch}
          onDismiss={() => setLaunch(null)}
          onSelect={(name) => {
            setSelected(name);
            const item = links.find((link) => link.name === name);
            if (!study && item)
              trackPortfolioEvent("dock_window_open", {
                destination: item.hash,
                surface: "window-tab",
              });
          }}
          pages={pages}
          selected={selected}
        />
      )}
      <svg aria-hidden="true" className={styles.definitions}>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height={map.height}
            id={filterId}
            width={map.width}
            x="0"
            y="0"
          >
            <feImage
              height={map.height}
              href={map.url || undefined}
              preserveAspectRatio="none"
              result="lens"
              width={map.width}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
