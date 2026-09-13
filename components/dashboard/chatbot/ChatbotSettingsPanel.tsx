"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Code,
  BookOpen,
  Check,
  Copy,
  Save,
  Loader2,
  Sparkles,
  ExternalLink,
  Layers,
  FileText,
} from "lucide-react";

interface ChatbotSettingsPanelProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  sections: Section[];
  isSaving: boolean;
  onSave: () => Promise<void>;
  botId?: string;
}

const COLOR_PRESETS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Electric", value: "#2563eb" },
  { name: "Obsidian", value: "#18181b" },
];

export default function ChatbotSettingsPanel({
  primaryColor,
  setPrimaryColor,
  welcomeMessage,
  setWelcomeMessage,
  sections,
  isSaving,
  onSave,
  botId = "bot_default",
}: ChatbotSettingsPanelProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const scriptTagCode = `<script 
  src="${typeof window !== "undefined" ? window.location.origin : ""}/api/embed/widget.js" 
  data-bot-id="${botId}" 
  async
></script>`;

  const reactEmbedCode = `import { SupportChatbot } from "@support-bot/react";

export default function App() {
  return (
    <SupportChatbot 
      botId="${botId}" 
      themeColor="${primaryColor}"
      welcomeMessage="${welcomeMessage.replace(/"/g, '\\"')}" 
    />
  );
}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveClick = async () => {
    await onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <Card className="flex flex-col border border-white/10 bg-gradient-to-b from-[#0f0f13] to-[#0A0A0E] rounded-2xl overflow-hidden shadow-2xl h-full min-h-[500px]">
      <Tabs defaultValue="appearance" className="flex flex-col h-full w-full">
        {/* Header Tabs */}
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
          <TabsList className="bg-black/40 border border-white/10 p-1 rounded-xl">
            <TabsTrigger
              value="appearance"
              className="px-3 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 gap-2 transition-all"
            >
              <Palette className="w-3.5 h-3.5" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className="px-3 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 gap-2 transition-all"
            >
              <Code className="w-3.5 h-3.5" />
              Embed Code
            </TabsTrigger>
            <TabsTrigger
              value="knowledge"
              className="px-3 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 gap-2 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Knowledge ({sections.length})
            </TabsTrigger>
          </TabsList>

          <Button
            size="sm"
            onClick={handleSaveClick}
            disabled={isSaving}
            style={{ backgroundColor: primaryColor }}
            className="text-white hover:opacity-90 transition-all font-medium gap-1.5 rounded-lg text-xs px-3 shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
          </Button>
        </div>

        {/* Tab 1: Appearance */}
        <TabsContent value="appearance" className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar m-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Primary Brand Color
              </label>
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {primaryColor}
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setPrimaryColor(preset.value)}
                  className={`h-9 rounded-xl transition-all border relative flex items-center justify-center ${
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

            {/* Custom Hex input */}
            <div className="flex items-center gap-3 pt-2">
              <div
                className="w-9 h-9 rounded-xl border border-white/20 shrink-0 shadow-inner"
                style={{ backgroundColor: primaryColor }}
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#4f46e5"
                className="bg-black/40 border-white/10 text-white font-mono text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Welcome Greeting Message
            </label>
            <p className="text-xs text-zinc-400">
              This initial message will be displayed automatically when a user opens your support widget.
            </p>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              placeholder="Hi! How can I help you today?"
              className="bg-black/40 border-white/10 text-zinc-100 text-sm focus:border-white/20 transition-all rounded-xl resize-none"
            />
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Live Preview Sync</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Active
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Any changes made here are instantly reflected in the simulator on the left. Click <strong className="text-zinc-200">Save Changes</strong> to publish updates live to your widget.
            </p>
          </div>
        </TabsContent>

        {/* Tab 2: Embed Code */}
        <TabsContent value="embed" className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar m-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                HTML Script Tag
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(scriptTagCode, "script")}
                className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/10 gap-1 rounded-lg"
              >
                {copiedType === "script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === "script" ? "Copied" : "Copy Tag"}
              </Button>
            </div>
            <p className="text-xs text-zinc-400">
              Paste this snippet right before the closing <code className="text-zinc-300 bg-white/5 px-1 rounded">&lt;/body&gt;</code> tag on any website.
            </p>
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              {scriptTagCode}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                React / Next.js Integration
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(reactEmbedCode, "react")}
                className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/10 gap-1 rounded-lg"
              >
                {copiedType === "react" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === "react" ? "Copied" : "Copy Component"}
              </Button>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
              {reactEmbedCode}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Knowledge Overview */}
        <TabsContent value="knowledge" className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar m-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Connected Knowledge Sections
            </label>
            <Badge variant="outline" className="text-xs text-zinc-300 border-white/10 bg-white/5">
              {sections.length} Active
            </Badge>
          </div>

          {sections.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-400">No custom sections defined</p>
              <p className="text-xs text-zinc-400 mt-1">
                Go to the <strong className="text-zinc-300">Sections</strong> tab in the sidebar to create topic categories and ground your assistant.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between hover:border-white/20 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">{section.name}</span>
                      <Badge className="text-[10px] uppercase px-1.5 py-0 bg-white/10 text-zinc-300 border-none font-mono">
                        {section.tone}
                      </Badge>
                    </div>
                    {section.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1">{section.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-white/5 text-zinc-400 text-[11px]">
                    {section.sourceCount || 0} Sources
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
