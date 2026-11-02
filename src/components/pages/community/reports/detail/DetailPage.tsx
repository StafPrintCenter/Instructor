import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { communityReportReasonLabels } from "@/data/community-moderation";
import { communityReportTargetTypeLabels } from "@/data/community-reports";
import { useCommunityReportDetail } from "@/stores/useCommunityReportsStore";
import { ReportActionsCard } from "./ActionsCard";
import {
  BackToReportsButton,
  ReportDetailError,
  ReportDetailFallback,
  ReportDetailSkeleton,
} from "./DetailStates";
import { ReportInfoCard } from "./InfoCard";
import { ReportOutcomeCard } from "./OutcomeCard";
import { ReportTargetCard } from "./TargetCard";

export function ReportDetailPage({ reportId }: { reportId: string }) {
  const navigate = useNavigate();
  const { report, isLoading, isError, refetch } = useCommunityReportDetail(reportId);

  if (isLoading) return <ReportDetailSkeleton />;

  if (isError) {
    return (
      <ReportDetailFallback>
        <ReportDetailError onRetry={() => refetch()} />
      </ReportDetailFallback>
    );
  }

  if (!report) {
    return (
      <ReportDetailFallback>
        <p className="text-muted-foreground">Signalement introuvable, ou déjà transmis aux administrateurs.</p>
      </ReportDetailFallback>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Modération"
        title={`Signalement : ${communityReportReasonLabels[report.reason]}`}
        description={`${communityReportTargetTypeLabels[report.target.type]} signalé${report.target.type === "post" ? "e" : ""} par ${report.reporter.name}`}
        actions={<BackToReportsButton />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReportTargetCard report={report} />
          <ReportOutcomeCard report={report} />
        </div>

        <div className="space-y-6">
          <ReportInfoCard report={report} />
          <ReportActionsCard report={report} onEscalated={() => navigate({ to: "/community/reports" })} />
        </div>
      </div>
    </div>
  );
}