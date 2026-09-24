"use client";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import dockStyles from "@/components/navigation/dock.module.css";
import { Button } from "@/components/ui/button";
import { trackPortfolioEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/data";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { opponentState, updateDemoPlayer, updateOpponent } from "./opponent";
import { clamp, H, initial, move, step, W } from "./physics";
import styles from "./rebound.module.css";

export function Rebound() {
  const shell = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const gameDock = useRef<HTMLElement>(null);
  const transition = useRef(false);
  const pendingExit = useRef(false);
  const nativeFullscreen = useRef(false);
  const returnBounds = useRef<DOMRect | null>(null);
  const dockBounds = useRef<DOMRect | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const helpId = useId();
  const vertical = useRef(false);
  const field = useRef<HTMLDivElement>(null);
  const sprites = useRef<Array<HTMLElement | null>>([]);
  const game = useRef(initial());
  const brain = useRef(opponentState());
  const demoBrain = useRef(opponentState(73));
  const demo = useRef(true);
  const demoStopped = useRef(false);
  const [demoPaused, setDemoPaused] = useState(false);
  const reduceDemo = useRef(true);
  const target = useRef({ x: 240, y: H / 2 });
  const keys = useRef(new Set<string>());
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
  } | null>(null);
  const running = useRef(false);
  const serveIn = useRef(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const shownCount = useRef<number | null>(null);
  function showCount(value: number | null) {
    if (shownCount.current === value) return;
    shownCount.current = value;
    setCountdown(value);
  }
  const score = useRef([0, 0]);
  const [scores, setScores] = useState([0, 0]);
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("First to five. You’re lime.");
  const reduced = useReducedMotion();
  const speedFactor = useRef(1);
  const render = useRef(() => {
    /* Assigned after mount. */
  });
  async function animateExpansion(entering: boolean) {
    const rink = field.current;
    if (!rink || reduced) return;
    const from = returnBounds.current;
    const to = rink.getBoundingClientRect();
    if (!(from && to.width)) return;
    const rotated = from.width > from.height !== to.width > to.height;
    const transform = rotated
      ? `translate(${from.left + from.width / 2 - to.left - to.width / 2}px, ${from.top + from.height / 2 - to.top - to.height / 2}px) rotate(-90deg) scale(${from.width / to.height})`
      : `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    const transformOrigin = rotated ? "50% 50%" : "0 0";
    const animation = rink.animate(
      [
        { transform, transformOrigin },
        { transform: "none", transformOrigin },
      ],
      {
        direction: entering ? "normal" : "reverse",
        duration: 420,
        easing: "cubic-bezier(.22,1,.36,1)",
      }
    );
    const dock = gameDock.current;
    if (dock && dockBounds.current) {
      const old = dockBounds.current;
      const next = dock.getBoundingClientRect();
      dock.animate(
        [
          {
            opacity: 0.3,
            transform: `translate(${old.x + old.width / 2 - next.x - next.width / 2}px, ${old.y - next.y}px) scaleX(${old.width / next.width})`,
          },
          { opacity: 1, transform: "none" },
        ],
        {
          direction: entering ? "normal" : "reverse",
          duration: 420,
          easing: "cubic-bezier(.22,1,.36,1)",
        }
      );
    }
    await animation.finished.catch(() => {
      /* Cancellation is safe on unmount. */
    });
  }
  async function expand() {
    if (transition.current || !card.current || !shell.current) return;
    trackPortfolioEvent("game_fullscreen", { surface: "rebound" });
    transition.current = true;
    returnBounds.current = field.current!.getBoundingClientRect();
    dockBounds.current =
      document
        .querySelector('nav[aria-label="Primary"]')
        ?.getBoundingClientRect() ?? null;
    if (slot.current)
      slot.current.style.height = `${card.current.getBoundingClientRect().height}px`;
    flushSync(() => setExpanded(true));
    shell.current.showModal();
    // Fullscreen cannot target a dialog. Its persistent game section is eligible.
    try {
      if (document.fullscreenEnabled && card.current.requestFullscreen) {
        await card.current.requestFullscreen({ navigationUI: "hide" });
        nativeFullscreen.current = true;
      }
    } catch {
      // The modal still supplies edge-to-edge play if fullscreen is unavailable.
    }
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    if (!card.current) return;
    render.current();
    await animateExpansion(true);
    transition.current = false;
    if (pendingExit.current) {
      pendingExit.current = false;
      void collapse();
      return;
    }
    (running.current
      ? sprites.current[0]
      : gameDock.current?.querySelector("button")
    )?.focus({ preventScroll: true });
  }
  async function collapse() {
    if (transition.current) {
      pendingExit.current = true;
      return;
    }
    if (!shell.current?.open) return;
    transition.current = true;
    nativeFullscreen.current = false;
    if (document.fullscreenElement === card.current) {
      await document.exitFullscreen().catch(() => {
        /* The browser may have already exited. */
      });
    }
    await animateExpansion(false);
    shell.current?.close();
    flushSync(() => {
      setExpanded(false);
      setConfirmRestart(false);
    });
    if (slot.current) slot.current.style.height = "";
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    render.current();
    transition.current = false;
    pendingExit.current = false;
    expandButton.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!expanded) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onFullscreenChange = () => {
      if (nativeFullscreen.current && !document.fullscreenElement)
        void collapse();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [expanded]);
  useEffect(() => {
    if (confirmRestart)
      card.current
        ?.querySelector<HTMLButtonElement>("[data-restart-confirm]")
        ?.focus();
  }, [confirmRestart]);
  function pointerPosition(clientX: number, clientY: number) {
    const box = field.current!.getBoundingClientRect();
    return vertical.current
      ? {
          x: W - ((clientY - box.top) * H) / box.width,
          y: ((clientX - box.left) * H) / box.width,
        }
      : {
          x: ((clientX - box.left) * W) / box.width,
          y: ((clientY - box.top) * W) / box.width,
        };
  }
  function pause() {
    running.current = false;
    keys.current.clear();
    drag.current = null;
    setStatus((s) => (s === "playing" || s === "goal" ? "paused" : s));
  }
  function start() {
    if (vertical.current && !expanded)
      field.current
        ?.closest("section")
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    if (demo.current) {
      trackPortfolioEvent("game_start", { surface: "rebound" });
      demo.current = false;
      game.current = initial();
      target.current = { x: 240, y: H / 2 };
      showCount(null);
      brain.current = opponentState(Math.floor(Math.random() * 4_294_967_296));
      render.current();
    }
    if (score.current.some((s) => s >= 5)) {
      score.current = [0, 0];
      setScores([0, 0]);
      game.current = initial();
      brain.current = opponentState(Math.floor(Math.random() * 4_294_967_296));
    }
    running.current = true;
    setStatus(serveIn.current > 0 ? "goal" : "playing");
    if (serveIn.current === 0) setMessage("Move to defend. Flick to score.");
    sprites.current[0]?.focus({ preventScroll: true });
  }
  function reset() {
    demo.current = false;
    setConfirmRestart(false);
    serveIn.current = 3;
    showCount(3);
    running.current = true;
    game.current = initial();
    brain.current = opponentState(Math.floor(Math.random() * 4_294_967_296));
    target.current = { x: 240, y: H / 2 };
    keys.current.clear();
    drag.current = null;
    score.current = [0, 0];
    setScores([0, 0]);
    setStatus("goal");
    setMessage("Fresh match.");
    render.current();
    sprites.current[0]?.focus({ preventScroll: true });
  }
  useEffect(() => {
    reduceDemo.current = reduced;
    speedFactor.current = reduced ? 0.65 : 1;
    pause();
  }, [reduced]);
  useEffect(() => {
    let frame = 0,
      last = 0,
      accumulator = 0,
      width = 0;
    let visible = false,
      focused = true;
    render.current = () => {
      [game.current.player, game.current.opponent, game.current.puck].forEach(
        (body, i) => {
          const element = sprites.current[i];
          if (element) {
            const x = vertical.current
              ? (body.y * width) / H
              : (body.x * width) / W;
            const y = vertical.current
              ? ((W - body.x) * width) / H
              : (body.y * width) / W;
            element.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
          }
        }
      );
    };
    const resize = new ResizeObserver(([entry]) => {
      if (!entry || entry.target !== field.current || !entry.target.isConnected)
        return;
      width = entry.contentRect.width;
      vertical.current =
        getComputedStyle(entry.target).getPropertyValue("--vertical").trim() ===
        "1";
      // Fullscreen resizing changes presentation, not the fixed physics world.
      // Keep the existing tile's resize pause, without pausing fullscreen play.
      if (!(transition.current || shell.current?.open)) pause();
      render.current();
    });
    if (field.current) resize.observe(field.current);
    const visibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", visibility);
    const blur = () => {
      focused = false;
      pause();
    };
    const focus = () => {
      focused = true;
    };
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!(entry.isIntersecting || transition.current)) pause();
    });
    if (field.current) observer.observe(field.current);
    function tick(now: number) {
      const dt = Math.min((now - (last || now)) / 1000, 0.04);
      last = now;
      const showcasing =
        demo.current &&
        !reduceDemo.current &&
        !demoStopped.current &&
        visible &&
        focused &&
        !document.hidden &&
        width > 0;
      if (!transition.current && (running.current || showcasing)) {
        if (serveIn.current > 0) {
          serveIn.current = Math.max(0, serveIn.current - dt);
          showCount(Math.ceil(serveIn.current) || null);
          accumulator = 0;
          if (serveIn.current === 0) {
            setStatus("playing");
            setMessage("Move to defend. Flick to score.");
          }
          frame = requestAnimationFrame(tick);
          return;
        }
        accumulator += dt * speedFactor.current;
        while (accumulator >= 1 / 240 && (running.current || showcasing)) {
          const delta = 1 / 240;
          const g = game.current;
          const dx =
            Number(keys.current.has("ArrowRight")) -
            Number(keys.current.has("ArrowLeft"));
          const dy =
            Number(keys.current.has("ArrowDown")) -
            Number(keys.current.has("ArrowUp"));
          target.current.x = clamp(
            target.current.x + (vertical.current ? -dy : dx) * 650 * delta,
            85,
            460
          );
          target.current.y = clamp(
            target.current.y + (vertical.current ? dx : dy) * 650 * delta,
            70,
            H - 70
          );
          if (showcasing) updateDemoPlayer(g, demoBrain.current, delta);
          else move(g.player, target.current.x, target.current.y, 1400, delta);
          updateOpponent(g, brain.current, delta);
          const goal = step(g, delta, delta / speedFactor.current);
          if (!showcasing)
            showCount(
              g.stuckTime >= 0.25
                ? Math.max(1, Math.ceil(3 - g.stuckTime))
                : null
            );
          if (goal && showcasing) {
            game.current = initial();
            game.current.puck.vx = goal === "player" ? 210 : -210;
            brain.current.committing = 0;
            demoBrain.current.committing = 0;
          } else if (goal === "dead-ball") {
            game.current = initial();
            brain.current.committing = 0;
            brain.current.reaction = 0.16;
            target.current = { x: 240, y: H / 2 };
            keys.current.clear();
            drag.current = null;
            setMessage("Puck stuck. New serve, score unchanged.");
            showCount(null);
          } else if (goal) {
            const index = goal === "player" ? 0 : 1;
            score.current = score.current.map(
              (s, i) => s + Number(i === index)
            );
            setScores([...score.current]);
            const finished = score.current[index] >= 5;
            running.current = !finished;
            serveIn.current = finished ? 0 : 3;
            showCount(finished ? null : 3);
            setStatus(score.current[index] >= 5 ? "finished" : "goal");
            setMessage(
              score.current[index] >= 5
                ? index === 0
                  ? "Your game. Well played."
                  : "Rematch?"
                : index === 0
                  ? "Nice shot. Your point."
                  : "Their point. Your next move."
            );
            game.current = initial();
            brain.current.committing = 0;
            brain.current.reaction = 0.16;
            target.current = { x: 240, y: H / 2 };
            game.current.puck.vx = index === 0 ? -210 : 210;
            keys.current.clear();
            drag.current = null;
          }
          accumulator -= delta;
          if (serveIn.current > 0) {
            accumulator = 0;
            break;
          }
        }
        render.current();
      } else accumulator = 0;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }, []);
  return (
    <div className={styles.slot} ref={slot}>
      <dialog
        aria-label={expanded ? "Fullscreen air hockey" : undefined}
        className={styles.shell}
        onCancel={(event) => {
          event.preventDefault();
          void collapse();
        }}
        ref={shell}
        role={expanded ? "dialog" : "presentation"}
      >
        <section
          aria-label="Rebound air hockey"
          className={`bento-surface ${styles.card}`}
          data-expanded={expanded}
          data-status={status}
          ref={card}
        >
          <header className={styles.header}>
            {expanded && (
              <Image
                alt="Mukul Chugh"
                className={styles.brand}
                height={36}
                src={siteConfig.images.logoDark}
                width={36}
              />
            )}
            <h2>For the playful ones.</h2>
            {!expanded && (
              <Button
                aria-label="Enter fullscreen"
                className={styles.expand}
                onClick={expand}
                ref={expandButton}
                size="icon"
                title="Enter fullscreen"
                variant="ghost"
              >
                <IconArrowsMaximize aria-hidden="true" />
              </Button>
            )}
            {!expanded && status === "ready" && !reduced && (
              <Button
                aria-label={demoPaused ? "Resume demo" : "Pause demo"}
                className={styles.pause}
                onClick={() => {
                  demoStopped.current = !demoStopped.current;
                  setDemoPaused(demoStopped.current);
                }}
                size="icon"
                variant="ghost"
              >
                {demoPaused ? (
                  <IconPlayerPlay aria-hidden="true" />
                ) : (
                  <IconPlayerPause aria-hidden="true" />
                )}
              </Button>
            )}
            {!expanded && (status === "playing" || status === "goal") && (
              <Button
                aria-label="Pause"
                className={styles.pause}
                onClick={pause}
                size="icon"
                title="Pause"
                variant="ghost"
              >
                <IconPlayerPause aria-hidden="true" />
              </Button>
            )}
          </header>
          <div className={styles.arena}>
            <div
              className={styles.field}
              data-rebound-field
              onPointerMove={(event) => {
                if (
                  event.pointerType !== "mouse" ||
                  !running.current ||
                  serveIn.current > 0
                )
                  return;
                const point = pointerPosition(event.clientX, event.clientY);
                target.current = {
                  x: clamp(point.x, 85, 460),
                  y: clamp(point.y, 70, H - 70),
                };
              }}
              ref={field}
            >
              <Image
                alt=""
                className={styles.rink}
                draggable={false}
                height={1000}
                preload
                sizes="(max-width: 600px) 90vw, 1100px"
                src="/design/rebound-v1/rink-tall.png"
                width={2000}
              />
              <button
                aria-describedby={helpId}
                aria-label="Your lime paddle"
                className={`${styles.sprite} ${styles.player}`}
                onBlur={() => keys.current.clear()}
                onKeyDown={(e) => {
                  if (e.key.startsWith("Arrow")) {
                    e.preventDefault();
                    keys.current.add(e.key);
                  }
                  if (e.key === "Escape" && !expanded) pause();
                }}
                onKeyUp={(e) => keys.current.delete(e.key)}
                onLostPointerCapture={() => {
                  drag.current = null;
                }}
                onPointerCancel={pause}
                onPointerDown={(e) => {
                  if (e.pointerType === "mouse" || serveIn.current > 0) return;
                  if (!(running.current && e.isPrimary) || e.button !== 0)
                    return;
                  const point = pointerPosition(e.clientX, e.clientY);
                  drag.current = {
                    id: e.pointerId,
                    x: point.x - game.current.player.x,
                    y: point.y - game.current.player.y,
                  };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d || d.id !== e.pointerId) return;
                  const point = pointerPosition(e.clientX, e.clientY);
                  target.current = {
                    x: clamp(point.x - d.x, 85, 460),
                    y: clamp(point.y - d.y, 70, H - 70),
                  };
                }}
                onPointerUp={(e) => {
                  drag.current = null;
                  if (e.currentTarget.hasPointerCapture(e.pointerId))
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }}
                ref={(node) => {
                  sprites.current[0] = node;
                }}
                type="button"
              >
                <Image
                  alt=""
                  draggable={false}
                  height={1254}
                  sizes="(max-width: 600px) 44px, 120px"
                  src="/design/rebound-v1/mallet-lime.png"
                  width={1254}
                />
              </button>
              <div
                className={`${styles.sprite} ${styles.opponent}`}
                ref={(node) => {
                  sprites.current[1] = node;
                }}
              >
                <Image
                  alt="Opponent paddle"
                  draggable={false}
                  height={1254}
                  sizes="(max-width: 600px) 44px, 120px"
                  src="/design/rebound-v1/mallet-ivory.png"
                  width={1254}
                />
              </div>
              <div
                className={`${styles.sprite} ${styles.puck}`}
                ref={(node) => {
                  sprites.current[2] = node;
                }}
              >
                <Image
                  alt="Puck"
                  draggable={false}
                  height={1254}
                  sizes="64px"
                  src="/design/rebound-v1/puck.png"
                  width={1254}
                />
              </div>
              {(confirmRestart ||
                countdown !== null ||
                status === "paused" ||
                status === "finished") && (
                <div className={styles.overlay}>
                  <div className={styles.statusPanel}>
                    <span
                      aria-live="polite"
                      className={styles.statusTitle}
                      role="status"
                    >
                      {confirmRestart
                        ? "Start a fresh match?"
                        : status === "paused"
                          ? "Paused"
                          : status === "finished"
                            ? message
                            : status === "ready"
                              ? "Your move."
                              : status === "goal"
                                ? message
                                : "Resetting the puck"}
                    </span>
                    {!confirmRestart &&
                      countdown !== null &&
                      status !== "paused" && (
                        <div
                          aria-label={`Next serve in ${countdown} seconds`}
                          className={styles.timer}
                        >
                          <svg aria-hidden="true" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" />
                            <circle
                              className={styles.timerArc}
                              cx="50"
                              cy="50"
                              pathLength="3"
                              r="44"
                              strokeDasharray={`${countdown} 3`}
                            />
                          </svg>
                          <strong>{countdown}</strong>
                        </div>
                      )}
                    <small>
                      {confirmRestart
                        ? "Your score will reset."
                        : expanded &&
                            (status === "paused" || status === "finished")
                          ? "A little play, by Mukul."
                          : status === "paused"
                            ? "Resume to continue"
                            : status === "finished"
                              ? `${scores[0]} : ${scores[1]} · Final score`
                              : status === "ready"
                                ? "First to five. You’re lime."
                                : "Next serve automatically"}
                    </small>
                    {confirmRestart ? (
                      <div className={styles.overlayActions}>
                        <Button
                          className={styles.action}
                          data-restart-confirm
                          onClick={reset}
                        >
                          Restart match
                        </Button>
                        <Button
                          className={styles.secondary}
                          onClick={() => {
                            setConfirmRestart(false);
                            gameDock.current?.querySelector("button")?.focus();
                          }}
                          variant="ghost"
                        >
                          Keep match
                        </Button>
                      </div>
                    ) : (
                      (status === "ready" ||
                        status === "paused" ||
                        status === "finished") && (
                        <div className={styles.overlayActions}>
                          <Button
                            className={styles.action}
                            onClick={status === "finished" ? reset : start}
                          >
                            {status === "paused"
                              ? "Resume"
                              : status === "finished"
                                ? "Play again"
                                : "Play"}
                          </Button>
                          {status === "paused" && (
                            <Button
                              className={styles.secondary}
                              onClick={
                                expanded ? () => setConfirmRestart(true) : reset
                              }
                              variant="ghost"
                            >
                              Restart
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.scoreboard}>
            <div>
              <strong>{scores[0]}</strong>
              <span>You</span>
            </div>
            {expanded ? (
              <span className={styles.scoreDivider}>:</span>
            ) : status === "ready" ? (
              <div className={styles.demoActions}>
                <Button className={styles.action} onClick={start}>
                  Play
                </Button>
              </div>
            ) : (
              <p>Move to defend. Flick to score.</p>
            )}
            <div>
              <strong>{scores[1]}</strong>
              <span>Opponent</span>
            </div>
          </div>
          {expanded && (
            <nav
              aria-label="Game controls"
              className={`${dockStyles.dock} ${styles.gameDock}`}
              data-tone="dark"
              ref={gameDock}
            >
              <div aria-hidden="true" className={dockStyles.material} />
              <Button
                aria-label={
                  status === "playing" || status === "goal"
                    ? "Pause"
                    : status === "ready"
                      ? "Play"
                      : status === "finished"
                        ? "Play again"
                        : "Resume"
                }
                className={dockStyles.item}
                onClick={() => {
                  setConfirmRestart(false);
                  if (status === "playing" || status === "goal") pause();
                  else if (status === "finished") reset();
                  else start();
                }}
                size="icon"
                variant="ghost"
              >
                {status === "playing" || status === "goal" ? (
                  <IconPlayerPause aria-hidden="true" />
                ) : (
                  <IconPlayerPlay aria-hidden="true" />
                )}
                <span className={dockStyles.label}>
                  {status === "playing" || status === "goal" ? "Pause" : "Play"}
                </span>
              </Button>
              <Button
                aria-label="Restart match"
                className={dockStyles.item}
                onClick={() => {
                  pause();
                  setConfirmRestart(true);
                }}
                size="icon"
                variant="ghost"
              >
                <IconRefresh aria-hidden="true" />
                <span className={dockStyles.label}>Restart</span>
              </Button>
              <Button
                aria-label="Exit fullscreen"
                className={dockStyles.item}
                onClick={collapse}
                size="icon"
                variant="ghost"
              >
                <IconArrowsMinimize aria-hidden="true" />
                <span className={dockStyles.label}>Exit fullscreen</span>
              </Button>
            </nav>
          )}
          <p className="sr-only" id={helpId}>
            Move your cursor over the rink. No click needed. On touch, drag the
            lime paddle. Arrow keys also work after Play. Escape pauses. First
            to five.
            {reduced
              ? " Reduced motion: slower play, no decorative effects. Play starts only when you choose."
              : ""}
          </p>
        </section>
      </dialog>
    </div>
  );
}
