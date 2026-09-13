"use client";

import SectionFormFields from "@/components/dashboard/sections/SectionFormFields";
import SectionTable from "@/components/dashboard/sections/SectionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const INITIAL_FORM_DATA: SectionFormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehavior: "escalate",
};

const Sections = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    [],
  );
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch("/api/knowledge/fetch");
        if (!response.ok) {
          throw new Error("Failed to fetch knowledge sources");
        }
        const data = await response.json();
        setKnowledgeSources(data.sources || []);
      } catch (error) {
        console.log("Error fetching knowledge sources: ", error);
      }
    };

    fetchSources();
  }, []);

  const isPreviewMode = !!selectedSection && selectedSection.id !== "new";

  const fetchSections = async () => {
    try {
      setIsLoadingSections(true);
      const response = await fetch("/api/section/fetch");
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await response.json();

      const transformedSections = data.sections.map((section: any) => ({
        id: section._id,
        name: section.name,
        description: section.description,
        sourceCount: section.sourceIds.length,
        source_ids: section.sourceIds,
        tone: section.tone,
        scopeLabel: section.allowedTopics ? "Scoped" : "Global",
        allowed_topics: section.allowedTopics,
        blocked_topics: section.blockedTopics,
        status: section.status as SectionStatus,
      }));

      setSections(transformedSections);
      console.log("Fetched sections: ", transformedSections);
    } catch (error) {
      console.log("Error fetching sections: ", error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleCreateSection = async () => {
    setSelectedSection({
      id: "new",
      name: "",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  const handleSaveSection = async () => {
    if (!formData.name) {
      alert("Please enter a section name.");
      return;
    }
    if (selectedSources.length === 0) {
      alert("Please select at least one knowedge source.");
      return;
    }
    setIsSaving(true);

    try {
      const sectionData = {
        ...formData,
        sourceIds: selectedSources,
        status: "active",
      };

      const response = await fetch("/api/section/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create section");
      }

      await fetchSections();
      alert("sectioin created successfully.");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSection || selectedSection.id === "new") return;

    if (
      !confirm(
        `Are you sure you want to delete "${selectedSection.name}"? This act is inreversible`,
      )
    )
      return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/section/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedSection.id }),
      });

      if (!response.ok) {
        new Error("Failed to delete section");
      }

      await fetchSections();
      setIsSheetOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSheetOpen(false);
      setIsSaving(false);
    }
  };

  const handlePreviewSection = (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description || "",
      tone: section.tone,
      allowedTopics: section.allowed_topics || "",
      blockedTopics: section.blocked_topics || "",
      fallbackBehavior: "escalate",
    });

    setSelectedSources(section.source_ids || []);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Sections
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Define behaviour and tones for different topics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateSection}
            className="bg-white text-black hover:bg-zinc-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Section
          </Button>
        </div>
      </div>

      <SectionTable
        section={sections}
        isLoading={isLoadingSections}
        onPreview={handlePreviewSection}
        onCreateSection={handleCreateSection}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl flex flex-col h-full">
          {selectedSection && (
            <>
              <SheetHeader className="p-6 border-b border-white/5 ">
                <SheetTitle className="text-xl text-white ">
                  {selectedSection.id === "new"
                    ? "Create Section"
                    : "View Section"}
                </SheetTitle>

                <SheetDescription className="text-zinc-500">
                  {selectedSection.id === "new"
                    ? "Configure how the AI behaves for this specific topic."
                    : "Review sections configrations and data sources."}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2 space-y-8">
                <SectionFormFields
                  formData={formData}
                  setFormData={setFormData}
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  knowledgeSources={knowledgeSources}
                  isLoadingSources={isLoadingSources}
                  isDisabled={isPreviewMode}
                />
              </div>

              {selectedSection.id === "new" && (
                <div className="p-6 border-t border-white/5">
                  <Button
                    className="w-full bg-white text-black hover:bg-zinc-500"
                    onClick={handleSaveSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Creating..." : "Create Section"}
                  </Button>
                </div>
              )}

              {selectedSection.id !== "new" && (
                <div className="px-4 py-2 bg-red-500/5 border-t border-red-500/10">
                  <h5 className="text-sm font-medium text-red-400 mb-1">
                    Danger Zone
                  </h5>
                  <p className="text-xs text-red-500/70 mb-3">
                    Deleting this section will remove all associated routing
                    rules.
                  </p>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-none"
                    onClick={handleDeleteSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Deleting..." : "Delete Section"}
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sections;
