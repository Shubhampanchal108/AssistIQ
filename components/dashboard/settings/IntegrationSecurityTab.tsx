"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, ShieldCheck, Key, Copy, Check, RefreshCw, Lock } from "lucide-react";

interface IntegrationSecurityTabProps {
  botId: string;
  allowedDomains: string;
  setAllowedDomains: (val: string) => void;
  apiKey: string;
  onRegenerateKey: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

export default function IntegrationSecurityTab({
  botId,
  allowedDomains,
  setAllowedDomains,
  apiKey,
  onRegenerateKey,
  onSave,
  isSaving,
  saveSuccess,
}: IntegrationSecurityTabProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const scriptTagCode = `<script 
  src="${typeof window !== "undefined" ? window.location.origin : ""}/api/embed/widget.js" 
  data-bot-id="${botId}" 
  async
></script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptTagCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey || "sb_live_secret_key_84920482");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Widget Integration & Security Whitelist
        </h3>
        <p className="text-xs text-zinc-400">
          Embed script snippets, whitelist authorized website domains, and manage API keys.
        </p>
      </div>

      {/* Script Tag Snippet */}
      <div className="space-y-3 p-4 rounded-xl border border-white/10 bg-black/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            HTML Integration Script Tag
          </label>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyScript}
            className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/10 gap-1 rounded-lg"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedScript ? "Copied Tag" : "Copy Snippet"}
          </Button>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste this snippet right before the closing <code className="text-zinc-300 bg-white/5 px-1 rounded">&lt;/body&gt;</code> tag on your website to display the live chatbot widget.
        </p>
        <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
          {scriptTagCode}
        </div>
      </div>

      {/* Allowed Domain Whitelist */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Allowed Website Domains (CORS Security)
          </label>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Active Whitelist
          </Badge>
        </div>
        <p className="text-xs text-zinc-400">
          Restrict widget rendering exclusively to your authorized domains. Use <code className="text-zinc-300 bg-white/5 px-1 rounded">*</code> to allow all domains or enter comma-separated domains (e.g. <code className="text-zinc-300 bg-white/5 px-1 rounded">https://example.com, https://app.example.com</code>).
        </p>
        <Input
          value={allowedDomains}
          onChange={(e) => setAllowedDomains(e.target.value)}
          placeholder="*"
          className="bg-black/40 border-white/10 text-xs text-zinc-100 font-mono h-10 rounded-xl focus:border-white/20"
        />
      </div>

      {/* API Secret Key Manager */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            API Secret Key
          </label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowKey(!showKey)}
              className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/10"
            >
              {showKey ? "Hide" : "Reveal"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyKey}
              className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/10 gap-1"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey ? "Copied" : "Copy Key"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey || "sb_live_secret_key_849204829103"}
            readOnly
            className="bg-black/40 border-white/10 text-xs font-mono text-zinc-300 h-10 rounded-xl"
          />
          <Button
            size="sm"
            onClick={onRegenerateKey}
            variant="outline"
            className="h-10 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 text-xs gap-1.5 rounded-xl shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 h-9 rounded-xl gap-2 shadow-md"
        >
          {isSaving ? "Saving..." : saveSuccess ? "Saved Security Settings!" : "Save Security Whitelist"}
        </Button>
      </div>
    </div>
  );
}
