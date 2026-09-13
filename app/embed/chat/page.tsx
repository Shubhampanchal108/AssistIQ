"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  RefreshCcw,
  X,
  Sparkles,
  MessageCircle,
} from "lucide-react";

interface EmbedSection {
  id: string;
  name: string;
  description?: string;
}

interface EmbedConfig {
  botId: string;
  color: string;
  welcome_message: string;
  business_name: string;
  sections: EmbedSection[];
}

export default function EmbeddedChatPage() {
  const [config, setConfig] = useState<EmbedConfig | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const botId = urlParams.get("botId") || "bot_default";

        const res = await fetch(
          `/api/embed/info?botId=${encodeURIComponent(botId)}`,
        );
        if (res.ok) {
          const data: EmbedConfig = await res.json();
          setConfig(data);
          const welcome =
            data.welcome_message || "Hi! How can I help you today?";
          setMessages([
            {
              role: "assistant",
              content: welcome,
              isWelcome: true,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading embedded bot config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !config) return;

    const userMessage = input.trim();
    const userMsgObj = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/embed/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: config.botId,
          message: userMessage,
          activeSection,
          history: messages,
          conversationId,
        }),
      });

      if (res.ok) {
        const aiMsg = await res.json();
        if (aiMsg.conversationId) setConversationId(aiMsg.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiMsg.content,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I am having trouble connecting to support right now. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error sending embedded chat message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Network connection error. Please check your internet connection.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSectionClick = (name: string) => {
    setActiveSection(name);
    const userMsg = { role: "user", content: name, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        role: "assistant",
        content: `You selected "${name}". Ask me any question about this topic!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const handleReset = () => {
    setActiveSection(null);
    setConversationId(null);
    setMessages([
      {
        role: "assistant",
        content: config?.welcome_message || "Hi! How can I help you today?",
        isWelcome: true,
        timestamp: new Date(),
      },
    ]);
  };

  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage("sb-close-widget", "*");
    }
  };

  const primaryColor = config?.color || "#4f46e5";

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Initializing Customer Support AI...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0f0f13] to-[#0A0A0E] text-zinc-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Header Bar */}
      <div
        className="h-16 px-4 flex items-center justify-between shadow-lg shrink-0 relative transition-all"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 flex items-center justify-center text-white shadow-inner shrink-0">
            <img
              src="/logo.jpeg"
              alt="Assist IQ"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white tracking-tight">
                {config?.business_name || "Support Assistant"}
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-white/80 font-medium">
              Online • Powered by AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Reset Chat"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Close Widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-transparent">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex w-full flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                isUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex max-w-[88%] gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-white shadow-sm text-xs ${
                    isUser ? "bg-zinc-800 text-zinc-300" : ""
                  }`}
                  style={!isUser ? { backgroundColor: primaryColor } : {}}
                >
                  {isUser ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                <div className="space-y-1 flex flex-col items-start w-full">
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm border border-white/5 ${
                      isUser
                        ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-100 rounded-tr-xs"
                        : "bg-[#1A1A20] text-zinc-200 rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.isWelcome &&
                    config?.sections &&
                    config.sections.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 animate-in fade-in duration-500">
                        {config.sections.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => handleSectionClick(sec.name)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all shadow-sm ${
                              activeSection === sec.name
                                ? "bg-white text-black font-semibold border-white"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {sec.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex w-full justify-start items-start gap-2.5 animate-in fade-in duration-300">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#1A1A20] border border-white/5 shadow-sm rounded-tl-xs flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-[#0A0A0E]/95 backdrop-blur-xl border-t border-white/10 shrink-0 space-y-1.5">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder={
              isTyping ? "Assistant is replying..." : "Ask a question..."
            }
            className="w-full h-11 py-2.5 pl-3.5 pr-12 outline-none text-zinc-100 bg-black/50 border border-white/10 focus:border-white/20 transition-all resize-none rounded-xl disabled:opacity-50 text-[13.5px] placeholder:text-zinc-500 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`absolute right-1.5 h-8 w-8 rounded-lg flex items-center justify-center transition-all shadow-md ${
              !input.trim() || isTyping
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "hover:scale-105 active:scale-95 text-white"
            }`}
            style={
              input.trim() && !isTyping ? { backgroundColor: primaryColor } : {}
            }
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] text-center text-zinc-500 flex items-center justify-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          Powered by <strong className="text-zinc-300">Assist IQ</strong>
        </div>
      </div>
    </div>
  );
}
