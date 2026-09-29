"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import { useCases, useCasesIntro } from "@/content";
import { clamp01, useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Section, SectionHeader } from "@/components/ui";
import { UseCaseChat } from "./UseCaseChat";

/**
 * Use cases — stacking sticky cards (reference: cevver.com).
 * Each card: big italic gradient numeral + divider + icon/title, description
 * and highlights on the left; the use case's WhatsApp conversation on the
 * right.
 *
 * Motion: `position: sticky` does the stacking; on top of that, a card
 * shrinks and dims slightly as the next one slides over it.
 */
export function UseCases() {
  const listRef = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(listRef, "pin");
  const reduced = useReducedMotion();
  const count = useCases.length;

  return (
    <Section id="use-cases">
      <SectionHeader {...useCasesIntro} />

      <ol ref={listRef} className="mx-auto mt-14 max-w-4xl space-y-6 pb-8">
        {useCases.map((u, i) => {
          // 0 while this card is on top, → 1 as the next card covers it.
          const covered = reduced || i === count - 1 ? 0 : clamp01(progress * count - i - 0.4);
          return (
            <li
              key={u.id}
              className="sticky"
              // Each card sticks a little lower than the previous one, so the
              // stack's edges stay visible (cevver's layered effect).
              style={{ top: `${88 + i * 22}px` }}
            >
              <article
                className="grid origin-top overflow-hidden rounded-[2rem] bg-surface-raised shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-ink-200/80 will-change-transform md:min-h-[min(20rem,52svh)] md:grid-cols-2"
                style={{ transform: `scale(${1 - covered * 0.06})`, filter: `brightness(${1 - covered * 0.12})` }}
              >
                <div className="flex flex-col p-6 sm:p-8 short:sm:p-6">
                  <span className="accent-serif text-gradient-logo text-6xl leading-none sm:text-7xl short:sm:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <hr className="my-5 border-ink-200 short:my-4" />
                  <div className="flex items-center gap-3">
                    <u.icon className="size-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    <h3 className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">{u.title}</h3>
                  </div>
                  <p className="mt-2.5 max-w-sm text-sm text-ink-500 sm:text-base">{u.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {u.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-ink-700">
                        <Check className="size-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center bg-ink-50 p-5 sm:p-6">
                  <div className="w-full">
                    <UseCaseChat messages={u.conversation} />
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
