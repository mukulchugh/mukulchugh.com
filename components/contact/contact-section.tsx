"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconVideo,
} from "@tabler/icons-react";
import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FluorescentShader } from "@/components/ui/fluorescent-shader";
import { trackPortfolioEvent } from "@/lib/analytics";
import { useSectionInView } from "@/lib/hooks";
import { siteConfig } from "@/lib/site-config";
import calendarStyles from "./booking-calendar.module.css";
import styles from "./contact-section.module.css";

const BookingCalendar = lazy(() =>
  import("./booking-calendar").then((module) => ({
    default: module.BookingCalendar,
  }))
);

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
              <Suspense
                fallback={
                  <p
                    className={`${styles.calendarLoading} ${calendarStyles.calendar}`}
                    role="status"
                  >
                    Checking available times…
                  </p>
                }
              >
                <BookingCalendar />
              </Suspense>
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
