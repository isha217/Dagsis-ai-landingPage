import { ArrowRight, CalendarDays } from "lucide-react";
import { heroContent } from "@/content";
import { ButtonLink, Container } from "@/components/ui";
import { HeroAgentCard } from "./HeroAgentCard";

/**
 * Hero — reference: youratlas.com
 * Inset card with a light-to-dark gradient in the logo blues (no black):
 *   light theme: pale blue at the top → logo blue at the bottom, navy text
 *   dark theme:  dark blue at the top → logo blue at the bottom, white text
 * Sans + italic serif headline, and the AI agent panel on the right (in
 * place of the reference's toggle widget).
 *
 * Motion: headline words rise in one after another (CSS, so the text paints
 * without waiting for JS) and the agent panel plays sample chats.
 */

/** Splits a phrase into words that animate in with a stagger. */
function StaggerWords({ text, startMs, className }: { text: string; startMs: number; className?: string }) {
  return text.split(" ").map((word, i) => (
    <span key={i} className={className}>
      <span className="inline-block animate-word-in" style={{ animationDelay: `${startMs + i * 70}ms` }}>
        {word}
      </span>{" "}
    </span>
  ));
}

export function Hero() {
  const c = heroContent;

  return (
    <section className="relative isolate px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f3f8ff_0%,#e1eefe_38%,#b7d4fb_66%,#6fa2f6_86%,#3171f3_100%)] pt-28 short:pt-24 dark:bg-[linear-gradient(180deg,#0c1a40_0%,#10245a_40%,#1a3f96_72%,#2f6df4_94%,#56bbf7_100%)] pb-16 sm:rounded-[2.5rem] sm:pt-36 sm:pb-24 lg:short:pt-24 lg:short:pb-12">
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="text-center lg:col-span-7 lg:text-left">
              <div className="animate-fade-up">
                <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-brand-200 dark:bg-white/10 dark:text-white/85 dark:ring-white/15">
                  {c.badge}
                </span>
              </div>

              <h1 className="mt-6 text-5xl leading-[1.02] font-semibold tracking-tight text-balance text-ink-950 sm:text-6xl lg:text-[clamp(3rem,min(5vw,9vh),4.5rem)] dark:text-white lg:short:mt-4">
                <StaggerWords text={c.title} startMs={80} />
                <StaggerWords
                  text={c.titleAccent}
                  startMs={80 + c.title.split(" ").length * 70}
                  className="accent-serif text-brand-600 dark:text-[#9fd6fb]"
                />
              </h1>

              <p
                className="animate-fade-up mx-auto mt-6 max-w-xl text-lg text-pretty text-ink-600 lg:mx-0 dark:text-white/80 lg:short:mt-4 lg:short:text-base"
                style={{ animationDelay: "450ms" }}
              >
                {c.description}
              </p>

              <div
                className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start lg:short:mt-6"
                style={{ animationDelay: "550ms" }}
              >
                <ButtonLink href={c.primaryCta.href} size="lg" className="w-full sm:w-auto">
                  {c.primaryCta.label}
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href={c.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto dark:bg-white/10 dark:text-white dark:ring-white/25 dark:hover:bg-white/15"
                >
                  <CalendarDays className="size-4" />
                  {c.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>

            <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: "200ms" }}>
              <HeroAgentCard />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
