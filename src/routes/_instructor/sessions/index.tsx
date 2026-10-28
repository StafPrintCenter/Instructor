import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { SessionFormDialog } from "@/components/pages/sessions/form";
import { SessionCalendarTab, SessionFilters, SessionListTab, SessionViewTabs, useSessionFilters, type SessionView } from "@/components/pages/sessions/home";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/sessions/")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Sessions de formation | ${SITE.name}` },
      { name: "description", content: "Planifiez les sessions de vos formations et suivez leur calendrier ainsi que les réponses des apprenants." },
    ],
  }),
  component: SessionsPage,
});

function SessionsPage() {
  const [view, setView] = useState<SessionView>("list");
  const [createOpen, setCreateOpen] = useState(false);
  const f = useSessionFilters();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pédagogie"
        title="Sessions"
        description="Planifiez des sessions en présentiel ou en ligne pour vos formations et suivez les réponses des apprenants."
        actions={
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Nouvelle session
          </Button>
        }
      />

      <SessionViewTabs
        value={view}
        onChange={setView}
      />

      <SessionFilters
        filters={f.filters}
        onChange={f.patch}
        view={view}
        isRangeInvalid={f.isRangeInvalid}
        hasActiveFilters={view === "list" ? f.hasActiveFilters : f.hasSharedFilters}
        onReset={f.reset}
      />

      {view === "list" ? (
        <SessionListTab
          params={f.listParams}
          onPageChange={f.setPage}
          hasActiveFilters={f.hasActiveFilters}
          upcoming={f.filters.upcoming}
        />
      ) : (
        <SessionCalendarTab
          sharedParams={f.sharedParams}
        />
      )}

      <SessionFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}