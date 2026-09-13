import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, BookOpen, MessageSquare, ShieldCheck, Zap } from "lucide-react";


interface SectionFormFieldProps {
  formData: SectionFormData;
  setFormData: (data: SectionFormData) => void;
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
  knowledgeSources: KnowledgeSource[];
  isLoadingSources: boolean;
  isDisabled: boolean;
}

const TONE_OPTIONS = [
  { value: "strict", label: "Strict",icon: ShieldCheck },
  { value: "neutral", label: "Neutral", icon: MessageSquare },
  { value: "Friendly", label: "Friendly", icon: Zap },
  { value: "Empathetic", label: "Empathetic", icon: BookOpen },
];

const SectionFormFields = ({
  formData,
  setFormData,
  selectedSources,
  setSelectedSources,
  knowledgeSources,
  isLoadingSources,
  isDisabled,
}: SectionFormFieldProps) => {
  return (
    <div className="space-y-8 pb-4">
      {/* SECTION: BASICS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Basics</h4>
        </div>
        
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-300">Section Name</Label>
            <Input
              placeholder="e.g. Billing Policy"
              className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isDisabled}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-300">Description</Label>
            <Input
              placeholder="When should the AI use this?"
              className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isDisabled}
            />
            <p className="text-[11px] text-zinc-500 italic">
              Used by the routing model to decide when to activate this section.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DATA SOURCES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Data Sources</h4>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-white/5">
            {selectedSources.length} attached
          </span>
        </div>

        <Select
          value={selectedSources[0] || ""}
          onValueChange={(value) => {
            if (!selectedSources.includes(value)) {
              setSelectedSources([...selectedSources, value]);
            }
          }}
          disabled={isDisabled}
        >
          <SelectTrigger className="bg-zinc-950/50 border-white/10 text-zinc-200">
            <SelectValue placeholder={isLoadingSources ? "Loading sources..." : "Add a knowledge source"} />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 text-zinc-300">
            {knowledgeSources.length > 0 ? (
              knowledgeSources.map((source) => {
                const sourceKey = source._id || source.id;
                return (
                  <SelectItem key={sourceKey} value={sourceKey} className="focus:bg-indigo-500/20 focus:text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 font-mono uppercase">
                        {source.type}
                      </span>
                      <span>{source.name}</span>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="none" disabled>No sources available</SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Selected Sources Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedSources.map((sourceId) => {
            const source = knowledgeSources.find((s) => s._id === sourceId || s.id === sourceId);
            if (!source) return null;
            return (
              <div
                key={source._id || source.id}
                className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/20 pl-2 pr-1 py-1 rounded-md group"
              >
                <span className="text-xs text-indigo-300 font-medium">{source.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-red-500/20 hover:text-red-400 text-zinc-500 transition-colors"
                  onClick={() => setSelectedSources(selectedSources.filter((id) => id !== sourceId))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: TONE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Tone & Personality</h4>
        </div>
        
        <RadioGroup
          value={formData.tone}
          onValueChange={(value) => setFormData({ ...formData, tone: value as Tone })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {TONE_OPTIONS.map((option) => (
            <div key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
              <Label
                htmlFor={option.value}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-950/40 p-4 hover:bg-zinc-900/60 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/5 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <option.icon className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                     <span className="text-sm text-zinc-200 font-semibold">{option.label}</span>
                  </div>
              
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>

      {/* SECTION: SCOPE RULES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Scope Rules</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-emerald-500/80">Allowed Topics</Label>
            <Input
              className="bg-zinc-950/50 border-white/10 text-white text-sm"
              placeholder="billing, refund..."
              value={formData.allowedTopics}
              onChange={(e) => setFormData({ ...formData, allowedTopics: e.target.value })}
              disabled={isDisabled}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-red-400/80">Blocked Topics</Label>
            <Input
              className="bg-zinc-950/50 border-white/10 text-white text-sm"
              placeholder="technical issues..."
              value={formData.blockedTopics}
              onChange={(e) => setFormData({ ...formData, blockedTopics: e.target.value })}
              disabled={isDisabled}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectionFormFields;