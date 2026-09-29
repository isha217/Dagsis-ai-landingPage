import type { ChatMessage } from "@/types/content";
import { siteConfig } from "@/config/site";
import { ChatBubble } from "@/components/shared/ChatBubble";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";

/**
 * WhatsApp-style conversation panel shown on the right of each use-case
 * card (in the slot where How It Works showed its mini UI). Uses WhatsApp's
 * own light / dark colours.
 */
export function UseCaseChat({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="overflow-hidden rounded-2xl text-left shadow-sm ring-1 ring-ink-200/70">
      {/* Chat header */}
      <div className="flex items-center gap-3 bg-[#008069] px-4 py-3 text-white dark:bg-[#202c33]">
        <span className="flex size-8 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#008069]">
          AI
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-semibold">{siteConfig.name} Assistant</p>
          <p className="text-[11px] text-white">online</p>
        </div>
        <WhatsAppIcon className="size-5 opacity-90" />
      </div>

      {/* Messages */}
      <div className="flex min-h-48 flex-col gap-2 bg-[#efeae2] p-3.5 dark:bg-[#0b141a]">
        <span className="mx-auto mb-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-[#54656f] shadow-sm dark:bg-[#182229] dark:text-[#8696a0]">
          Today
        </span>
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} theme="whatsapp" />
        ))}
      </div>
    </div>
  );
}
