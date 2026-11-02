import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  communityReportReasonLabels,
  type CommunityReportReason,
  type CommunityReportStatus,
} from "@/data/community-moderation";
import {
  communityReportStatusLabels,
  getCommunityReportStatusBadgeClass,
} from "@/data/community-reports";
import { cn } from "@/lib/utils";

export function ReportReasonBadge({ reason }: { reason: CommunityReportReason }) {
  return (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <Flag className="size-3" /> {communityReportReasonLabels[reason]}
    </Badge>
  );
}

export function ReportStatusBadge({ status }: { status: CommunityReportStatus }) {
  return (
    <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityReportStatusBadgeClass(status))}>
      {communityReportStatusLabels[status]}
    </Badge>
  );
}
