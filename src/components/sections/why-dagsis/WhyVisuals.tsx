"use client";

import { Check, FileText, Moon, ShieldCheck, Sun } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { channels, whyVisuals } from "@/content";
import type { WhyReason } from "@/types/content";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ChatBubble } from "@/components/shared/ChatBubble";
import { LogoMark } from "@/components/shared/Logo";

/**
 * Small live illustrations for the Why Dagsis bento cards. Each one plays
 * its entrance once when scrolled into view (reduced motion: shown as-is,
 * handled by the global reduced-motion CSS).
 */

/** Shared frame: tinted panel at the top of a card; passes `on` to children. */
function Stage({ children, className }: { children: (on: boolean) => ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { threshold: 0.4 });
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative overflow-hidden rounded-2xl bg-ink-50 p-5 ring-1 ring-ink-200/60", className)}
    >
      {children(on)}
    </div>
  );
}

/** Fade + rise, delayed, once `on`. */
const appear = (on: boolean, delayMs: number) => ({
  className: cn("transition-all duration-700 ease-out", on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"),
  style: { transitionDelay: `${delayMs}ms` },
});

function KnowledgeVisual() {
  return (
    <Stage className="flex min-h-64 flex-col justify-center gap-3 sm:p-7">
      {(on) => (
        <>
          <div {...appear(on, 0)}>
            <ChatBubble message={{ from: "user", text: whyVisuals.knowledge.question }} className="ml-auto text-sm" />
          </div>
          <div {...appear(on, 350)}>
            <ChatBubble
              message={{ from: "agent", text: whyVisuals.knowledge.answer }}
              className="bg-surface-raised text-sm shadow-sm ring-1 ring-ink-200/70"
            />
          </div>
          <div {...appear(on, 750)} className={cn(appear(on, 750).className, "flex flex-wrap items-center gap-2")}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100 dark:text-brand-300">
              <FileText className="size-3.5" /> {whyVisuals.knowledge.source}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="size-3.5" /> {whyVisuals.knowledge.badge}
            </span>
          </div>
        </>
      )}
    </Stage>
  );
}

function AlwaysOnVisual() {
  const dots = whyVisuals.alwaysOn.conversationHours;
  const ex = whyVisuals.alwaysOn.example;
  return (
    <Stage className="flex h-40 flex-col justify-between">
      {(on) => (
        <>
          <div className="flex items-center justify-between text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1"><Moon className="size-3.5" /> 00:00</span>
            <span className="inline-flex items-center gap-1"><Sun className="size-3.5" /> 12:00</span>
            <span className="inline-flex items-center gap-1"><Moon className="size-3.5" /> 24:00</span>
          </div>
          <div className="relative h-8">
            <div className="absolute inset-x-0 top-1/2 h-px bg-ink-200" />
            {/* night shading */}
            <div className="absolute inset-y-0 left-0 w-1/4 rounded-l-full bg-brand-100/60" />
            <div className="absolute inset-y-0 right-0 w-[12%] rounded-r-full bg-brand-100/60" />
            {dots.map((h, i) => (
              <span
                key={h}
                className={cn(
                  "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 ring-2 ring-ink-50 transition-transform duration-500 dark:bg-brand-400",
                  on ? "scale-100" : "scale-0",
                )}
                style={{ left: `${(h / 24) * 100}%`, transitionDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
          <p {...appear(on, 900)} className={cn(appear(on, 900).className, "text-xs text-ink-600")}>
            <span className="font-mono font-semibold text-ink-900">{ex.time}</span> · “{ex.question}” · {ex.result}
          </p>
        </>
      )}
    </Stage>
  );
}

function SpeedVisual() {
  const rows = [
    { ...whyVisuals.speed.agent, width: "8%", bar: "bg-brand-600 dark:bg-brand-400", strong: true },
    { ...whyVisuals.speed.human, width: "100%", bar: "bg-ink-300", strong: false },
  ];
  return (
    <Stage className="flex h-40 flex-col justify-center gap-4">
      {(on) =>
        rows.map((r, i) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs">
              <span className={r.strong ? "font-semibold text-ink-900" : "text-ink-600"}>{r.label}</span>
              <span className={cn("font-mono", r.strong ? "font-semibold text-brand-700 dark:text-brand-300" : "text-ink-600")}>{r.value}</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-ink-200/60">
              <div
                className={cn("h-full rounded-full transition-[width] ease-out", r.bar)}
                style={{ width: on ? r.width : "0%", transitionDuration: i === 0 ? "500ms" : "1600ms", transitionDelay: `${i * 200}ms` }}
              />
            </div>
          </div>
        ))
      }
    </Stage>
  );
}

function ChannelsVisual() {
  return (
    <Stage className="flex h-40 items-center justify-center">
      {(on) => (
        <div className="grid grid-cols-7 items-center gap-2">
          {channels.slice(0, 3).map((c, i) => (
            <span
              key={c.id}
              className={cn("flex size-9 items-center justify-center rounded-xl transition-all duration-500", c.accent, on ? "scale-100 opacity-100" : "scale-50 opacity-0")}
              style={{ transitionDelay: `${i * 90}ms` }}
              title={c.name}
            >
              <c.icon className="size-4" />
            </span>
          ))}
          <span className="flex size-11 items-center justify-center rounded-2xl bg-surface-raised shadow-md ring-1 ring-ink-200">
            <LogoMark className="h-6" />
          </span>
          {channels.slice(3, 6).map((c, i) => (
            <span
              key={c.id}
              className={cn("flex size-9 items-center justify-center rounded-xl transition-all duration-500", c.accent, on ? "scale-100 opacity-100" : "scale-50 opacity-0")}
              style={{ transitionDelay: `${(i + 3) * 90}ms` }}
              title={c.name}
            >
              <c.icon className="size-4" />
            </span>
          ))}
        </div>
      )}
    </Stage>
  );
}

function SetupVisual() {
  const { steps, doneLabel } = whyVisuals.setup;
  return (
    <Stage className="flex h-40 flex-col justify-center gap-2.5">
      {(on) =>
        steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full transition-colors duration-500",
                on ? "bg-emerald-500 text-white" : "bg-ink-200 text-transparent",
              )}
              style={{ transitionDelay: `${i * 450}ms` }}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="flex-1 font-medium text-ink-800">{s}</span>
            {i === steps.length - 1 && (
              <span
                className={cn(
                  "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 transition-opacity duration-500 dark:bg-emerald-500/10 dark:text-emerald-300",
                  on ? "opacity-100" : "opacity-0",
                )}
                style={{ transitionDelay: "1400ms" }}
              >
                {doneLabel}
              </span>
            )}
          </div>
        ))
      }
    </Stage>
  );
}

const visuals: Record<WhyReason["id"], () => ReactNode> = {
  knowledge: KnowledgeVisual,
  "always-on": AlwaysOnVisual,
  speed: SpeedVisual,
  channels: ChannelsVisual,
  setup: SetupVisual,
};

export function WhyVisual({ id }: { id: WhyReason["id"] }) {
  const Visual = visuals[id];
  return <Visual />;
}
