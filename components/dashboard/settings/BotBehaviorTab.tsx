"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, MessageCircle, Sparkles, Check, Save, Loader2, ShieldCheck, HeartHandshake, Smile, Scale } from "lucide-react";

interface BotBehaviorTabProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  defaultTone: Tone;
  setDefaultTone: (tone: Tone) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

const COLOR_PRESETS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Electric Blue", value: "#2563eb" },
  { name: "Obsidian Dark", value: "#18181b" },
];

const TONE_OPTIONS: Array<{ key: Tone; label: string; desc: string; icon: any }> = [
  { key: "strict", label: "Strict & Precise", desc: "Answers strictly based on official knowledge documentation without speculation.", icon: ShieldCheck },
  { key: "neutral", label: "Neutral Professional", desc: "Balanced, clear, and direct corporate support tone.", icon: Scale },
  { key: "Friendly", label: "Friendly & Warm", desc: "Welcoming, enthusiastic, and highly conversational tone.", icon: Smile },
  { key: "empathetic", label: "Empathetic & Supportive", desc: "Understanding and gentle tone for customer issue resolution.", icon: HeartHandshake },
];

export default function BotBehaviorTab({
  primaryColor,
  setPrimaryColor,
  welcomeMessage,
  setWelcomeMessage,
  defaultTone,
  setDefaultTone,
  onSave,
  isSaving,
  saveSuccess,
}: BotBehaviorTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Chatbot Theme & Default Tone
        </h3>
        <p className="text-xs text-zinc-400">
          Personalize widget primary branding color, initial greeting, and AI conversation tone.
        </p>
      </div>

      {/* Brand Color Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            Primary Theme Accent Color
          </label>
          <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {primaryColor}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setPrimaryColor(preset.value)}
              className={`h-10 rounded-xl transition-all border relative flex items-center justify-center ${
                primaryColor.toLowerCase() === preset.value.toLowerCase()
                  ? "border-white scale-105 shadow-lg ring-2 ring-white/20"
                  : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            >
              {primaryColor.toLowerCase() === preset.value.toLowerCase() && (
                <Check className="w-4 h-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div
            className="w-9 h-9 rounded-xl border border-white/20 shrink-0 shadow-inner"
            style={{ backgroundColor: primaryColor }}
          />
          <Input
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            placeholder="#4f46e5"
            className="bg-black/40 border-white/10 text-white font-mono text-xs h-9 max-w-[200px]"
          />
        </div>
      </div>

      {/* Welcome Greeting Message */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          Default Welcome Greeting Message
        </label>
        <Textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          rows={3}
          placeholder="Hi! How can I help you today?"
          className="bg-black/40 border-white/10 text-xs text-zinc-100 rounded-xl resize-none"
        />
      </div>

      {/* Default AI Tone Cards */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Default AI Tone of Voice
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = defaultTone === opt.key;
            return (
              <div
                key={opt.key}
                onClick={() => setDefaultTone(opt.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? "bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20"
                    : "bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-xs font-semibold text-zinc-200">{opt.label}</span>
                  </div>
                  {isSelected && <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">Active</Badge>}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          style={{ backgroundColor: primaryColor }}
          className="text-white hover:opacity-90 font-medium text-xs px-5 h-9 rounded-xl gap-2 shadow-md"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {isSaving ? "Saving Settings..." : saveSuccess ? "Saved Successfully!" : "Save Branding & Behavior"}
        </Button>
      </div>
    </div>
  );
}
