import { meetingSchema } from "@/server-actions/schema";
import { X } from "lucide-react";
import { z } from "zod";

type PreviousMeetingsListProps = {
  meetings: z.infer<typeof meetingSchema>[];
  onMeetingSelect: (meeting: z.infer<typeof meetingSchema>) => void;
  onMeetingDelete: (index: number) => void;
};

export function PreviousMeetingsList({
  meetings,
  onMeetingSelect,
  onMeetingDelete,
}: PreviousMeetingsListProps) {
  return (
    <div className="space-y-2">
      {meetings.map((meeting, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer relative"
          onClick={() => onMeetingSelect(meeting)}
        >
          <div
            className="absolute top-2 group right-2 p-1 hover:bg-destructive rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onMeetingDelete(index);
            }}
          >
            <X size={16} className="text-gray-500 group-hover:text-white" />
          </div>
          <h3 className="font-semibold">{meeting.title}</h3>
          <p className="text-gray-600">{meeting.date}</p>
        </div>
      ))}
    </div>
  );
}
