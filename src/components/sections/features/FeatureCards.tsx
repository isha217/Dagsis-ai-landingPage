import Image from "next/image";
import type { Feature } from "@/types/content";

/** Card size, matching the reference (380×420, 300×340 on small screens). */
/**
 * Card size: 380:420 ratio (the reference's), at most 320×354, and never
 * taller than ~52% of the window, so it stays in proportion at any zoom.
 */
const card = "relative aspect-[380/420] h-[min(340px,56svh)] shrink-0 overflow-hidden rounded-[28px] sm:h-[min(354px,52svh)]";
const sizes = "320px";

/**
 * Feature card (dagis.framer.website "use cases" style): a brand gradient with
 * an inset frosted panel. Title + description at the top, the headline stat
 * at the bottom. Colours are fixed (the background is always light), so it reads
 * the same in both themes.
 */
export function FeatureCard({ feature, background }: { feature: Feature; background: string }) {
  return (
    <article className={card}>
      <Image src={background} alt="" fill sizes={sizes} className="object-cover" draggable={false} />
      <div className="absolute inset-2.5 flex flex-col justify-between rounded-[20px] bg-gradient-to-b from-white/85 via-white/45 to-white/40 p-5 ring-1 ring-white/60 backdrop-blur-md sm:p-6">
        <div>
          <h3 className="text-xl leading-tight font-semibold text-[#0d1328] sm:text-2xl">{feature.title}</h3>
          <p className="mt-2.5 text-sm leading-snug text-[#30364a] sm:text-[15px]">{feature.description}</p>
        </div>
        <div>
          <p className="text-base font-semibold text-[#0d1328] sm:text-lg">{feature.stat.value}</p>
          <p className="mt-1 text-[13px] font-medium text-[#1d2336] sm:text-sm">{feature.stat.label}</p>
        </div>
      </div>
    </article>
  );
}

/** Full-bleed picture card (the feature's product scene) placed after each feature card. */
export function PhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className={card}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" draggable={false} />
    </figure>
  );
}
