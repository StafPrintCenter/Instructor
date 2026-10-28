import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { StudentsList } from "@/components/pages/students/home";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/students/")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Mes apprenants | ${SITE.name}` },
      { name: "description", content: "Retrouvez les apprenants inscrits à vos formations et consultez leur progression ainsi que leur activité récente." },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi"
        title="Mes apprenants"
        description="Apprenants inscrits à vos formations, avec leur progression et leur dernière activité."
      />
      <StudentsList page={page} onPageChange={setPage} />
    </div>
  );
}