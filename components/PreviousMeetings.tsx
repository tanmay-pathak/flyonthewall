import { X } from "lucide-react";

type PreviousMeetingsListProps = {
  meetings: string[];
  onMeetingSelect: (id: string) => void;
  onMeetingDelete: (index: number) => void;
};

export function PreviousMeetingsList({
  meetings,
  onMeetingSelect,
  onMeetingDelete,
}: PreviousMeetingsListProps) {
  return (
    <div className="space-y-2">
      {meetings.map((meetingId, index) => {
        // Get meeting summary data from localStorage
        const summaryData = localStorage.getItem(`summary-${meetingId}`);
        const summary = summaryData ? JSON.parse(summaryData) : null;

        if (!summary) return null;

        return (
          <div
            key={meetingId}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer relative"
            onClick={() => onMeetingSelect(meetingId)}
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
            <h3 className="font-semibold">{summary.title}</h3>
            <p className="text-gray-600 text-sm">
              {new Date(summary.date).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
