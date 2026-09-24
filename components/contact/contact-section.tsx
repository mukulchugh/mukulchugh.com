"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconVideo,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FluorescentShader } from "@/components/ui/fluorescent-shader";
import { trackPortfolioEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import styles from "./contact-section.module.css";

const Cal = dynamic(
  () => import("@calcom/embed-react").then((m) => m.default),
  { ssr: false }
);

function Calendar({
  theme,
  namespace,
}: {
  theme: "light" | "dark";
  namespace: string;
}) {
  const [status, setStatus] = useState("Loading available times…");
  const [configured, setConfigured] = useState(false);
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    const timer = setTimeout(() => {
      setDelayed(true);
      setStatus("Taking a little longer. You can open the calendar directly.");
    }, 12_000);
    const ready = () => {
      clearTimeout(timer);
      if (!disposed) {
        setStatus("");
        trackPortfolioEvent("booking_ready", { surface: "calendar" });
      }
    };
    const booked = () =>
      trackPortfolioEvent("booking_complete", { surface: "calendar" });
    const failed = () => {
      clearTimeout(timer);
      if (!disposed) {
        trackPortfolioEvent("booking_failed", { surface: "calendar" });
        setDelayed(true);
        setStatus(
          "The calendar couldn’t load. Open it directly or send me an email."
        );
      }
    };
    void import("@calcom/embed-react")
      .then(async ({ getCalApi }) => {
        const cal = await getCalApi({ namespace });
        if (disposed) return;
        cal("on", { action: "linkReady", callback: ready });
        cal("on", { action: "linkFailed", callback: failed });
        cal("on", { action: "bookingSuccessfulV2", callback: booked });
        unsubscribe = () => {
          cal("off", { action: "linkReady", callback: ready });
          cal("off", { action: "linkFailed", callback: failed });
          cal("off", { action: "bookingSuccessfulV2", callback: booked });
        };
        cal("ui", { hideEventTypeDetails: true, layout: "month_view", theme });
        setConfigured(true);
      })
      .catch(failed);
    return () => {
      disposed = true;
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, [theme, namespace]);
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHelp}>
        <p role="status">
          {status || "Choose a day and time that works for you."}
        </p>
        <a
          href="https://cal.com/mukulchugh/15min"
          rel="noopener noreferrer"
          target="_blank"
        >
          Open calendar separately{" "}
          <IconArrowUpRight aria-hidden="true" size={14} />
        </a>
      </div>
      <div
        aria-busy={Boolean(status)}
        className={styles.calendarStage}
        data-analytics-private
      >
        {status && (
          <div
            aria-hidden="true"
            className={styles.loading}
            data-delayed={delayed}
          >
            <span className={styles.loadingMark}>
              <IconVideo size={28} stroke={1.25} />
            </span>
            <p>Your conversation starts here.</p>
            <span>
              {delayed
                ? "Use the calendar link above, or email me."
                : "Connecting to the calendar"}
            </span>
          </div>
        )}
        <div
          className={styles.embed}
          data-ready={!status}
          inert={Boolean(status)}
        >
          {configured && (
            <Cal
              calLink="mukulchugh/15min"
              config={{ layout: "month_view", theme }}
              namespace={namespace}
              style={{ minHeight: 540, width: "100%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactSection({
  id,
  defaultBooking = false,
}: {
  id?: string;
  defaultBooking?: boolean;
}) {
  const instance = `contact-${useId().replace(/:/g, "")}`;
  const { ref } = useSectionInView("Contact");
  const [booking, setBooking] = useState(defaultBooking);
  const [visited, setVisited] = useState(defaultBooking);
  const [copy, setCopy] = useState("");
  const { resolvedTheme } = useTheme();
  const actionRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );
  const close = () => {
    setBooking(false);
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
    <section
      aria-label="Start a conversation"
      className={styles.tile}
      data-booking={booking}
      id={id ?? instance}
      onKeyDown={(event) => {
        if (booking && event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
      ref={ref}
    >
      <div className={styles.statement}>
        <h2>
          What should
          <br />
          we make next?
        </h2>
        <p>
          Bring the idea you keep coming back to.
          <br />
          Let’s see where a conversation takes it.
        </p>
      </div>
      <div className={styles.call}>
        <FluorescentShader active={!booking} className={styles.shader} />
        <header className={styles.callHeader}>
          <IconVideo
            aria-hidden="true"
            className={styles.video}
            stroke={1.25}
          />
          <div className={styles.callCopy}>
            <h3>15 minutes.</h3>
            <p>An idea is enough.</p>
          </div>
          <Button
            aria-controls={`${instance}-calendar`}
            aria-expanded={booking}
            aria-label={
              booking ? "Back to contact options" : "Book a short call"
            }
            className={styles.book}
            onClick={() => {
              if (booking) close();
              else {
                trackPortfolioEvent("booking_open", { surface: "contact" });
                setVisited(true);
                setBooking(true);
              }
            }}
            ref={actionRef}
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
        >
          <div className={styles.revealInner}>
            {visited && (
              <Calendar
                key={resolvedTheme}
                namespace={instance}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.utilities}>
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
  );
}
