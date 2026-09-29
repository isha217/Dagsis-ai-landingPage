import { featuredTestimonial } from "@/content";
import { Section } from "@/components/ui";
import { Reveal } from "@/components/shared/Reveal";
import { ScrollRevealText } from "@/components/shared/ScrollRevealText";

/**
 * Featured customer story, set like a magazine pull-quote. The quote's words
 * brighten one by one as it scrolls past (joinboardly founders quote).
 * Toggle with `featureFlags.showTestimonial`.
 */
export function Testimonial() {
  const t = featuredTestimonial;

  return (
    <Section id="customers">
      <figure className="mx-auto max-w-4xl">
        <ScrollRevealText
          as="blockquote"
          text={`“${t.quote}”`}
          className="accent-serif text-2xl leading-[1.25] text-balance text-ink-900 sm:text-3xl md:text-4xl lg:text-5xl"
        />

        <Reveal>
          <figcaption className="mt-10 flex flex-col gap-8 border-t border-ink-200 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700">
                {t.avatarInitials}
              </span>
              <div>
                <p className="font-semibold text-ink-900">{t.author}</p>
                <p className="text-sm text-ink-500">
                  {t.role}, {t.company}
                </p>
              </div>
            </div>

            {t.metrics && (
              <dl className="grid grid-cols-3 gap-6 md:gap-10">
                {t.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className="text-2xl font-semibold text-ink-900 sm:text-3xl">{m.value}</dd>
                    <dt className="mt-1 text-xs text-ink-500">{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </figcaption>
        </Reveal>
      </figure>
    </Section>
  );
}
