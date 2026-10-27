import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import {
  CorrectionFilters,
  CorrectionStatsTabs,
  CorrectionsList,
  useCorrectionFilters,
} from "@/components/pages/corrections/home";
import { useInstructorCorrectionsList } from "@/stores/useSubmissionsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/corrections/")({
  head: () => ({
    meta: [
      { title: `Corrections | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Tous les travaux déposés dans vos formations : filtrez, corrigez et suivez vos corrections." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CorrectionsPage,
});

function CorrectionsPage() {
  const f = useCorrectionFilters();
  const { stats, items, meta, isLoading, isFetching, isError, refetch } = useInstructorCorrectionsList(f.params);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi"
        title="Corrections"
        description="Tous les travaux déposés dans vos formations : filtrez, ouvrez et corrigez."
      />

      <CorrectionStatsTabs value={f.filters.graded} stats={stats} onChange={f.changeGraded} />

      <CorrectionFilters
        filters={f.filters}
        stats={stats}
        isRangeInvalid={f.isRangeInvalid}
        hasActiveFilters={f.hasActiveFilters}
        onChange={f.patch}
        onReset={f.reset}
      />

      <CorrectionsList
        items={items}
        meta={meta}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        page={f.page}
        onPageChange={f.setPage}
        graded={f.filters.graded}
        hasActiveFilters={f.hasActiveFilters}
      />
    </div>
  );
}