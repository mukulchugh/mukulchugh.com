"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBook,
  IconList,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconVolume,
  IconVolumeOff,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dock from "@/components/navigation/dock.module.css";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import styles from "./story.module.css";
import {
  artifacts,
  beatAt,
  beatPhase,
  beats,
  chapters,
  clampProgress,
  FIRST_YEAR,
  LAST_YEAR,
  playbackTimeForPosition,
  positionForPlaybackTime,
  positionForScroll,
  positionForYear,
  scrollForPosition,
  yearAt,
} from "./story-data";
import type { createStoryScene } from "./story-scene";

type Panel = "year" | "chapters" | "read" | "artifact" | null;

function WrittenStory({ primary = false }: { primary?: boolean }) {
  const Heading = primary ? "h1" : "h2";
  return (
    <>
      <Heading>The screen stayed on.</Heading>
      <p className={styles.readerIntro}>From Rudrapur to here, 2004–2026.</p>
      {beats.map((beat, index) => (
        <section id={`memory-${index}`} key={beat.position}>
          <h3>{beat.title.replace("\n", " ")}</h3>
          <p className={styles.date}>{beat.caption}</p>
          <p>{beat.reading}</p>
          {beat.project && <Link href={beat.project}>Explore the project</Link>}
        </section>
      ))}
      <section>
        <h3>About these memories</h3>
        <p>
          This story combines my memories with surviving public pages and career
          records. Childhood scenes and the people, rooms, vehicles and hardware
          are illustrations. The search screen suggests an early memory; website
          captures link to their originals.
        </p>
        <p>
          Childhood memories span 2004–2010. School years are estimated from
          finishing Class 12 in 2019. Blogger’s June 2012 date records
          membership. HeroApp’s records support 2021–2022 with differing months.
          The 2023 talk was uploaded later that year; KubeCon 2024 was a booth
          appearance. The college departure illustrates the move to Bangalore,
          without assigning a graduation date.
        </p>
        <p>
          HuntIT and SPARK were live, in-person events. HuntIT’s 70 teams are
          separate from SPARK’s attendance. SPARK belongs to the start of Class
          12; its exact calendar year is uncertain. Event layouts, clue sheets
          and participants are illustrated, with no invented riddles or
          sponsors.
        </p>
        <p>
          About 200 describes community membership. Octane sales survive in the
          record, but a total does not. The roughly US$100 AdSense payout is an
          approximate memory from my early blogging years, separate from theme
          sales. Altr and Tethr appear through their public project pages; their
          current stages are early access and private alpha. The original
          opening memory is preserved above in my own words.
        </p>
        {artifacts.map((artifact) => (
          <p key={artifact.source}>
            <a href={artifact.source} rel="noreferrer" target="_blank">
              {artifact.title} · {artifact.date}{" "}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </p>
        ))}
      </section>
    </>
  );
}

export default function StoryExperience() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [yearInput, setYearInput] = useState("2004");
  const [yearError, setYearError] = useState("");
  const [artifactIndex, setArtifactIndex] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLElement>(null);
  const engine = useRef<ReturnType<typeof createStoryScene> | null>(null);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const copyRef = useRef<HTMLDivElement>(null);
  const artifactRef = useRef<HTMLButtonElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const visibleState = useRef("");
  const rangeRef = useRef({ distance: 1, top: 0 });
  const modal = useRef<HTMLDialogElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const immersive = mounted && !reduce && !failed;
  const index = beatAt(progress);
  const beat = beats[index];
  const year = yearAt(progress);
  const last = progress >= 0.985;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!(immersive && host.current)) return;
    let cancelled = false;
    let instance: ReturnType<typeof createStoryScene> | null = null;
    setReady(false);
    import("./story-scene")
      .then(({ createStoryScene: create }) => {
        if (cancelled || !host.current) return;
        instance = create(host.current, () => {
          if (!cancelled) {
            setFailed(true);
            setPlaying(false);
          }
        });
        engine.current = instance;
        instance.seek(progressRef.current);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      instance?.dispose();
      engine.current = null;
    };
  }, [immersive]);

  function updatePosition(value: number) {
    const p = clampProgress(value);
    progressRef.current = p;
    const beatIndex = beatAt(p);
    const next = beats[beatIndex + 1];
    const phase = beatPhase(p, beatIndex);
    const arrival = beatIndex === 0 ? 1 : clampProgress(phase / 0.2);
    const departure = next ? clampProgress((1 - phase) / 0.2) : 1;
    const style = copyRef.current?.style;
    style?.setProperty("--arrival", String(1 - (1 - arrival) ** 3));
    style?.setProperty("--departure", String(departure));
    style?.setProperty(
      "--copy-offset",
      `${(1 - arrival) * 42 - (1 - departure) * 24}px`
    );
    style?.setProperty("--intro", "0");
    if (ticksRef.current)
      ticksRef.current.style.transform = `translateX(${-(21 + p * 66) * 8}px)`;
    if (sliderRef.current)
      sliderRef.current.value = String(Math.round(p * 1000));
    // React owns chapter content; refs own the continuously scrubbed pose.
    const state = `${beatIndex}:${yearAt(p)}:${p >= 0.985}:${p < 0.035}:${p < 0.005}`;
    if (state !== visibleState.current) {
      visibleState.current = state;
      const focused = document.activeElement;
      const focusWillLeave =
        focused instanceof HTMLElement &&
        ((beats[beatIndex].artifact === undefined &&
          focused === artifactRef.current) ||
          (focused.matches("[data-story-project]") &&
            focused.getAttribute("href") !== beats[beatIndex].project) ||
          (focused.closest("[data-story-ending]") &&
            beats[beatIndex].id !== "still-building"));
      if (focusWillLeave)
        copyRef.current?.querySelector("h1")?.focus({ preventScroll: true });
      setProgress(p);
    }
    engine.current?.seek(p);
  }

  function seek(position: number, updateHistory = true) {
    playingRef.current = false;
    setPlaying(false);
    const p = clampProgress(position);
    updatePosition(p);
    window.scrollTo({
      behavior: "instant",
      top:
        rangeRef.current.top +
        Math.ceil(scrollForPosition(p) * rangeRef.current.distance),
    });
    if (updateHistory)
      window.history.replaceState(
        window.history.state,
        "",
        `#year=${yearAt(p)}`
      );
  }

  useEffect(() => {
    if (!(immersive && journey.current)) return;
    let frame = 0;
    let previousTime = 0;
    let settled: ReturnType<typeof setTimeout> | undefined;
    function measure() {
      if (!journey.current) return;
      rangeRef.current = {
        distance: Math.max(
          1,
          journey.current.offsetHeight - window.innerHeight
        ),
        top: journey.current.offsetTop,
      };
    }
    function sample(time = performance.now()) {
      frame = 0;
      if (playingRef.current) return;
      const target = positionForScroll(
        (window.scrollY - rangeRef.current.top) / rangeRef.current.distance
      );
      const elapsed = Math.min(64, previousTime ? time - previousTime : 16);
      previousTime = time;
      const gap = target - progressRef.current;
      const p =
        Math.abs(gap) < 0.000_015
          ? target
          : progressRef.current + gap * (1 - Math.exp(-elapsed / 85));
      updatePosition(p);
      if (p === target) previousTime = 0;
      else frame = requestAnimationFrame(sample);
      clearTimeout(settled);
      settled = setTimeout(
        () =>
          window.history.replaceState(
            window.history.state,
            "",
            `#year=${yearAt(p)}`
          ),
        180
      );
    }
    function scroll() {
      if (!(frame || playingRef.current)) frame = requestAnimationFrame(sample);
    }
    function resize() {
      // Preserve the actual scroll position, never the lagging camera pose.
      const p = positionForScroll(
        (window.scrollY - rangeRef.current.top) / rangeRef.current.distance
      );
      measure();
      window.scrollTo({
        behavior: "instant",
        top:
          rangeRef.current.top +
          Math.ceil(scrollForPosition(p) * rangeRef.current.distance),
      });
    }
    function restore() {
      const match = /^#year=(\d{4})$/.exec(window.location.hash);
      const target = match ? positionForYear(Number(match[1])) : null;
      if (target === null) sample();
      else seek(target, false);
    }
    const cancel = () => {
      playingRef.current = false;
      setPlaying(false);
    };
    const interactive = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("button, a, input, select, textarea, dialog"));
    const cancelTouch = (event: TouchEvent) => {
      if (!interactive(event.target)) cancel();
    };
    const cancelKey = (event: KeyboardEvent) => {
      if (
        !interactive(event.target) &&
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        cancel();
    };
    measure();
    restore();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancelTouch, { passive: true });
    window.addEventListener("keydown", cancelKey);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancelTouch);
      window.removeEventListener("keydown", cancelKey);
    };
  }, [immersive]);

  useEffect(() => {
    playingRef.current = playing && immersive;
    if (!playingRef.current) return;
    let frame = 0;
    const started = performance.now();
    const startTime = playbackTimeForPosition(progressRef.current);
    const step = (time: number) => {
      if (!playingRef.current) return;
      const p = positionForPlaybackTime(startTime + time - started);
      updatePosition(p);
      window.scrollTo({
        behavior: "instant",
        top:
          rangeRef.current.top +
          Math.ceil(scrollForPosition(p) * rangeRef.current.distance),
      });
      if (p >= 1) {
        playingRef.current = false;
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      playingRef.current = false;
      cancelAnimationFrame(frame);
    };
  }, [playing, immersive]);

  useEffect(() => {
    const pause = () => {
      if (!document.hidden) return;
      setPlaying(false);
      setSound(false);
      void audio.current?.close();
      audio.current = null;
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      document.removeEventListener("visibilitychange", pause);
      void audio.current?.close();
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    if (!immersive) {
      setPlaying(false);
      setSound(false);
      void audio.current?.close();
      audio.current = null;
    }
  }, [immersive]);

  useEffect(() => {
    if (!modal.current) return;
    if (panel) {
      setPlaying(false);
      if (!modal.current.open) modal.current.showModal();
      if (panel === "year")
        modal.current.querySelector<HTMLInputElement>("input")?.focus();
      else
        modal.current.querySelector<HTMLElement>("#story-panel-title")?.focus();
    } else if (modal.current.open) modal.current.close();
  }, [panel]);

  async function toggleSound() {
    if (audio.current) {
      await audio.current.close();
      audio.current = null;
      setSound(false);
      return;
    }
    try {
      const context = new AudioContext();
      audio.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 90;
      gain.gain.value = 0.014;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      await context.resume();
      setSound(true);
      setSoundError("");
    } catch {
      void audio.current?.close();
      audio.current = null;
      setSound(false);
      setSoundError(
        "Sound is unavailable. You can still explore the complete story."
      );
    }
  }

  function openYear() {
    setYearInput(String(year));
    setYearError("");
    setPanel("year");
  }
  function submitYear(event: React.FormEvent) {
    event.preventDefault();
    const value = /^\d{4}$/.test(yearInput.trim())
      ? Number(yearInput)
      : Number.NaN;
    const position = positionForYear(value);
    if (position === null) {
      setYearError("Choose a year from 2004 to 2026.");
      return;
    }
    setPanel(null);
    seek(position);
  }

  return (
    <main
      className={styles.story}
      data-mode={mounted ? (immersive ? "immersive" : "reading") : "pending"}
      id="top"
    >
      <header className={styles.header}>
        <Link
          aria-label="Back to Mukul's portfolio"
          className={styles.home}
          href="/"
        >
          <Image
            alt=""
            height={40}
            priority
            src="/design/brand/logo-black.webp"
            width={40}
          />
        </Link>
        {immersive && (
          <div aria-hidden="true" className={styles.ruler}>
            <div className={styles.tickWindow}>
              <div className={styles.ticks} ref={ticksRef}>
                {Array.from({ length: 109 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <i className={styles.timeMarker} />
            </div>
            <span>{year}</span>
          </div>
        )}
      </header>

      {immersive && (
        <section
          aria-label="Interactive memories"
          className={styles.journey}
          ref={journey}
        >
          <div className={styles.viewport} data-ready={ready}>
            <div aria-hidden="true" className={styles.canvas} ref={host} />
            {!ready && (
              <p className={styles.loading} role="status">
                Opening the memory…
              </p>
            )}
            <div
              className={styles.copy}
              data-prologue={index === 0}
              data-story-copy
              ref={copyRef}
            >
              <h1 tabIndex={-1}>
                {beat.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className={styles.description}>{beat.text}</p>
              <p className={styles.caption}>{beat.caption}</p>
              <div className={styles.artifactActions}>
                {beat.artifact !== undefined && (
                  <button
                    className={styles.artifactLink}
                    onClick={() => {
                      setArtifactIndex(beat.artifact ?? 0);
                      setPanel("artifact");
                    }}
                    ref={artifactRef}
                    type="button"
                  >
                    Open the original page{" "}
                    <IconArrowUpRight aria-hidden size={17} />
                  </button>
                )}
                {beat.project && (
                  <Link
                    className={styles.artifactLink}
                    data-story-project
                    href={beat.project}
                  >
                    Explore {beat.artifact === 5 ? "Altr" : "Tethr"}{" "}
                    <IconArrowUpRight aria-hidden size={17} />
                  </Link>
                )}
              </div>
              {last && (
                <div className={styles.ending} data-story-ending>
                  <div className={styles.endingActions}>
                    <Link href="/projects">
                      Explore my work <IconArrowUpRight aria-hidden size={16} />
                    </Link>
                    <Link href="/contact">
                      Let’s talk <IconArrowUpRight aria-hidden size={16} />
                    </Link>
                    <button onClick={() => seek(0)} type="button">
                      <IconArrowLeft aria-hidden size={16} /> Back to 2004
                    </button>
                  </div>
                  <p>It started with my dad.</p>
                </div>
              )}
            </div>
            <div className={styles.bottomNote}>
              <button onClick={() => setPanel("read")} type="button">
                <IconBook aria-hidden size={15} /> Read the memories
              </button>
              <span>2004–2026</span>
            </div>
          </div>
        </section>
      )}

      {!mounted && (
        <p className={styles.pending} role="status">
          Opening the memory…
        </p>
      )}
      {!immersive && (
        <article className={styles.reading}>
          {failed && (
            <div className={styles.fallback} role="status">
              <p>The 3D view couldn't open. The story is here to read.</p>
              <button onClick={() => setFailed(false)} type="button">
                Try the 3D view again
              </button>
            </div>
          )}
          {mounted && reduce && (
            <p className={styles.modeNote}>
              Motion is reduced. All the memories are available below.
            </p>
          )}
          <WrittenStory primary />
          <Link className={styles.back} href="/">
            Back to portfolio <IconArrowUpRight aria-hidden size={16} />
          </Link>
        </article>
      )}

      {immersive && (
        <>
          <p aria-live="polite" className="sr-only">
            {chapters[beat.chapter].title}, {chapters[beat.chapter].years}
          </p>
          <div className={styles.dockArea}>
            <p className={styles.hint} data-ending={last}>
              {last
                ? "The screen stayed on."
                : progress < 0.035
                  ? "Scroll to descend · press play to follow"
                  : "Scroll to explore · drag to travel"}
            </p>
            <nav
              aria-label="Story controls"
              className={`${dock.dock} ${styles.controller}`}
              data-tone="dark"
            >
              <div aria-hidden className={`${dock.material} ${styles.glass}`} />
              <button
                aria-label="Previous chapter"
                className={`${styles.control} ${styles.previous}`}
                disabled={progress < 0.005}
                onClick={() => {
                  const previous = [...chapters]
                    .reverse()
                    .find(
                      (chapter) =>
                        chapter.position < progressRef.current - 0.025
                    );
                  seek(previous?.position ?? 0);
                }}
                title="Previous chapter"
                type="button"
              >
                <IconPlayerSkipBack aria-hidden size={21} stroke={1.5} />
              </button>
              <button
                aria-label={playing ? "Pause journey" : "Play journey"}
                className={`${styles.control} ${styles.play}`}
                onClick={() => {
                  if (last) seek(0);
                  setPlaying(!playing);
                }}
                title={playing ? "Pause" : "Play the journey"}
                type="button"
              >
                {playing ? (
                  <IconPlayerPauseFilled aria-hidden size={19} />
                ) : (
                  <IconPlayerPlayFilled aria-hidden size={19} />
                )}
              </button>
              <div className={styles.timeControl}>
                <button
                  aria-label={`Insert a year, currently ${year}`}
                  className={styles.year}
                  onClick={openYear}
                  title="Insert a year"
                  type="button"
                >
                  {year}
                </button>
                <input
                  aria-label="Travel through the years"
                  aria-valuetext={`${year}${year > 2004 && year <= 2010 ? ", within the 2004 to 2010 childhood memories" : ""}`}
                  className={styles.slider}
                  defaultValue={0}
                  max={1000}
                  min={0}
                  onChange={(event) => seek(Number(event.target.value) / 1000)}
                  onKeyDown={(event) => {
                    let target: number | null = null;
                    if (["ArrowLeft", "ArrowDown"].includes(event.key))
                      target = positionForYear(Math.max(FIRST_YEAR, year - 1));
                    if (["ArrowRight", "ArrowUp"].includes(event.key))
                      target = positionForYear(Math.min(LAST_YEAR, year + 1));
                    if (event.key === "PageDown")
                      target =
                        chapters.find(
                          (chapter) =>
                            chapter.position > progressRef.current + 0.001
                        )?.position ?? 1;
                    if (event.key === "PageUp")
                      target =
                        [...chapters]
                          .reverse()
                          .find(
                            (chapter) =>
                              chapter.position < progressRef.current - 0.001
                          )?.position ?? 0;
                    if (event.key === "Home") target = 0;
                    if (event.key === "End") target = 1;
                    if (target !== null) {
                      event.preventDefault();
                      seek(target);
                    }
                  }}
                  ref={sliderRef}
                  step={1}
                  type="range"
                />
                <span className={styles.endYear}>{LAST_YEAR}</span>
              </div>
              <button
                aria-label="Next chapter"
                className={`${styles.control} ${styles.next}`}
                disabled={last}
                onClick={() =>
                  seek(
                    chapters.find(
                      (chapter) =>
                        chapter.position > progressRef.current + 0.025
                    )?.position ?? 1
                  )
                }
                title="Next chapter"
                type="button"
              >
                <IconPlayerSkipForward aria-hidden size={21} stroke={1.5} />
              </button>
              <button
                aria-label={sound ? "Mute sound" : "Enable sound"}
                aria-pressed={sound}
                className={`${styles.control} ${styles.sound}`}
                onClick={toggleSound}
                title={sound ? "Mute sound" : "Enable sound"}
                type="button"
              >
                {sound ? (
                  <IconVolume aria-hidden size={22} stroke={1.5} />
                ) : (
                  <IconVolumeOff aria-hidden size={22} stroke={1.5} />
                )}
              </button>
              <button
                aria-label="Choose a chapter"
                className={`${styles.control} ${styles.chapters}`}
                onClick={() => setPanel("chapters")}
                title="Chapters"
                type="button"
              >
                <IconList aria-hidden size={22} stroke={1.5} />
              </button>
            </nav>
            {soundError && (
              <p className={styles.soundError} role="status">
                {soundError}
              </p>
            )}
          </div>
        </>
      )}

      <dialog
        aria-labelledby="story-panel-title"
        className={styles.dialog}
        onCancel={() => setPanel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
        onClose={() => setPanel(null)}
        ref={modal}
      >
        <div className={styles.dialogContent}>
          <button
            aria-label="Close"
            className={styles.close}
            onClick={() => setPanel(null)}
            type="button"
          >
            <IconX aria-hidden size={24} />
          </button>
          {panel === "year" && (
            <form noValidate onSubmit={submitYear}>
              <h2 id="story-panel-title" tabIndex={-1}>
                Where shall we go?
              </h2>
              <p>Choose any year from the beginning to today.</p>
              <label className={styles.yearLabel} htmlFor="story-year">
                Year, 2004–2026
              </label>
              <div className={styles.yearForm}>
                <input
                  aria-describedby={yearError ? "story-year-error" : undefined}
                  aria-invalid={Boolean(yearError)}
                  autoComplete="off"
                  id="story-year"
                  inputMode="numeric"
                  maxLength={4}
                  onChange={(event) => {
                    setYearInput(event.target.value);
                    setYearError("");
                  }}
                  value={yearInput}
                />
                <button type="submit">
                  Go <IconArrowUpRight aria-hidden size={20} />
                </button>
              </div>
              {yearError && (
                <p className={styles.error} id="story-year-error" role="alert">
                  {yearError}
                </p>
              )}
            </form>
          )}
          {panel === "chapters" && (
            <>
              <h2 id="story-panel-title" tabIndex={-1}>
                One continuous story.
              </h2>
              <p>2004–2026. Twelve chapters, one growing world.</p>
              <ol className={styles.chapterList}>
                {chapters.map((chapter, i) => (
                  <li key={chapter.position}>
                    <button
                      aria-current={beat.chapter === i ? "step" : undefined}
                      onClick={() => {
                        setPanel(null);
                        seek(chapter.position);
                      }}
                      type="button"
                    >
                      <span>{chapter.years}</span>
                      <strong>{chapter.title}</strong>
                      <IconArrowUpRight aria-hidden size={20} />
                    </button>
                  </li>
                ))}
              </ol>
              <button
                className={styles.readLink}
                onClick={() => setPanel("read")}
                type="button"
              >
                <IconBook aria-hidden size={17} /> Read without travelling
              </button>
            </>
          )}
          {panel === "read" && (
            <div className={styles.readerDialog}>
              <span className="sr-only" id="story-panel-title" tabIndex={-1}>
                Read the story
              </span>
              <WrittenStory />
            </div>
          )}
          {panel === "artifact" && (
            <>
              <h2 id="story-panel-title" tabIndex={-1}>
                {artifacts[artifactIndex].title}
              </h2>
              <p>{artifacts[artifactIndex].date}</p>
              <Image
                alt={`${artifacts[artifactIndex].title} page capture`}
                className={styles.archiveImage}
                height={1800}
                src={artifacts[artifactIndex].image}
                unoptimized
                width={2880}
              />
              <p>{artifacts[artifactIndex].description}</p>
              <a
                className={styles.sourceLink}
                href={artifacts[artifactIndex].source}
                rel="noreferrer"
                target="_blank"
              >
                View source page <IconArrowUpRight aria-hidden size={17} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </>
          )}
        </div>
      </dialog>
    </main>
  );
}
