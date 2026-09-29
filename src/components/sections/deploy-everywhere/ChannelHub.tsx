"use client";

import { useRef, type CSSProperties } from "react";
import { channels } from "@/content";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/Logo";

/** Diagram coordinate space (SVG viewBox). */
const W = 1000;
const H = 440;
const CX = W / 2;
const CY = H / 2;

/**
 * Where each channel pill sits, alternating left/right so the diagram stays
 * balanced. Add more points here if more channels are added.
 */
const points = [
  { x: 170, y: 120 },
  { x: 830, y: 120 },
  { x: 270, y: 330 },
  { x: 730, y: 330 },
  { x: 90, y: 250 },
  { x: 910, y: 250 },
];

/** Faint decorative lines fanning out to the edges (as in the reference). */
const edgeYs = [30, 95, 165, 275, 345, 410];

/** S-curve from the centre to (x, y). */
const curve = (x: number, y: number) => {
  const mx = (CX + x) / 2;
  return `M${CX},${CY} C${mx},${CY} ${mx},${y} ${x},${y}`;
};

/**
 * Motion: pills pop in one by one when the diagram scrolls into view, glowing
 * dots travel along each connector (youratlas), and a soft arc rotates
 * around the centre orb.
 */
export function ChannelHub() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });

  return (
    <div ref={ref} className="relative mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:block lg:aspect-[1000/440]">
      {/* Connectors (desktop) */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 hidden size-full text-ink-300 lg:block"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hub-line" x1="0" x2="1">
            <stop offset="0%" stopColor="#56bbf7" />
            <stop offset="50%" stopColor="#3171f3" />
            <stop offset="100%" stopColor="#56bbf7" />
          </linearGradient>
        </defs>
        {edgeYs.flatMap((y) => [
          <path key={`l${y}`} d={curve(0, y)} stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" opacity="0.7" />,
          <path key={`r${y}`} d={curve(W, y)} stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" opacity="0.7" />,
        ])}
        {channels.map((c, i) => {
          const p = points[i % points.length];
          const d = curve(p.x, p.y);
          return (
            <g key={c.id}>
              <path d={d} stroke="url(#hub-line)" strokeWidth="1.5" strokeDasharray="5 3" className="animate-dash" />
              {/* Message travelling between the channel and Dagsis; alternates direction. */}
              <circle r="4" fill="#3171f3" opacity="0.9">
                <animateMotion
                  dur={`${2.6 + i * 0.35}s`}
                  repeatCount="indefinite"
                  path={d}
                  keyPoints={i % 2 ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
              <circle r="9" fill="#3171f3" opacity="0.18">
                <animateMotion
                  dur={`${2.6 + i * 0.35}s`}
                  repeatCount="indefinite"
                  path={d}
                  keyPoints={i % 2 ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Centre orb */}
      <div className="col-span-2 mx-auto mb-6 sm:col-span-3 lg:absolute lg:top-1/2 lg:left-1/2 lg:mb-0 lg:-translate-x-1/2 lg:-translate-y-1/2">
        <div className="relative flex size-36 items-center justify-center rounded-full bg-surface-raised shadow-xl shadow-black/10 ring-1 ring-ink-200 sm:size-44">
          <div
            className="absolute -inset-1 -z-10 animate-spin-slow rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,#56bbf7_80deg,transparent_160deg,#3171f3_260deg,transparent_360deg)] opacity-60 blur-md"
            aria-hidden="true"
          />
          <LogoMark className="h-16 sm:h-20" />
        </div>
      </div>

      {/* Channel pills */}
      {channels.map((c, i) => {
        const p = points[i % points.length];
        return (
          <div
            key={c.id}
            title={c.description}
            className={cn(
              "flex items-center justify-center gap-2.5 rounded-full bg-surface-raised px-4 py-3 shadow-lg shadow-black/5 ring-1 ring-ink-200/80 lg:py-2.5",
              "transition-[opacity,scale] duration-500 ease-out",
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0",
              "lg:absolute lg:top-[var(--y)] lg:left-[var(--x)] lg:-translate-x-1/2 lg:-translate-y-1/2",
            )}
            style={
              {
                "--x": `${(p.x / W) * 100}%`,
                "--y": `${(p.y / H) * 100}%`,
                transitionDelay: `${200 + i * 120}ms`,
              } as CSSProperties
            }
          >
            <span className={cn("flex size-8 items-center justify-center rounded-full", c.accent)}>
              <c.icon className="size-4" />
            </span>
            <span className="font-semibold text-ink-900">{c.name}</span>
            {c.status === "coming-soon" && (
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">Soon</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
