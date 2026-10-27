import { MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getReviewRequestStatusBadgeClass, getReviewRequestStatusLabel, getSessionResponseBadgeClass, getSessionResponseLabel, sessionModalityLabels, type SessionModality } from "@/data/sessions";

export function SessionModalityBadge({ modality }: { modality: SessionModality }) {
  const Icon = modality === "online" ? Video : MapPin;
  return (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <Icon className="size-3" /> {sessionModalityLabels[modality]}
    </Badge>
  );
}

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