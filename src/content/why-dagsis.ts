import { Brain, Clock3, Layers, Wand2, Zap } from "lucide-react";
import type { SectionIntro, WhyReason } from "@/types/content";

export const whyIntro: SectionIntro = {
  eyebrow: "Why Dagsis",
  titleAccent: "One platform.",
  accentFirst: true,
  title: "Every customer conversation.",
  description:
    "Built for small teams that can't staff a support desk around the clock, and bigger ones that are tired of answering the same thing twice.",
};

/**
 * Rendered as a bento grid; each reason's `id` picks its illustration
 * (components/sections/why-dagsis/WhyVisuals.tsx). Order = grid order.
 */
export const reasons: WhyReason[] = [
  {
    icon: Brain,
    id: "knowledge",
    title: "Business-specific knowledge",
    description:
      "Answers come from your documents and website, not from whatever the internet thinks.",
  },
  {
    icon: Clock3,
    id: "always-on",
    title: "24/7 availability",
    description: "Nights, weekends and holidays. Your customers never wait for business hours.",
  },
  {
    icon: Zap,
    id: "speed",
    title: "Instant responses",
    description: "Replies in seconds, even when thousands of customers write at once.",
  },
  {
    icon: Layers,
    id: "channels",
    title: "Multi-channel",
    description: "Website, WhatsApp, Instagram, Facebook, Telegram and Discord, all managed from one dashboard.",
  },
  {
    icon: Wand2,
    id: "setup",
    title: "Easy setup",
    description: "No code and no ML expertise. If you can upload a file, you can launch an agent.",
  },
];

/** Fills the last grid cell. */
export const whyCta = {
  title: "Ready when you are",
  description: "Launch your first agent today and see the difference this week.",
  label: "Start for Free",
};

/**
 * Copy shown inside the Why Dagsis illustrations
 * (components/sections/why-dagsis/WhyVisuals.tsx). Figures are illustrative;
 * replace with real numbers when available.
 */
export const whyVisuals = {
  knowledge: {
    question: "Can I return items I bought on sale?",
    answer: "Yes, within 14 days, as long as the tags are still attached. Want me to start a return?",
    source: "Returns policy.docx · section 3",
    badge: "Answered from your docs",
  },
  alwaysOn: {
    /** Hours of the day (0–24) with a conversation dot on the timeline. */
    conversationHours: [1.2, 3.2, 5.6, 8.4, 11, 13.6, 16.2, 18.8, 21.2, 23],
    example: { time: "03:12", question: "Is my order shipped?", result: "answered in 2s" },
  },
  speed: {
    agent: { label: "Dagsis agent", value: "2s" },
    human: { label: "Typical email reply", value: "12h" },
  },
  setup: {
    steps: ["Upload your docs", "Choose a tone", "Go live"],
    doneLabel: "Live",
  },
};
