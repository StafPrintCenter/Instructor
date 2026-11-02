import { Badge } from "@/components/ui/badge";
import {
  communityReportStatusLabels,
  getCommunityReportStatusBadgeClass,
} from "@/data/community-reports";
import type { CommunityReportStatus } from "@/data/community-moderation";
import { cn } from "@/lib/utils";

export function ReportStatusBadge({ status }: { status: CommunityReportStatus }) {
  return (
    <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityReportStatusBadgeClass(status))}>
      {communityReportStatusLabels[status]}
    </Badge>
  );
}