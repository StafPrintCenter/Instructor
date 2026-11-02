import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  COMMUNITY_REPORT_REASONS,
  communityReportReasonLabels,
  type CommunityReportReason,
} from "@/data/community-moderation";
import {
  COMMUNITY_REPORT_TARGET_TYPES,
  communityReportTargetTypeLabels,
  type CommunityReportTargetType,
} from "@/data/community-reports";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { FilterSelect, type FilterOption } from "../../posts/content/filters/Select";
import type { ReportFiltersState } from "./";

const reasonOptions: FilterOption<CommunityReportReason | "all">[] = [
  { value: "all", label: "Tous les motifs" },
  ...COMMUNITY_REPORT_REASONS.map((r) => ({ value: r, label: communityReportReasonLabels[r] })),
];

const targetTypeOptions: FilterOption<CommunityReportTargetType | "all">[] = [
  { value: "all", label: "Tous les contenus" },
  ...COMMUNITY_REPORT_TARGET_TYPES.map((t) => ({ value: t, label: communityReportTargetTypeLabels[t] })),
];

interface ReportFiltersProps {
  filters: ReportFiltersState;
  hasActiveFilters: boolean;
  onChange: (next: Partial<ReportFiltersState>) => void;
  onReset: () => void;
}

export function ReportFilters({ filters, hasActiveFilters, onChange, onReset }: ReportFiltersProps) {
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  const trainingOptions: FilterOption<string>[] = [
    { value: "all", label: "Toutes les formations" },
    ...trainings.map((t) => ({ value: t.trainingId, label: t.trainingTitle })),
  ];

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <FilterSelect label="Motif" value={filters.reason} options={reasonOptions} onChange={(reason) => onChange({ reason })} />
          <FilterSelect
            label="Type de contenu"
            value={filters.targetType}
            options={targetTypeOptions}
            onChange={(targetType) => onChange({ targetType })}
          />
          <FilterSelect
            label="Formation"
            value={filters.trainingId}
            options={trainingOptions}
            onChange={(trainingId) => onChange({ trainingId })}
          />
        </div>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="size-4" /> Réinitialiser les filtres
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}