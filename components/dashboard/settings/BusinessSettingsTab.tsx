"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Mail, Link as LinkIcon, Clock, Save, Loader2, Check } from "lucide-react";

interface BusinessSettingsTabProps {
  formData: {
    business_name: string;
    website_url: string;
    support_email: string;
    external_links: string;
    timezone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "EST", label: "EST (Eastern Standard Time - US)" },
  { value: "PST", label: "PST (Pacific Standard Time - US)" },
  { value: "GMT", label: "GMT (London, Lisbon)" },
  { value: "IST", label: "IST (India Standard Time)" },
  { value: "CET", label: "CET (Central European Time)" },
  { value: "JST", label: "JST (Japan Standard Time)" },
];

export default function BusinessSettingsTab({
  formData,
  setFormData,
  onSave,
  isSaving,
  saveSuccess,
}: BusinessSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          Business & Company Profile
        </h3>
        <p className="text-xs text-zinc-400">
          Configure your business name, primary domain, and support contacts used by the AI chatbot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-zinc-500" />
            Business / Organization Name <span className="text-rose-400">*</span>
          </label>
          <Input
            value={formData.business_name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, business_name: e.target.value }))}
            placeholder="Acme Corp, Inc."
            className="bg-black/40 border-white/10 text-xs text-zinc-100 h-10 rounded-xl focus:border-white/20"
          />
        </div>

        {/* Primary Website URL */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            Primary Website URL <span className="text-rose-400">*</span>
          </label>
          <Input
            value={formData.website_url}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, website_url: e.target.value }))}
            placeholder="https://example.com"
            className="bg-black/40 border-white/10 text-xs text-zinc-100 h-10 rounded-xl focus:border-white/20"
          />
        </div>

        {/* Support Email */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-500" />
            Support Contact Email
          </label>
          <Input
            value={formData.support_email}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, support_email: e.target.value }))}
            placeholder="support@example.com"
            className="bg-black/40 border-white/10 text-xs text-zinc-100 h-10 rounded-xl focus:border-white/20"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            Business Timezone
          </label>
          <Select
            value={formData.timezone || "UTC"}
            onValueChange={(val) => setFormData((prev: any) => ({ ...prev, timezone: val }))}
          >
            <SelectTrigger className="bg-black/40 border-white/10 text-xs text-zinc-200 h-10 rounded-xl">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-zinc-300 text-xs">
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* External Links */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
          External Links & Documentation URLs
        </label>
        <p className="text-[11px] text-zinc-500">
          Comma-separated URLs for your sitemap, API documentation, or help center.
        </p>
        <Textarea
          value={formData.external_links}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, external_links: e.target.value }))}
          rows={3}
          placeholder="https://example.com/docs, https://example.com/faq"
          className="bg-black/40 border-white/10 text-xs text-zinc-100 rounded-xl resize-none"
        />
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving || !formData.business_name || !formData.website_url}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 h-9 rounded-xl gap-2 shadow-md"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {isSaving ? "Saving Profile..." : saveSuccess ? "Saved Successfully!" : "Save Business Profile"}
        </Button>
      </div>
    </div>
  );
}
