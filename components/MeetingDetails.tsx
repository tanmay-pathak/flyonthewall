"use client";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { ActionItemsCard } from "./meeting-details/ActionsCard";
import { KeyHighlightsCard } from "./meeting-details/KeyHighlights";
import { PotentialActionItemsCard } from "./meeting-details/PotentialActionCard";
import { RetroCard } from "./meeting-details/RetroCard";
import { SummaryCard } from "./meeting-details/SummaryCard";
import { Button } from "./ui/button";

export const MeetingDetails = ({ meetingId }: { meetingId: string }) => {
  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => {
          window.location.reload();
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Accordion
        type={"multiple"}
        defaultValue={["summary"]}
        className="w-full flex flex-col gap-4"
      >
        <AccordionItem value="summary">
          <SummaryCard meetingId={meetingId} />
        </AccordionItem>

        <AccordionItem value="meeting-notes">
          <KeyHighlightsCard meetingId={meetingId} />
        </AccordionItem>

        <AccordionItem value="action-items">
          <ActionItemsCard meetingId={meetingId} />
        </AccordionItem>

        <AccordionItem value="potential-action-items">
          <PotentialActionItemsCard meetingId={meetingId} />
        </AccordionItem>

        <AccordionItem value="retro-section">
          <RetroCard meetingId={meetingId} />
        </AccordionItem>
      </Accordion>
    </div>
  );
};
