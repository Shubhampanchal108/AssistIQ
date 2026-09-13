import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, RefreshCcw, Send, User } from "lucide-react";
import React from "react";

interface ChatSimulatorProps {
  messages: any[];
  primaryColor: string;
  sections: Section[];
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSectionClick: (name: string) => void;
  activeSection: string | null;
  isTyping: boolean;
  handleReset: () => void;
  scrollRef: any;
}

const ChatSimulator = ({
  messages,
  primaryColor,
  sections,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  handleSectionClick,
  activeSection,
  isTyping,
  handleReset,
  scrollRef,
}: ChatSimulatorProps) => {
  const canType = activeSection !== null || sections.length === 0;

  return (
    <Card className="flex flex-col border border-white/10 bg-gradient-to-b from-[#0f0f13] to-[#0A0A0E] rounded-2xl overflow-hidden relative shadow-2xl shadow-black/80 h-full min-h-[500px]">
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-200 flex items-center gap-2">
            Chatbot Simulator
            {activeSection && (
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white font-normal"
                style={{ backgroundColor: primaryColor }}
              >
                {activeSection}
              </span>
            )}
          </span>
        </div>
        <Button
          className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-white/10 transition-all rounded-lg"
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 relative bg-transparent">
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div
              className={cn(
                "flex w-full flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === "user" ? "items-end" : "items-start",
              )}
              key={i}
            >
              <div
                className={cn(
                  "flex max-w-[85%] gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md border border-white/10 overflow-hidden",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-zinc-700 to-zinc-800"
                      : "text-white",
                  )}
                  style={
                    msg.role !== "user" ? { backgroundColor: primaryColor } : {}
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <img
                      src="/logo.jpeg"
                      alt="Assist IQ"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-2 flex flex-col items-start w-full">
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed max-w-max whitespace-pre-wrap shadow-sm border border-white/5",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-100 rounded-tr-sm"
                        : "bg-[#1A1A20] text-zinc-200 rounded-tl-sm",
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.isWelcome && sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.name)}
                          className={cn(
                            "px-3.5 py-1.5 text-xs rounded-full border transition-all shadow-sm active:scale-95",
                            activeSection === section.name
                              ? "bg-white text-black font-semibold border-white"
                              : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20",
                          )}
                        >
                          {section.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start items-start gap-3 animate-in fade-in duration-300">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-md overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <img
                  src="/logo.jpeg"
                  alt="Assist IQ"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#1A1A20] border border-white/5 shadow-sm rounded-tl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="p-4 bg-[#0A0A0E]/90 backdrop-blur-xl border-t border-white/10 shrink-0">
        <div className="relative group">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!canType || isTyping}
            placeholder={
              !canType
                ? "Please select a category above to start."
                : isTyping
                  ? "Assistant is typing..."
                  : "Type a message..."
            }
            className="min-h-[52px] max-h-[150px] w-full py-3.5 pl-4 pr-14 outline-none text-zinc-100 bg-black/40 border border-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all resize-none rounded-xl disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-zinc-600 text-[15px] shadow-inner"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canType || !input.trim() || isTyping}
            className={cn(
              "absolute right-2 bottom-2 h-9 w-9 rounded-lg transition-all shadow-md",
              !canType || !input.trim() || isTyping
                ? "bg-zinc-800/50 text-zinc-500 cursor-not-allowed"
                : "hover:opacity-90 hover:scale-105 active:scale-95",
            )}
            style={
              canType && input.trim() && !isTyping
                ? { backgroundColor: primaryColor, color: "white" }
                : {}
            }
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatSimulator;
