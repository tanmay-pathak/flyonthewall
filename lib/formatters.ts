import { toast } from "@/hooks/use-toast";

export const formatSummaryData = (data: any): string => {
  let formattedString = `Title: ${data.title}\n`;
  formattedString += `Date: ${data.date}\n`;
  formattedString += `Length: ${data.length}\n`;
  formattedString += `Attendees:\n`;
  data.attendees.forEach((attendee: string) => {
    formattedString += `  - ${attendee}\n`;
  });
  formattedString += `Summary: ${data.summary}\n`;
  return formattedString;
};

export const formatKeyHighlightsData = (data: any): string => {
  let formattedString = `Meeting Notes:\n`;
  data.meetingNotes.forEach((note: string) => {
    formattedString += `  - ${note}\n`;
  });
  return formattedString;
};
