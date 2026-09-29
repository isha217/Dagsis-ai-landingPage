"use client";

import { useRef } from "react";
import { useFitScale } from "@/hooks/useFitScale";
import { problemIntro, problems } from "@/content";
import { easeOut, lerp, range, useScrollProgress } from "@/hooks/useScrollProgress";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { Container, SectionHeader } from "@/components/ui";
import { ProblemInbox } from "./ProblemInbox";
import { ProblemItem } from "./ProblemItem";

/** Scroll distance per problem while pinned, in viewport heights. */
const VH_PER_ITEM = 0.6;
/** Share of the pinned scroll before the first item starts arriving. */
const LEAD_IN = 0.06;
/** Share of the pinned scroll each item takes to slide in. */
const SLIDE = 0.16;
/** Share left at the end with everything shown, before the page moves on. */
const HOLD = 0.14;

const pad = (n: number) => String(n).padStart(2, "0");

/** Slide in from the left with a fade (and optional blur), driven by `t` 0→1. */
const fromLeft = (t: number, distance: number, blur = 0) => ({
  opacity: t,
  transform: `translateX(${lerp(-distance, 0, t)}px)`,
  filter: blur ? `blur(${lerp(blur, 0, t)}px)` : undefined,
});

/**
 * The problem — scroll-driven story. Animated on every screen size; only
 * reduced-motion visitors get a static version.
 *
 * Wide screens (≥1024px):
 *  1. As the section scrolls into view, the left column builds in from the
 *     left: accent line + label, the headline word by word (sliding and
 *     un-blurring), the description, then the "Support inbox" illustration.
 *  2. The section pins. The left column stays still while the four problem
 *     cards slide in from the right, one per scroll step. Each arrival also
 *     adds its row to the inbox (from the left), and the inbox's unanswered
 *     counter and waiting timer climb as you scroll.
 *  3. After a short hold the page continues.
 *  If the window is too short, the pinned layout scales down to fit.
 *
 * Phones / tablets: the heading builds in from the left the same way; below
 * it the problem cards slide in from the right onto a stack (earlier cards
 * step back behind the new one), with the 01/04 progress underneath.
 */
export function Problem() {
  const reduced = useReducedMotion();
  const pinned = !reduced;
  const wide = useMediaQuery("(min-width: 1024px)", true);

  const ref = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref, "pin");
  // How far the section has come onto the screen (before it pins).
  const entered = useScrollProgress(ref, "enter");
  // Top padding clears the floating navbar; keep a little space at the bottom.
  const fit = useFitScale(contentRef, pinned, 64 + 24);
  const count = problems.length;

  // Card arrivals, spread evenly between the lead-in and the final hold.
  const step = (1 - LEAD_IN - HOLD - SLIDE) / Math.max(1, count - 1);
  const arrivals = problems.map((_, i) =>
    pinned ? easeOut(range(progress, LEAD_IN + i * step, LEAD_IN + i * step + SLIDE)) : 1,
  );
  const arrived = arrivals.filter((t) => t > 0.5).length;
  const timeline = pinned ? range(progress, LEAD_IN, 1 - HOLD) : 1;

  // Heading entrance, staged while the section arrives.
  const stage = (from: number, to: number) => (pinned ? easeOut(range(entered, from, to)) : 1);
  const words = problemIntro.title.split(" ");
  const wordGap = 0.3 / words.length;

  if (!pinned) {
    return (
      <section id="problem" className="relative bg-ink-50 py-20 sm:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeader {...problemIntro} align="left" />
            <ProblemInbox arrivals={arrivals} timeline={timeline} active={-1} className="mt-8" />
          </div>
          <ol className="space-y-4 lg:col-span-7">
            {problems.map((p, i) => (
              <li key={p.title}>
                <ProblemItem problem={p} number={pad(i + 1)} />
              </li>
            ))}
          </ol>
        </Container>
      </section>
    );
  }

  const heading = (
    <div>
      <p
        className="flex items-center gap-3 text-sm font-medium text-brand-600 dark:text-brand-400"
        style={fromLeft(stage(0.12, 0.45), 40)}
      >
        <span className="h-px bg-current" style={{ width: `${lerp(0, 28, stage(0.15, 0.5))}px` }} aria-hidden="true" />
        {problemIntro.eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-ink-900 sm:text-4xl xl:text-5xl">
        {words.map((word, i) => (
          <span key={i}>
            <span
              className="inline-block will-change-transform"
              style={fromLeft(stage(0.18 + i * wordGap, 0.48 + i * wordGap), 48, 8)}
            >
              {word}
            </span>{" "}
          </span>
        ))}
      </h2>
      <p className="mt-4 text-base text-pretty text-ink-500 sm:text-lg" style={fromLeft(stage(0.45, 0.85), 64)}>
        {problemIntro.description}
      </p>
    </div>
  );

  const progressBar = (
    <div className="flex items-center gap-4" aria-hidden="true">
      <p className="font-mono text-xs text-ink-500 tabular-nums">
        <span className="text-base font-semibold text-ink-950">{pad(arrived)}</span> / {pad(count)}
      </p>
      <div className="flex flex-1 gap-1.5">
        {arrivals.map((a, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-200">
            <span
              className="block h-full origin-left rounded-full bg-brand-600 dark:bg-brand-400"
              style={{ transform: `scaleX(${a})` }}
            />
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="problem"
      ref={ref}
      className="relative bg-ink-50"
      style={{ height: `${100 + count * VH_PER_ITEM * 100}vh` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16">
        <div ref={contentRef} className="w-full origin-center" style={{ transform: fit < 1 ? `scale(${fit})` : undefined }}>
          {wide ? (
            <Container className="grid grid-cols-12 items-center gap-14">
              {/* Left: builds in from the left, then stays still while pinned */}
              <div className="col-span-5">
                {heading}
                <div className="mt-8 will-change-transform" style={fromLeft(stage(0.55, 1), 160)}>
                  <ProblemInbox arrivals={arrivals} timeline={timeline} active={arrived - 1} />
                </div>
              </div>

              {/* Right: problem cards arrive from the right */}
              <ol className="col-span-7 space-y-4">
                {problems.map((p, i) => {
                  const t = arrivals[i];
                  return (
                    <li
                      key={p.title}
                      className="will-change-transform"
                      style={{ opacity: t, transform: `translateX(${lerp(160, 0, t)}px) scale(${lerp(0.96, 1, t)})` }}
                    >
                      <ProblemItem problem={p} number={pad(i + 1)} active={i === arrived - 1} />
                    </li>
                  );
                })}
              </ol>
            </Container>
          ) : (
            <Container className="flex flex-col gap-8">
              {heading}

              {/* Stack: every card sits in the same grid cell, so the stack is as
                  tall as the tallest card. New cards slide in from the right;
                  earlier ones step back (up, smaller, dimmer). */}
              <ol className="grid pt-6">
                {problems.map((p, i) => {
                  const t = arrivals[i];
                  // How many cards have arrived on top of this one.
                  const behind = arrivals.slice(i + 1).reduce((sum, a) => sum + a, 0);
                  return (
                    <li
                      key={p.title}
                      className="col-start-1 row-start-1 will-change-transform"
                      style={{
                        zIndex: i + 1,
                        opacity: t * (1 - Math.min(behind, 3) * 0.12),
                        transform: `translateX(${lerp(110, 0, t)}%) translateY(${-behind * 12}px) scale(${1 - Math.min(behind, 3) * 0.05})`,
                        transformOrigin: "top center",
                      }}
                    >
                      <ProblemItem problem={p} number={pad(i + 1)} active={i === arrived - 1} />
                    </li>
                  );
                })}
              </ol>

              {progressBar}
            </Container>
          )}
        </div>
      </div>
    </section>
  );
}
