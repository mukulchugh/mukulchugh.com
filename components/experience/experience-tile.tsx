"use client";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconFileText,
  IconPlus,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import {
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { premiumSpring } from "@/lib/motion";
import styles from "./experience-tile.module.css";
import { ZendutyHandoff } from "./zenduty-handoff";

const recentRoles = [
  {
    company: "Quivly",
    date: "Nov 2025–present",
    description:
      "Contributing across product behavior, interfaces, and the systems behind them.",
    details: [
      {
        icon: IconFileText,
        label: "Product decisions",
        text: "Making actions, permissions, and completion states understandable.",
      },
      {
        icon: IconSparkles,
        label: "AI experiences",
        text: "Shaping how agents ask, respond, and hand work back to people.",
      },
      {
        icon: IconCode,
        label: "Engineering",
        text: "Connecting workflows, integrations, and reviewable results.",
      },
    ],
    headline: "From customer context to useful action.",
    href: "/projects/quivly-skills",
    logo: "/design/brand/quivly-icon.ico",
    summary: "Building AI-powered products for post-sales teams.",
    title: "Founding Engineer",
  },
  {
    company: "Swiggy",
    date: "May–Nov 2025",
    description:
      "Contributing to onboarding, self-service, and the mobile delivery behind them.",
    details: [
      {
        icon: IconFileText,
        label: "Onboarding",
        text: "Connecting identity capture, verification, and guided setup into the seller journey.",
      },
      {
        icon: IconSparkles,
        label: "Product experience",
        text: "Building self-service tools for profiles, catalogues, pricing, and availability, alongside quality and moderation workflows.",
      },
      {
        icon: IconCode,
        label: "Mobile delivery",
        text: "Working on over-the-air updates, staged rollouts, rollback, and version management for the React Native app.",
      },
    ],
    headline: "Getting sellers ready to work.",
    href: "/blog/mobile-lessons-from-swiggy-scale",
    logo: "/design/brand/swiggy.webp",
    summary: "Working on the seller experience for Pyng.",
    title: "Software Development Engineer",
  },
  {
    company: "Zenduty",
    date: "Jun 2022–May 2025",
    description:
      "Contributing across mobile, web, and internal products within the team, through Zenduty’s acquisition by Xurrent.",
    details: [
      {
        icon: IconFileText,
        label: "Mobile experience",
        text: "Reworking the React Native app, building an in-house UI library, and contributing to mobile releases.",
      },
      {
        icon: IconSparkles,
        label: "Team products",
        text: "Working on ZenDash and internal tools that helped customer-facing teams inspect information and investigate issues.",
      },
      {
        icon: IconCode,
        label: "Beyond the app",
        text: "Contributing to APIs, SDKs, documentation, and customer-facing web experiences.",
      },
    ],
    headline: "Connecting more of the product.",
    href: "/projects/zendash-global-admin-dashboard",
    logo: "/design/brand/zenduty.webp",
    summary: "Growing from an internship into work across the product.",
    title: "Intern → Software Engineer",
  },
];

const formativeRoles = [
  {
    company: "HeroApp",
    details: [
      {
        icon: IconFileText,
        label: "Product design",
        text: "Shaping the product from early ideas into usable flows.",
      },
      {
        icon: IconCode,
        label: "Mobile development",
        text: "Designing and developing the React Native experience.",
      },
      {
        icon: IconSparkles,
        label: "Building together",
        text: "Connecting product decisions, technology choices, and implementation as a co-founder.",
      },
    ],
    headline: "An idea, made mobile.",
    logo: "/design/brand/heroapp.webp",
    text: "Co-founder, working across product design and mobile development.",
    title: "Co-founder & CTO",
  },
  {
    company: "Digital Moshai",
    details: [
      {
        icon: IconFileText,
        label: "Client collaboration",
        text: "Translating client requirements into clear, functional websites.",
      },
      {
        icon: IconCode,
        label: "Web development",
        text: "Designing and building responsive websites for small businesses and startups.",
      },
      {
        icon: IconSparkles,
        label: "Discoverability",
        text: "Bringing search-engine fundamentals into the website build.",
      },
    ],
    headline: "Finding a visual voice.",
    logo: "/design/brand/digital-moshai.webp",
    text: "Independent web development and visual design for clients.",
    title: "Freelance Web Developer",
  },
  {
    company: "Instahomes PH",
    details: [
      {
        icon: IconCode,
        label: "Web application",
        text: "Working with the technical team to improve the web application and its user experience.",
      },
      {
        icon: IconFileText,
        label: "Collaboration",
        text: "Contributing alongside the CTO and CIO, with attention to implementation and team handoffs.",
      },
    ],
    headline: "Making home search work.",
    logo: "/design/brand/instahomes.webp",
    text: "Contributing to the web application with the technical team.",
    title: "Software Engineer Associate",
  },
  {
    company: "Guby Rogers",
    details: [
      {
        icon: IconCode,
        label: "Event experiences",
        text: "Building an online registration portal for Career Expo and platforms for events and workshops.",
      },
      {
        icon: IconSparkles,
        label: "Visual communication",
        text: "Working with a small team on the brand’s social media presence and visual communication.",
      },
    ],
    headline: "Bringing people together.",
    logo: "/design/brand/guby-rogers.webp",
    text: "Work across websites, event experiences, and visual communication.",
    title: "Web Developer & Product Generalist",
  },
  {
    company: "Microsoft student community",
    details: [
      {
        icon: IconSparkles,
        label: "Student community",
        text: "Organizing campus workshops and hackathons with the student community.",
      },
      {
        icon: IconCode,
        label: "Mentoring",
        text: "Helping students explore web development and cloud technologies.",
      },
    ],
    headline: "Learning, shared.",
    logo: "/design/brand/microsoft.webp",
    text: "Campus workshops, mentoring, and community activities.",
    title: "Community Lead & Student Ambassador",
  },
];

const allRoles = [
  ...recentRoles,
  ...formativeRoles.map((item) => ({
    ...item,
    date: "",
    description: "",
    href: "",
    summary: item.text,
  })),
];
const roles = allRoles.slice(0, 4);
const earlier = allRoles.slice(4);

export function ExperienceTile() {
  const [selected, setSelected] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);
  const [handoffComplete, setHandoffComplete] = useState(false);
  const finishHandoff = useCallback(() => setHandoffComplete(true), []);
  const scrollPressure = useMotionValue(0);
  const settledPressure = useSpring(scrollPressure, {
    damping: 32,
    stiffness: 260,
  });
  const plusRotation = useTransform(settledPressure, [0, 90], [0, 45]);
  const reducedMotion = useReducedMotion();
  const groupId = useId();
  const list = useRef<HTMLElement>(null);
  const earlierList = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);
  const reversing = useRef(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pressure = useRef({ amount: 0, time: 0 });
  const touch = useRef<number | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const role = allRoles[selected];
  function expandEarlier() {
    reversing.current = false;
    if (toggle.current === document.activeElement)
      list.current?.focus({ preventScroll: true });
    pressure.current.amount = 0;
    scrollPressure.set(90);
    setExpanded(true);
  }
  function atEnd() {
    const element = list.current;
    return (
      element &&
      element.scrollHeight - element.clientHeight - element.scrollTop < 3
    );
  }
  function backAtFeatured() {
    const element = list.current;
    const earlierElement = earlierList.current;
    return (
      element &&
      earlierElement &&
      element.scrollTop <=
        Math.max(0, earlierElement.offsetTop - element.clientHeight) + 3
    );
  }
  function collapseEarlier() {
    if (earlierList.current?.contains(document.activeElement)) {
      list.current?.focus({ preventScroll: true });
    }
    pressure.current.amount = 0;
    scrollPressure.set(0);
    setExpanded(false);
  }
  function changeRole(amount: number) {
    setDirection(amount);
    setSelected(
      (current) => (current + amount + allRoles.length) % allRoles.length
    );
    body.current?.scrollTo({ behavior: "instant", top: 0 });
  }
  return (
    <section
      aria-labelledby="experience-title"
      className={`bento-surface ${styles.tile}`}
    >
      <header className={styles.intro}>
        <div className={styles.headingRow}>
          <h2 id="experience-title">
            Different teams.
            <br />A wider perspective.
          </h2>
          <Link
            aria-label="View full experience"
            className={styles.fullExperience}
            href="/experience"
          >
            <span>View full experience</span>
            <IconArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <p>Product, design, and engineering, shaped by the work.</p>
      </header>
      <Dialog>
        <LayoutGroup id={groupId}>
          <div className={styles.listFrame} data-expanded={expanded}>
            <motion.section
              aria-label="Experience roles"
              className={styles.roles}
              layoutScroll
              onKeyDown={(event) => {
                reversing.current =
                  ["ArrowUp", "PageUp", "Home"].includes(event.key) ||
                  (event.key === " " && event.shiftKey);
              }}
              onScroll={(event) => {
                const top = event.currentTarget.scrollTop;
                const scrollingBack = top < lastScroll.current;
                lastScroll.current = top;
                if (
                  expanded &&
                  reversing.current &&
                  scrollingBack &&
                  backAtFeatured()
                )
                  collapseEarlier();
              }}
              onTouchCancel={() => {
                touch.current = null;
                if (!expanded) scrollPressure.set(0);
              }}
              onTouchEnd={() => {
                touch.current = null;
                if (!expanded) scrollPressure.set(0);
              }}
              onTouchMove={(event) => {
                if (touch.current !== null && event.touches.length === 1)
                  reversing.current = event.touches[0].clientY > touch.current;
                if (
                  expanded &&
                  touch.current !== null &&
                  event.touches.length === 1 &&
                  event.touches[0].clientY - touch.current > 25 &&
                  backAtFeatured()
                ) {
                  touch.current = null;
                  collapseEarlier();
                  return;
                }
                if (
                  touch.current !== null &&
                  event.touches.length === 1 &&
                  atEnd() &&
                  touch.current - event.touches[0].clientY > 65
                ) {
                  touch.current = null;
                  expandEarlier();
                } else if (touch.current !== null && !expanded && atEnd()) {
                  scrollPressure.set(
                    Math.max(
                      0,
                      Math.min(
                        90,
                        ((touch.current - event.touches[0].clientY) * 90) / 65
                      )
                    )
                  );
                }
              }}
              onTouchStart={(event) => {
                touch.current =
                  (expanded || atEnd()) && event.touches.length === 1
                    ? event.touches[0].clientY
                    : null;
              }}
              onWheel={(event) => {
                reversing.current = !event.ctrlKey && event.deltaY < 0;
                if (
                  expanded &&
                  !event.ctrlKey &&
                  event.deltaY < 0 &&
                  Math.abs(event.deltaY) > Math.abs(event.deltaX) &&
                  backAtFeatured()
                ) {
                  collapseEarlier();
                  return;
                }
                if (
                  expanded ||
                  event.ctrlKey ||
                  event.deltaY <= 0 ||
                  Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
                  !atEnd()
                ) {
                  pressure.current.amount = 0;
                  if (!expanded) scrollPressure.set(0);
                  return;
                }
                const now = performance.now();
                if (now - pressure.current.time > 350)
                  pressure.current.amount = 0;
                pressure.current.time = now;
                pressure.current.amount +=
                  event.deltaY *
                  (event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                      ? 480
                      : 1);
                scrollPressure.set(Math.min(90, pressure.current.amount));
                if (pressure.current.amount >= 90) expandEarlier();
              }}
              ref={list}
              tabIndex={0}
            >
              {roles.map((item, index) => (
                <DialogTrigger
                  aria-disabled={
                    item.company === "Zenduty" &&
                    handoffActive &&
                    !handoffComplete
                  }
                  aria-label={
                    item.company === "Zenduty"
                      ? handoffComplete
                        ? "Explore IMR by Xurrent experience"
                        : "See Zenduty’s next chapter"
                      : `Explore ${item.company} experience`
                  }
                  className={styles.role}
                  data-selected={index === selected}
                  key={item.company}
                  onClick={(event) => {
                    if (item.company === "Zenduty" && !handoffComplete) {
                      event.preventBaseUIHandler();
                      setHandoffActive(true);
                      return;
                    }
                    setDirection(1);
                    setSelected(index);
                  }}
                  render={<Button size="unstyled" variant="unstyled" />}
                >
                  {item.company === "Zenduty" ? (
                    <ZendutyHandoff
                      active={handoffActive}
                      complete={handoffComplete}
                      onComplete={finishHandoff}
                    />
                  ) : (
                    <>
                      <span className={styles.brandMark}>
                        <Image
                          alt=""
                          height={40}
                          src={item.logo}
                          unoptimized
                          width={40}
                        />
                      </span>
                      <span className={styles.headline}>{item.headline}</span>
                      <IconArrowRight
                        aria-hidden="true"
                        className={styles.arrow}
                        size={22}
                      />
                      <span className={styles.metadata}>
                        <span>
                          <strong>{item.company}</strong>
                          <span aria-hidden="true"> / </span>
                          {item.title}
                        </span>
                        <span className={styles.date}>{item.date}</span>
                      </span>
                    </>
                  )}
                </DialogTrigger>
              ))}
              <div id={`${groupId}-earlier`} ref={earlierList}>
                {expanded &&
                  earlier.map((item, index) => {
                    const transition = reducedMotion
                      ? { duration: 0 }
                      : { ...premiumSpring, delay: index * 0.045 };
                    const logo = (
                      <motion.span
                        className={styles.brandMark}
                        layout={reducedMotion ? false : "position"}
                        layoutId={`${item.company}-logo`}
                        transition={transition}
                      >
                        <Image
                          alt=""
                          height={40}
                          src={item.logo}
                          unoptimized
                          width={40}
                        />
                      </motion.span>
                    );
                    return (
                      <motion.div
                        className={styles.earlierItem}
                        key={item.company}
                        layout={!reducedMotion}
                        layoutId={`${item.company}-card`}
                        style={{ borderRadius: 0 }}
                        transition={transition}
                      >
                        <DialogTrigger
                          aria-label={`Explore ${item.company} experience`}
                          className={`${styles.role} ${styles.earlierRole}`}
                          data-selected={selected === index + roles.length}
                          onClick={() => {
                            setDirection(1);
                            setSelected(index + roles.length);
                          }}
                          render={<Button size="unstyled" variant="unstyled" />}
                        >
                          {logo}
                          <motion.span
                            animate={{ opacity: 1 }}
                            className={styles.headline}
                            initial={{ opacity: reducedMotion ? 1 : 0 }}
                            layout="position"
                            transition={{
                              delay: reducedMotion ? 0 : 0.12 + index * 0.045,
                              duration: reducedMotion ? 0 : 0.2,
                            }}
                          >
                            {item.headline}
                          </motion.span>
                          <IconArrowRight
                            aria-hidden="true"
                            className={styles.arrow}
                            size={22}
                          />
                          <motion.span
                            animate={{ opacity: 1 }}
                            className={styles.metadata}
                            initial={{ opacity: reducedMotion ? 1 : 0 }}
                            layout="position"
                            transition={{
                              delay: reducedMotion ? 0 : 0.18 + index * 0.045,
                              duration: reducedMotion ? 0 : 0.2,
                            }}
                          >
                            <span>
                              <strong>{item.company}</strong>
                              <span aria-hidden="true"> / </span>
                              {item.title}
                            </span>
                          </motion.span>
                        </DialogTrigger>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.section>
            <motion.div
              animate={{
                opacity: expanded ? 0 : 1,
                y: expanded ? "100%" : "0%",
              }}
              aria-hidden={expanded}
              className={styles.moreBar}
              inert={expanded}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <Button
                aria-controls={`${groupId}-earlier`}
                aria-expanded={expanded}
                className={styles.earlierToggle}
                onClick={() => {
                  if (expanded) collapseEarlier();
                  else expandEarlier();
                }}
                ref={toggle}
                size="unstyled"
                variant="unstyled"
              >
                <span>More work</span>
                <motion.span
                  className={styles.plus}
                  style={{
                    rotate: reducedMotion ? (expanded ? 45 : 0) : plusRotation,
                  }}
                >
                  <IconPlus aria-hidden="true" size={20} />
                </motion.span>
              </Button>
              <div aria-hidden="true" className={styles.footerLogos}>
                {expanded ? (
                  <span className={styles.experienceCount}>
                    {earlier.length} experiences
                  </span>
                ) : (
                  earlier.map((item, index) => (
                    <motion.span
                      className={styles.footerLogo}
                      key={item.company}
                      layoutId={`${item.company}-card`}
                      style={{ borderRadius: 8 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : {
                              ...premiumSpring,
                              delay: (earlier.length - 1 - index) * 0.035,
                            }
                      }
                    >
                      <motion.span
                        className={styles.brandMark}
                        layoutId={`${item.company}-logo`}
                        transition={
                          reducedMotion ? { duration: 0 } : premiumSpring
                        }
                      >
                        <Image
                          alt=""
                          height={32}
                          src={item.logo}
                          unoptimized
                          width={32}
                        />
                      </motion.span>
                    </motion.span>
                  ))
                )}
              </div>
            </motion.div>
          </div>
          <span aria-live="polite" className="sr-only">
            {expanded
              ? `${earlier.length} earlier experiences expanded. Select a role to explore.`
              : "Earlier experiences collapsed."}
          </span>
        </LayoutGroup>
        <DialogContent className={styles.modal} showCloseButton={false}>
          <header className={styles.modalTop}>
            <div className={styles.companyHeading}>
              <span className={styles.modalMark}>
                <Image
                  alt=""
                  height={48}
                  src={
                    role.company === "Zenduty"
                      ? "/design/brand/xurrent.png"
                      : role.logo
                  }
                  unoptimized
                  width={48}
                />
              </span>
              <DialogTitle className={styles.company}>
                {role.company === "Zenduty" ? "IMR by Xurrent" : role.company}
              </DialogTitle>
            </div>
            <div className={styles.toolbar}>
              <Button
                aria-label="Previous role"
                onClick={() => changeRole(-1)}
                size="icon"
                variant="outline"
              >
                <IconChevronLeft aria-hidden="true" />
              </Button>
              <Button
                aria-label="Next role"
                onClick={() => changeRole(1)}
                size="icon"
                variant="outline"
              >
                <IconChevronRight aria-hidden="true" />
              </Button>
              <DialogClose
                aria-label="Close experience"
                render={<Button size="icon" variant="outline" />}
              >
                <IconX aria-hidden="true" />
              </DialogClose>
            </div>
          </header>
          <div className={styles.modalBody} ref={body}>
            <div
              className={styles.chapter}
              data-direction={direction}
              key={role.company}
            >
              <header className={styles.modalHeader}>
                <div className={styles.position}>
                  <p>{role.title}</p>
                  <span>{role.date}</span>
                </div>
                <DialogDescription className={styles.description}>
                  {role.company === "Zenduty" && "Formerly Zenduty. "}
                  {role.summary} {role.description}
                </DialogDescription>
                {role.company === "Zenduty" && (
                  <div className={styles.acquisitionDetail}>
                    <span>Zenduty</span>
                    <IconArrowRight aria-hidden="true" size={18} />
                    <span className={styles.transitionMark}>
                      <Image
                        alt=""
                        height={32}
                        src="/design/brand/xurrent.png"
                        width={32}
                      />
                    </span>
                    <span>
                      <strong>Xurrent</strong>
                      <span>Jan–May 2025 · Four-month acquisition chapter</span>
                    </span>
                    <p className={styles.transitionNote}>
                      Internal acquisition discussions began in January; the
                      announcement followed in February. I stayed with Zenduty
                      through May, then joined Swiggy.
                    </p>
                  </div>
                )}
              </header>
              <div className={styles.details}>
                {role.details.map(({ label, text, icon: Icon }) => (
                  <section className={styles.detail} key={label}>
                    <span className={styles.icon}>
                      <Icon aria-hidden="true" size={24} stroke={1.5} />
                    </span>
                    <div>
                      <h3 className="ui-label">{label}</h3>
                      <p>{text}</p>
                    </div>
                  </section>
                ))}
              </div>
              {role.href && (
                <Link className={styles.related} href={role.href}>
                  {selected === 1
                    ? "Read the mobile notes"
                    : "View related work"}
                  <IconArrowUpRight aria-hidden="true" size={18} />
                </Link>
              )}
            </div>
          </div>
          <span aria-live="polite" className="sr-only">
            {role.company}, {role.title}, {role.date}
          </span>
        </DialogContent>
      </Dialog>
    </section>
  );
}
