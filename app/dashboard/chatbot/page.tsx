'use client';

import ChatSimulator from '@/components/dashboard/chatbot/ChatSimulator';
import ChatbotSettingsPanel from '@/components/dashboard/chatbot/ChatbotSettingsPanel';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface ChatBotMetaData {
  _id?: string;
  id?: string;
  user_email: string;
  color: string;
  welcome_message: string;
  created_at?: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewPortRef = useRef<HTMLDivElement>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [metaData, setMetaData] = useState<ChatBotMetaData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const metaRes = await fetch("/api/chatbot/metadata/fetch");
      if (metaRes.ok) {
        const data = await metaRes.json();
        setMetaData(data);
        if (data) {
          if (data.color) setPrimaryColor(data.color);
          const initialWelcome = data.welcome_message || "Hi! How can I help you today?";
          setWelcomeMessage(initialWelcome);
          setMessages([
            {
              role: "assistant",
              content: initialWelcome,
              isWelcome: true,
              section: null,
            },
          ]);
        }
      }

      const sectionRes = await fetch("/api/section/fetch");
      if (sectionRes.ok) {
        const sectionData = await sectionRes.json();
        const rawSections = sectionData.sections || [];
        const transformedSections = rawSections.map((sec: any) => ({
          id: sec._id || sec.id,
          name: sec.name,
          description: sec.description,
          sourceCount: sec.sourceIds ? sec.sourceIds.length : 0,
          source_ids: sec.sourceIds,
          tone: sec.tone || "neutral",
          scopeLabel: sec.allowedTopics ? "Scoped" : "Global",
          allowed_topics: sec.allowedTopics,
          blocked_topics: sec.blockedTopics,
          status: sec.status || "active",
        }));
        setSections(transformedSections);
      }
    } catch (e) {
      console.error("Error fetching chatbot playground data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (scrollViewPortRef.current) {
      scrollViewPortRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    const userMsg = { role: "user", content: userQuery, section: activeSection };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userQuery,
          activeSection: activeSection,
          history: messages,
          conversationId: conversationId,
        }),
      });

      if (response.ok) {
        const aiMsg = await response.json();
        if (aiMsg.conversationId) {
          setConversationId(aiMsg.conversationId);
        }
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error connecting to the assistant. Please try again.",
            section: activeSection,
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to send chat message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error occurred while fetching AI response.",
          section: activeSection,
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
    const userMsg = { role: "user", content: name, section: null };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const AiMsg = {
        role: "assistant",
        content: `You selected "${name}". Ask me any question related to this category!`,
        section: name,
      };
      setMessages((prev) => [...prev, AiMsg]);
    }, 600);
  };

  const handleReset = () => {
    setActiveSection(null);
    setConversationId(null);
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        isWelcome: true,
        section: null,
      },
    ]);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/chatbot/metadata/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: primaryColor,
          welcome_message: welcomeMessage,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMetaData(updated);
        // Sync welcome message if messages list only has welcome message
        if (messages.length === 1 && messages[0].isWelcome) {
          setMessages([
            {
              role: "assistant",
              content: welcomeMessage,
              isWelcome: true,
              section: null,
            },
          ]);
        }
      }
    } catch (e) {
      console.error("Error saving chatbot metadata:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-top-2 duration-700 flex flex-col gap-6 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-5 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Chatbot Playground & Settings
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Test AI responses in real-time, customize theme colors & greetings, and embed your bot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[12px] font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Online
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[12px] font-mono text-zinc-400 uppercase tracking-wider">
            v1.0 Ready
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px] flex-1 pb-6">
        {/* Left Side: Chat Simulator */}
        <div className="lg:col-span-7 flex flex-col h-[580px] relative">
          <div
            className="absolute -inset-4 blur-3xl rounded-full opacity-15 pointer-events-none transition-all duration-500"
            style={{ backgroundColor: primaryColor }}
          />

          <ChatSimulator
            messages={messages}
            primaryColor={primaryColor}
            sections={sections}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            handleSectionClick={handleSectionClick}
            activeSection={activeSection}
            isTyping={isTyping}
            handleReset={handleReset}
            scrollRef={scrollViewPortRef}
          />
        </div>

        {/* Right Side: Settings & Embed Panel */}
        <div className="lg:col-span-5 flex flex-col h-[580px] relative">
          <ChatbotSettingsPanel
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            welcomeMessage={welcomeMessage}
            setWelcomeMessage={setWelcomeMessage}
            sections={sections}
            isSaving={isSaving}
            onSave={handleSaveSettings}
            botId={metaData?._id || metaData?.id || "bot_demo"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;