"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, Sparkles } from "lucide-react";

interface EmbedQuickCardProps {
  botId: string;
  primaryColor: string;
}

export default function EmbedQuickCard({ botId, primaryColor }: EmbedQuickCardProps) {
  const [copied, setCopied] = useState(false);

  const scriptSnippet = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/embed/widget.js" data-bot-id="${botId || "bot_demo"}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-[#09090d] rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            Quick Widget Integration
          </h3>
          <p className="text-xs text-zinc-400">Deploy your chatbot to any website with 1 line of code.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-white/20 shadow-md" style={{ backgroundColor: primaryColor }} title="Theme Color" />
          <Button
            size="sm"
            onClick={handleCopy}
            style={{ backgroundColor: primaryColor }}
            className="text-white hover:opacity-90 text-xs px-3 h-7 rounded-lg gap-1.5 shadow-md font-medium cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Tag"}
          </Button>
        </div>
      </div>

      <div className="p-3.5 bg-black/80 rounded-xl border border-zinc-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed shadow-inner">
        {scriptSnippet}
      </div>
    </div>
  );
}
