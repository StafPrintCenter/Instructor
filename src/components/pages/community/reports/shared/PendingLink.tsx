import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommunityReportsList } from "@/stores/useCommunityReportsStore";

export function PendingReportsLink() {
  // perPage=1 : seul `stats.pending` nous intéresse
  const { stats } = useCommunityReportsList({ status: "pending", perPage: 1 });
  const pending = stats?.pending ?? 0;

  return (
    <Button asChild variant="outline">
      <Link to="/community/reports">
        <ShieldAlert className="size-4" /> Signalements
        {pending > 0 ? <Badge className="ml-1 h-5 min-w-5 justify-center px-1.5 text-[10px]">{pending}</Badge> : null}
      </Link>
    </Button>
  );
}