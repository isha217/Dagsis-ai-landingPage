"use client";

import { ArrowUpRight, AudioLines, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { heroContent } from "@/content";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChatBubble, TypingIndicator } from "@/components/shared/ChatBubble";
import { RobotAvatar } from "@/components/shared/RobotAvatar";

/** One conversation = question → typing → answer, then pause. */
type Phase = "question" | "typing" | "answer";
const PHASE_MS: Record<Phase, number> = { question: 1100, typing: 1300, answer: 3200 };
const NEXT: Record<Phase, Phase> = { question: "typing", typing: "answer", answer: "question" };

/**
 * Glass panel with the AI robot avatar. Mirrors the structure of youratlas'
 * hero widget (header chip → visual → sample rows → CTAs) and, like the
 * reference, "plays" samples: each conversation types itself out in turn.
 * Clicking a sample row jumps to it.
 * Light theme: frosted white card with navy text (sits on the pale part of
 * the hero). Dark theme: translucent glass with white text.
 */
export function HeroAgentCard() {
  const { agentCard } = heroContent;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const sample = agentCard.samples[index];

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      if (phase === "answer") setIndex((i) => (i + 1) % agentCard.samples.length);
      setPhase(NEXT[phase]);
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduced, agentCard.samples.length]);

  const shownPhase: Phase = reduced ? "answer" : phase;

  return (
    <div className="relative mx-auto max-w-md rounded-[2rem] bg-white/75 p-4 shadow-xl shadow-brand-900/10 ring-1 ring-white backdrop-blur-xl sm:p-5 dark:bg-white/[0.07] dark:shadow-none dark:ring-white/15">
      {/* Header chip */}
      <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 ring-1 ring-ink-200 dark:bg-white/10 dark:ring-white/15">
        <span className="relative flex size-6 items-center justify-center rounded-full bg-emerald-400/20">
          <span className="absolute size-2 animate-ping rounded-full bg-emerald-400/70" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs font-semibold text-ink-950 dark:text-white">{agentCard.name}</span>
        <span className="text-xs text-ink-500 dark:text-white/65">{agentCard.status}</span>
      </div>

      {/* Avatar + live conversation */}
      <div className="relative mx-auto mt-2 w-56 sm:w-60 lg:w-[min(15rem,26vh)]">
        <RobotAvatar idPrefix="hero-robot" />

        <div className="absolute top-6 -left-12 w-48 sm:-left-20" aria-live="polite">
          <div key={`q-${index}`} className="animate-fade-up">
            <ChatBubble
              message={{ from: "user", text: sample.question }}
              className="ml-0 bg-brand-600 text-white shadow-xl"
            />
          </div>
        </div>

        <div className="absolute -right-10 bottom-4 w-52 sm:-right-16">
          {shownPhase === "typing" && <TypingIndicator className="ml-auto bg-white shadow-xl ring-1 ring-ink-200/60 dark:ring-0" />}
          {shownPhase === "answer" && (
            <div key={`a-${index}`} className="animate-fade-up">
              <ChatBubble message={{ from: "agent", text: sample.answer }} className="bg-white text-night-950 shadow-xl ring-1 ring-ink-200/60 dark:ring-0" />
            </div>
          )}
        </div>
      </div>

      {/* Sample conversations (click to play) */}
      <ul className="mt-2 space-y-2">
        {agentCard.samples.map((s, i) => {
          const active = i === index;
          return (
            // On short windows show two samples so the card fits the screen.
            <li key={s.question} className={i > 1 ? "lg:short:hidden" : undefined}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setPhase("question");
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ring-1 transition-colors",
                  active
                    ? "bg-brand-50 ring-brand-200 dark:bg-white/[0.14] dark:ring-white/25"
                    : "bg-white ring-ink-200 hover:bg-ink-50 dark:bg-white/[0.05] dark:ring-white/10 dark:hover:bg-white/10",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white dark:bg-white/10">
                  {active ? <AudioLines className="size-4" /> : <Play className="ml-0.5 size-3.5 fill-current" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-800 dark:text-white/90">Sample: “{s.question}”</span>
                <span className="text-[11px] text-ink-500 dark:text-white/60">{s.channel}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* CTAs */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={siteConfig.links.signUp}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 dark:bg-white dark:text-night-950 dark:hover:bg-white/90"
        >
          Try the agent <ArrowUpRight className="size-4" />
        </a>
        <a
          href={siteConfig.links.bookDemo}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50 dark:bg-transparent dark:text-white dark:ring-white/25 dark:hover:bg-white/10"
        >
          Talk to a human <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
