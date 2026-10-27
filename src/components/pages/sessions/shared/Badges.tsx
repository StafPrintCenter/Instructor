import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getReviewRequestStatusBadgeClass, getReviewRequestStatusLabel, getSessionResponseBadgeClass, getSessionResponseLabel, sessionModalityLabels, type SessionModality } from "@/data/sessions";


export function ReviewRequestStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", getReviewRequestStatusBadgeClass(status))}>
      {getReviewRequestStatusLabel(status)}
    </Badge>
  );
}

export function SessionResponseBadge({ response }: { response: string }) {
  return (
    <Badge variant="outline" className={cn("border text-[10px] font-medium", getSessionResponseBadgeClass(response))}>
      {getSessionResponseLabel(response)}
    </Badge>
  );
}