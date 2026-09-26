"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconVideo,
} from "@tabler/icons-react";
import type { CSSProperties } from "react";
import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { FluorescentShader } from "@/components/ui/fluorescent-shader";
import { LoadingState } from "@/components/ui/loading-state";
import { trackPortfolioEvent } from "@/lib/analytics";
import { useSectionInView } from "@/lib/hooks";
import { siteConfig } from "@/lib/site-config";
import calendarStyles from "./booking-calendar.module.css";
import styles from "./contact-section.module.css";

// Element-scoped View Transitions (Chrome 147+) aren't in TS's DOM lib yet.
declare global {
  interface Element {
    startViewTransition?: (
      options: StartViewTransitionOptions
    ) => ViewTransition;
  }
}

const BookingCalendar = lazy(() =>
  import("./booking-calendar").then((module) => ({
    default: module.BookingCalendar,
  }))
);

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function readDurationMs(section: HTMLElement) {
  const raw = getComputedStyle(section).getPropertyValue("--duration").trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
}

export function ContactSection({
  id,
  defaultBooking = false,
}: {
  id?: string;
  defaultBooking?: boolean;
}) {
  const instance = `contact-${useId().replace(/:/g, "")}`;
  const vt = (part: string): CSSProperties =>
    ({ viewTransitionName: `${instance}-${part}` }) as CSSProperties;
  const { ref: inViewRef } = useSectionInView("Contact");
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const pendingTransition = useRef<ViewTransition | null>(null);
  const heightAnimation = useRef<Animation | null>(null);
  // Bumped on every applyBooking call so a stale transition's deferred
  // update()/finished handlers can tell they've been superseded and no-op
  // instead of clobbering a newer transition's state or height animation.
  const generation = useRef(0);
  const setSectionRef = (node: HTMLElement | null) => {
    sectionRef.current = node;
    inViewRef(node);
  };
  const [booking, setBooking] = useState(defaultBooking);
  const [visited, setVisited] = useState(defaultBooking);
  const [copy, setCopy] = useState("");
  // The click handler must decide open/close synchronously; `booking` only
  // updates once the view transition's deferred update() callback runs, so
  // rapid re-clicks would otherwise all read the same stale value.
  const bookingRef = useRef(defaultBooking);
  const actionRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const skip = () => {
      pendingTransition.current?.skipTransition();
      heightAnimation.current?.cancel();
    };
    window.addEventListener("resize", skip);
    return () => {
      window.removeEventListener("resize", skip);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      // Invalidate any in-flight transition so its deferred update() can't
      // flushSync into a component that's gone.
      generation.current += 1;
      skip();
    };
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (media.matches) pendingTransition.current?.skipTransition();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const applyBooking = (next: boolean, markVisited?: boolean) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    // Bump for every call (including the immediate/no-transition branch) and
    // settle whatever was previously in flight, so a reduced-motion change
    // or a second rapid click can't let a stale queued update() apply later.
    const myGeneration = ++generation.current;
    pendingTransition.current?.skipTransition();
    heightAnimation.current?.cancel();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!(section?.startViewTransition && frame) || reduceMotion) {
      if (markVisited) setVisited(true);
      setBooking(next);
      if (frame) frame.style.height = "";
      if (section) {
        delete section.dataset.vtActive;
      }
      return;
    }
    // Animate the frame (a plain wrapper), not the tile itself -- the tile
    // is a grid container, so constraining ITS height would resize the
    // `.call`/`.statement` grid rows in lockstep, which can fight or even
    // get resynced into their own native transition geometry (verified:
    // an unrelated computed-style read was enough to trigger it). The
    // frame just clips/holds space; the tile keeps its natural auto height.
    const beforeHeight = frame.getBoundingClientRect().height;
    section.dataset.vtActive = "true";
    const transition = section.startViewTransition({
      update: () => {
        // A newer click superseded this one before the browser got around
        // to running it (skipTransition still runs a queued callback).
        if (generation.current !== myGeneration) return;
        flushSync(() => {
          if (markVisited) setVisited(true);
          setBooking(next);
        });
      },
    });
    pendingTransition.current = transition;
    transition.ready
      .then(() => {
        // Only after `ready` does the tile reflect the true final
        // layout -- creating this animation any earlier (even inside
        // update()) applies its first keyframe immediately and gets
        // captured as part of the "new" snapshot, corrupting it back
        // toward the old height.
        if (generation.current !== myGeneration) return;
        // Read the frame's own natural height (not the section's), since
        // the frame carries the border now and its resting height is a
        // couple of pixels taller than the borderless section inside it --
        // animating to the section's height leaves a visible pop when the
        // inline height clears and the frame reverts to its true natural
        // (border-inclusive) size.
        const afterHeight = frame.getBoundingClientRect().height;
        const anim = frame.animate(
          [{ height: `${beforeHeight}px` }, { height: `${afterHeight}px` }],
          { duration: readDurationMs(section), easing: EASE, fill: "forwards" }
        );
        // Align to the same timeline start as this transition's own
        // pseudo-element animations (scoped to the section, and matched by
        // pseudoElement) so this doesn't trail them by a microtask -- and
        // doesn't accidentally pick up an unrelated, already-running
        // animation elsewhere on the page (e.g. dock/shader/entrance).
        const native = section
          .getAnimations({ subtree: true })
          .find(
            (a) =>
              (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
                "::view-transition"
              ) && typeof a.startTime === "number"
          );
        if (native) anim.startTime = native.startTime;
        heightAnimation.current = anim;
      })
      .catch(() => undefined);
    transition.finished
      .catch(() => undefined)
      .finally(() => {
        if (generation.current !== myGeneration) return;
        heightAnimation.current?.cancel();
        heightAnimation.current = null;
        frame.style.height = "";
        delete section.dataset.vtActive;
        pendingTransition.current = null;
      });
  };
  const close = () => {
    if (!bookingRef.current) return;
    bookingRef.current = false;
    applyBooking(false);
    actionRef.current?.focus({ preventScroll: true });
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email.display);
      trackPortfolioEvent("email_copy", { surface: "contact" });
      setCopy("Copied");
    } catch {
      setCopy("Use the email link to get in touch.");
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopy(""), 2500);
  };
  return (
    <div className={styles.frame} ref={frameRef}>
      <section
        aria-label="Start a conversation"
        className={styles.tile}
        data-booking={booking}
        id={id ?? instance}
        onKeyDown={(event) => {
          if (bookingRef.current && event.key === "Escape") {
            event.stopPropagation();
            close();
          }
        }}
        ref={setSectionRef}
        style={vt("tile")}
      >
        <div className={styles.statement} style={vt("statement")}>
          <h2 style={vt("heading")}>
            What should
            <br />
            we make next?
          </h2>
          <p style={vt("lede")}>
            Bring the idea you keep coming back to.
            <br />
            Let’s see where a conversation takes it.
          </p>
        </div>
        <div className={styles.call} style={vt("call")}>
          <FluorescentShader active={!booking} className={styles.shader} />
          <header className={styles.callHeader}>
            <IconVideo
              aria-hidden="true"
              className={styles.video}
              stroke={1.25}
              style={vt("icon")}
            />
            <div className={styles.callCopy}>
              <h3 style={vt("call-title")}>15 minutes.</h3>
              <p style={vt("call-subtitle")}>An idea is enough.</p>
            </div>
            <Button
              aria-controls={`${instance}-calendar`}
              aria-expanded={booking}
              aria-label={
                booking ? "Back to contact options" : "Book a short call"
              }
              className={styles.book}
              onClick={() => {
                if (bookingRef.current) close();
                else {
                  bookingRef.current = true;
                  trackPortfolioEvent("booking_open", { surface: "contact" });
                  applyBooking(true, true);
                }
              }}
              ref={actionRef}
              style={vt("book")}
              variant="unstyled"
            >
              {booking ? (
                <>
                  <IconArrowLeft aria-hidden="true" />
                  Back
                </>
              ) : (
                <>
                  Book a short call <IconArrowUpRight aria-hidden="true" />
                </>
              )}
            </Button>
          </header>
          <div
            aria-hidden={!booking}
            className={styles.reveal}
            id={`${instance}-calendar`}
            inert={!booking}
            style={vt("reveal")}
          >
            <div className={styles.revealInner}>
              {visited && (
                <Suspense
                  fallback={
                    <LoadingState
                      className={`${styles.calendarLoading} ${calendarStyles.calendar}`}
                      label="Checking available times…"
                      variant="compact"
                    />
                  }
                >
                  <BookingCalendar />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        <div className={styles.utilities} style={vt("utilities")}>
          <a href={`mailto:${siteConfig.email.display}`}>
            {siteConfig.email.display}
          </a>
          <Button
            aria-label="Copy email address"
            onClick={copyEmail}
            size="icon"
            variant="ghost"
          >
            {copy === "Copied" ? <IconCheck /> : <IconCopy />}
          </Button>
          <span className={styles.copyStatus} role="status">
            {copy}
          </span>
        </div>
      </section>
    </div>
  );
}
