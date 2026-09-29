import { Check } from "lucide-react";
import { easeOut, lerp, range } from "@/hooks/useScrollProgress";
import { LogoMark } from "@/components/shared/Logo";

/**
 * Transition accent for the Product tour: while one stop hands over to the
 * next, a Dagsis message bubble pops up in the gap, "types" for a moment,
 * then confirms the next stop (e.g. "✓ Agent Ava is ready"), and fades out
 * as the new card settles. It drifts right → left with the cards.
 *
 * @param note  status text for the incoming stop
 * @param t     progress through the transition, 0→1
 */
export function TourBubble({ note, t, compact = false }: { note: string; t: number; compact?: boolean }) {
  const appear = easeOut(range(t, 0.08, 0.3));
  const fade = 1 - range(t, 0.75, 0.95);
  const opacity = Math.min(appear, fade);
  if (opacity <= 0) return null;
  const typed = t > 0.34; // typing dots first, then the message

  return (
    <div
      className={compact ? "pointer-events-none absolute top-0 left-1/2 z-[1500]" : "pointer-events-none absolute top-[14%] z-[1500]"}
      style={{
        left: compact ? undefined : `${lerp(52, 34, t)}%`,
        opacity,
        transform: `${compact ? "translateX(-50%) " : ""}translateY(${lerp(16, 0, appear)}px) scale(${lerp(0.85, 1, appear) * (compact ? 0.85 : 1)})`,
      }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 rounded-2xl rounded-bl-md bg-surface-raised py-3 pr-5 pl-3 shadow-2xl shadow-brand-900/20 ring-1 ring-ink-200">
        <LogoMark className="h-8" />
        {typed ? (
          <span className="flex items-center gap-2 text-base font-semibold whitespace-nowrap text-ink-950">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {note}
          </span>
        ) : (
          <span className="flex gap-1.5 px-1 py-2">
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-2 animate-typing rounded-full bg-ink-400" style={{ animationDelay: `${d}ms` }} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
