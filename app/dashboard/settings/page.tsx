"use client";

import React, { useEffect, useState } from "react";
import BusinessSettingsTab from "@/components/dashboard/settings/BusinessSettingsTab";
import BotBehaviorTab from "@/components/dashboard/settings/BotBehaviorTab";
import IntegrationSecurityTab from "@/components/dashboard/settings/IntegrationSecurityTab";
import TeamNotificationsTab from "@/components/dashboard/settings/TeamNotificationsTab";
import { Card } from "@/components/ui/card";
import { Building2, Sparkles, ShieldCheck, Bell, Check, Loader2 } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"business" | "behavior" | "security" | "notifications">("business");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Business Metadata State
  const [businessData, setBusinessData] = useState({
    business_name: "",
    website_url: "",
    support_email: "",
    external_links: "",
    timezone: "UTC",
    allowed_domains: "*",
    api_key: "",
  });

  // Chatbot Metadata State
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! How can I help you today?");
  const [defaultTone, setDefaultTone] = useState<Tone>("neutral");
  const [userEmail, setUserEmail] = useState("");
  const [botId, setBotId] = useState("bot_demo");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // Fetch Business Metadata
        const metaRes = await fetch("/api/metadata/fetch");
        if (metaRes.ok) {
          const resData = await metaRes.json();
          if (resData.data) {
            const d = resData.data;
            setBusinessData({
              business_name: d.business_name || "",
              website_url: d.website_url || "",
              support_email: d.support_email || "",
              external_links: d.external_links || "",
              timezone: d.timezone || "UTC",
              allowed_domains: d.allowed_domains || "*",
              api_key: d.api_key || "",
            });
            if (d.user_email) setUserEmail(d.user_email);
            if (d._id) setBotId(d._id);
          }
        }

        // Fetch Chatbot Metadata
        const botRes = await fetch("/api/chatbot/metadata/fetch");
        if (botRes.ok) {
          const botData = await botRes.json();
          if (botData) {
            if (botData.color) setPrimaryColor(botData.color);
            if (botData.welcome_message) setWelcomeMessage(botData.welcome_message);
            if (botData.user_email) setUserEmail(botData.user_email);
            if (botData._id) setBotId(botData._id);
          }
        }
      } catch (e) {
        console.error("Error fetching settings data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // 1. Save Business Metadata
      const metaRes = await fetch("/api/metadata/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessData),
      });

      // 2. Save Chatbot Metadata
      const botRes = await fetch("/api/chatbot/metadata/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: primaryColor,
          welcome_message: welcomeMessage,
        }),
      });

      if (metaRes.ok && botRes.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateApiKey = () => {
    const randomKey = "sb_live_" + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    setBusinessData((prev) => ({ ...prev, api_key: randomKey }));
  };

  const tabs = [
    { key: "business", label: "Business Profile", icon: Building2 },
    { key: "behavior", label: "Branding & Behavior", icon: Sparkles },
    { key: "security", label: "Integration & Whitelist", icon: ShieldCheck },
    { key: "notifications", label: "Team & Notifications", icon: Bell },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-top-2 duration-700 min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Account & Widget Settings
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Manage your organization profile, AI chatbot behavior, CORS domain whitelists, and notification alerts.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] lg:h-full lg:min-h-0 flex-1 pb-6 lg:pb-0">
        {/* Left Side: Navigation Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2 shrink-0">
          <Card className="p-2 border border-white/10 bg-gradient-to-b from-[#0f0f13] to-[#0A0A0E] rounded-2xl space-y-1 shadow-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-white/20 shadow-md"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="lg:col-span-9 flex flex-col h-full min-h-0 relative">
          <Card className="p-6 border border-white/10 bg-gradient-to-b from-[#0f0f13] to-[#0A0A0E] rounded-2xl shadow-2xl flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Loading settings...
              </div>
            ) : (
              <>
                {activeTab === "business" && (
                  <BusinessSettingsTab
                    formData={businessData}
                    setFormData={setBusinessData}
                    onSave={handleSaveAll}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                  />
                )}

                {activeTab === "behavior" && (
                  <BotBehaviorTab
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    welcomeMessage={welcomeMessage}
                    setWelcomeMessage={setWelcomeMessage}
                    defaultTone={defaultTone}
                    setDefaultTone={setDefaultTone}
                    onSave={handleSaveAll}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                  />
                )}

                {activeTab === "security" && (
                  <IntegrationSecurityTab
                    botId={botId}
                    allowedDomains={businessData.allowed_domains}
                    setAllowedDomains={(val) =>
                      setBusinessData((prev) => ({ ...prev, allowed_domains: val }))
                    }
                    apiKey={businessData.api_key}
                    onRegenerateKey={handleRegenerateApiKey}
                    onSave={handleSaveAll}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                  />
                )}

                {activeTab === "notifications" && (
                  <TeamNotificationsTab
                    userEmail={userEmail}
                    onSave={handleSaveAll}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                  />
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;