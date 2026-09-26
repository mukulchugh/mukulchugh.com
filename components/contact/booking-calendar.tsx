"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
} from "@tabler/icons-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { trackPortfolioEvent } from "@/lib/analytics";
import styles from "./booking-calendar.module.css";

const calendarLink = "https://cal.com/mukulchugh/15min";
const event = { eventTypeSlug: "15min", username: "mukulchugh" };

function today(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(new Date());
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");
}

export function BookingCalendar() {
  const [zone, setZone] = useState("");
  const [zones, setZones] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState("");
  const [details, setDetails] = useState({
    email: "",
    guests: "",
    name: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<"accepted" | "pending" | null>(null);
  const lock = useRef(false);
  const title = useRef<HTMLHeadingElement>(null);
  const step = result ?? (selected ? "details" : "times");
  const previousStep = useRef(step);

  useEffect(() => {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setZone(localZone);
    setZones(
      Array.from(
        new Set([
          localZone,
          "UTC",
          ...(Intl.supportedValuesOf?.("timeZone") ?? []),
        ])
      )
    );
    setDate(today(localZone));
  }, []);

  useEffect(() => {
    if (!(zone && date)) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let disposed = false;
    setLoading(true);
    setAvailabilityError(false);
    setSlots([]);
    const end = new Date(`${date}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    const params = new URLSearchParams({
      ...event,
      end: end.toISOString().slice(0, 10),
      start: date,
      timeZone: zone,
    });
    void fetch(`https://api.cal.com/v2/slots?${params}`, {
      credentials: "omit",
      headers: { "cal-api-version": "2024-09-04" },
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("availability");
        const body = await response.json();
        if (
          body.status !== "success" ||
          !body.data ||
          typeof body.data !== "object"
        )
          throw new Error("availability");
        const entries = body.data[date] ?? [];
        if (!Array.isArray(entries)) throw new Error("availability");
        const starts = entries.flatMap((slot: unknown) => {
          if (
            !slot ||
            typeof slot !== "object" ||
            !("start" in slot) ||
            typeof slot.start !== "string"
          )
            return [];
          const value = Date.parse(slot.start);
          return Number.isFinite(value) && value > Date.now()
            ? [new Date(value).toISOString()]
            : [];
        });
        if (!disposed) {
          setSlots([...new Set(starts)].sort());
          trackPortfolioEvent("booking_ready", { surface: "calendar" });
        }
      })
      .catch(() => {
        if (!disposed) setAvailabilityError(true);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!disposed) setLoading(false);
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [date, zone, refresh]);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    title.current?.focus({ preventScroll: true });
  }, [step]);

  const time = (start: string) =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: zone,
    }).format(new Date(start));
  const summary =
    selected && zone
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: zone,
        }).format(new Date(selected))
      : "";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current || !selected) return;
    if (!details.name.trim()) {
      setError("Please enter your name before confirming.");
      return;
    }
    const guests = details.guests
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    if (guests.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError("Use a valid email for each guest, separated by commas.");
      return;
    }
    lock.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch("https://api.cal.com/v2/bookings", {
        body: JSON.stringify({
          ...event,
          attendee: {
            email: details.email.trim(),
            language: "en",
            name: details.name.trim(),
            timeZone: zone,
          },
          bookingFieldsResponses: { notes: details.notes.trim() },
          guests,
          start: selected,
        }),
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "cal-api-version": "2026-02-25",
        },
        method: "POST",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(20_000),
      });
      if (response.status >= 500) throw new Error("unconfirmed");
      if (!response.ok) {
        trackPortfolioEvent("booking_failed", { surface: "calendar" });
        if (response.status === 409) {
          setError(
            "That time is no longer available. Choose another time; your details are saved here."
          );
          setSelected("");
          setRefresh((value) => value + 1);
        } else {
          setError(
            "Cal couldn’t complete this request. Check your details, choose another time, or use the calendar link below."
          );
        }
        return;
      }
      const body = await response.json();
      if (
        body.status !== "success" ||
        !body.data?.uid ||
        !["accepted", "pending"].includes(body.data?.status)
      )
        throw new Error("unconfirmed");
      setResult(body.data.status);
      trackPortfolioEvent("booking_complete", { surface: "calendar" });
    } catch {
      setError(
        "We couldn’t confirm the result. Check your email before trying again to avoid booking twice."
      );
      trackPortfolioEvent("booking_failed", { surface: "calendar" });
    } finally {
      lock.current = false;
      setSending(false);
    }
  }

  return (
    <div className={styles.calendar} data-analytics-private>
      <div className={styles.stage} key={step}>
        <h4 ref={title} tabIndex={-1}>
          {result === "accepted"
            ? "See you soon."
            : result === "pending"
              ? "Your request is in."
              : selected
                ? "Make it a conversation."
                : "Find a moment."}
        </h4>
        <p className={styles.hint}>
          {selected
            ? `${summary} · ${zone} · 15 minutes`
            : "15 minutes with Mukul on Google Meet. Times are shown in your timezone."}
        </p>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {result ? (
          <div className={styles.confirmation} role="status">
            <IconCheck aria-hidden="true" size={28} />
            <p>
              {result === "accepted"
                ? "You’re booked. Check your email for the invitation and meeting link."
                : "The time is awaiting confirmation. Check your email for updates."}
            </p>
          </div>
        ) : selected ? (
          <form className={styles.form} onSubmit={submit}>
            <fieldset disabled={sending}>
              <label>
                Your name
                <input
                  autoComplete="name"
                  maxLength={120}
                  name="name"
                  onChange={(e) =>
                    setDetails({ ...details, name: e.target.value })
                  }
                  required
                  value={details.name}
                />
              </label>
              <label>
                Email address
                <input
                  autoComplete="email"
                  maxLength={254}
                  name="email"
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                  required
                  type="email"
                  value={details.email}
                />
              </label>
              <label>
                What’s on your mind? <span>Optional</span>
                <textarea
                  maxLength={2000}
                  name="notes"
                  onChange={(e) =>
                    setDetails({ ...details, notes: e.target.value })
                  }
                  rows={3}
                  value={details.notes}
                />
              </label>
              <details>
                <summary>Add guests</summary>
                <label>
                  Guest emails <span>Separate with commas</span>
                  <input
                    maxLength={1500}
                    name="guests"
                    onChange={(e) =>
                      setDetails({ ...details, guests: e.target.value })
                    }
                    value={details.guests}
                  />
                </label>
              </details>
            </fieldset>
            <p className={styles.hint}>
              Booking details are sent to Cal.com.{" "}
              <a
                href="https://cal.com/privacy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Privacy
              </a>{" "}
              ·{" "}
              <a
                href="https://cal.com/terms"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms
              </a>
            </p>
            <div className={styles.actions}>
              <Button
                disabled={sending}
                onClick={() => {
                  setSelected("");
                  setError("");
                  setRefresh((value) => value + 1);
                }}
                type="button"
                variant="ghost"
              >
                <IconArrowLeft aria-hidden="true" /> Change time
              </Button>
              <Button disabled={sending} type="submit">
                {sending ? "Confirming…" : "Confirm booking"}
              </Button>
            </div>
            <span className="sr-only" role="status">
              {sending ? "Sending your booking request." : ""}
            </span>
          </form>
        ) : (
          <>
            <div className={styles.controls}>
              <label>
                Date
                <input
                  min={zone ? today(zone) : undefined}
                  onChange={(e) => {
                    if (e.target.value) setDate(e.target.value);
                  }}
                  required
                  type="date"
                  value={date}
                />
              </label>
              <label>
                Timezone
                <select
                  onChange={(e) => {
                    const nextZone = e.target.value;
                    setZone(nextZone);
                    if (date < today(nextZone)) setDate(today(nextZone));
                  }}
                  value={zone}
                >
                  {zones.map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div aria-busy={loading} className={styles.availability}>
              {loading ? (
                <LoadingState
                  label="Checking available times…"
                  variant="compact"
                />
              ) : (
                <p role="status">
                  {availabilityError
                    ? "Available times couldn’t load. Try again or open the calendar below."
                    : slots.length
                      ? "Choose your start time."
                      : "No times available on this date. Try another day."}
                </p>
              )}
              {availabilityError && (
                <Button
                  onClick={() => setRefresh((value) => value + 1)}
                  variant="outline"
                >
                  Try again
                </Button>
              )}
              {!loading && (
                <div className={styles.times}>
                  {slots.map((start) => (
                    <Button
                      key={start}
                      onClick={() => {
                        setSelected(start);
                        setError("");
                      }}
                      variant="outline"
                    >
                      {time(start)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <a
        className={styles.fallback}
        href={calendarLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open calendar separately{" "}
        <IconArrowUpRight aria-hidden="true" size={14} />
      </a>
    </div>
  );
}
