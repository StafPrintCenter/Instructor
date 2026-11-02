import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { communityReportReasonLabels, type CommunityReportReason } from "@/data/community-moderation";

export function ReportReasonBadge({ reason }: { reason: CommunityReportReason }) {
  return (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <Flag className="size-3" /> {communityReportReasonLabels[reason]}
    </Badge>
  );
}