import { toast } from "@/hooks/use-toast";
import { meetingSchema } from "@/server-actions/schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleShareURL = (data: z.infer<typeof meetingSchema>) => {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const shareUrl = `${window.location.origin}/#${encodedData}`;
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      trackEvent("share_meeting", { title: data.title });
      toast({
        title: "Link copied",
        description: "Meeting link has been copied to clipboard",
      });
    })
    .catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    });
};

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).umami) {
    (window as any).umami.track(eventName, eventData);
  }
};