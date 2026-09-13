"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Shield, Webhook, Check, Save, Loader2, UserCheck } from "lucide-react";

interface TeamNotificationsTabProps {
  userEmail: string;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

export default function TeamNotificationsTab({
  userEmail,
  onSave,
  isSaving,
  saveSuccess,
}: TeamNotificationsTabProps) {
  const [notifyEscalation, setNotifyEscalation] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          Team Role & Alert Notifications
        </h3>
        <p className="text-xs text-zinc-400">
          Manage workspace owner credentials, notification preferences, and external webhooks.
        </p>
      </div>

      {/* Account Owner Card */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/10">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Workspace Owner</h4>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-zinc-500" />
              {userEmail || "owner@workspace.com"}
            </p>
          </div>
        </div>

        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs px-2.5 py-1">
          Super Admin
        </Badge>
      </div>

      {/* Email Alert Toggles */}
      <div className="space-y-4 pt-2 border-t border-white/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          Email Alert Preferences
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/30">
            <div className="space-y-0.5">
              <h5 className="text-xs font-semibold text-zinc-200">Escalated Chat Notifications</h5>
              <p className="text-[11px] text-zinc-400">Receive an instant email whenever a customer requests human intervention.</p>
            </div>
            <Switch checked={notifyEscalation} onCheckedChange={setNotifyEscalation} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/30">
            <div className="space-y-0.5">
              <h5 className="text-xs font-semibold text-zinc-200">Daily Support Summary Digest</h5>
              <p className="text-[11px] text-zinc-400">Receive a daily morning email summarizing customer satisfaction rates and active chats.</p>
            </div>
            <Switch checked={notifyDailyDigest} onCheckedChange={setNotifyDailyDigest} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/30">
            <div className="space-y-0.5">
              <h5 className="text-xs font-semibold text-zinc-200">Weekly Performance Insights</h5>
              <p className="text-[11px] text-zinc-400">Weekly breakdown of top asked topics, section accuracy, and knowledge gaps.</p>
            </div>
            <Switch checked={notifyWeeklyReport} onCheckedChange={setNotifyWeeklyReport} />
          </div>
        </div>
      </div>

      {/* Webhook Integration */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Webhook className="w-3.5 h-3.5 text-emerald-400" />
          Slack / Discord / Custom Webhook URL
        </label>
        <p className="text-xs text-zinc-400">
          Post realtime chat alerts directly into a Slack or Discord channel.
        </p>
        <Input
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          className="bg-black/40 border-white/10 text-xs font-mono text-zinc-100 h-10 rounded-xl focus:border-white/20"
        />
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 h-9 rounded-xl gap-2 shadow-md"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {isSaving ? "Saving Notifications..." : saveSuccess ? "Saved Preferences!" : "Save Notification Preferences"}
        </Button>
      </div>
    </div>
  );
}
