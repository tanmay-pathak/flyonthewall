import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AttendeeSelectProps {
  attendees: string[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function AttendeeSelect({ attendees, value, onValueChange, className }: AttendeeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {attendees.map((attendee) => (
          <SelectItem key={attendee} value={attendee}>
            {attendee}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 