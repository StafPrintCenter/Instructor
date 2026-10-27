import { useEffect } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PaginationBar } from "@/components/site";
import { useInstructorStudentsList } from "@/stores/useStudentsStore";
import { StudentsListError, StudentsListSkeleton, StudentsTable } from "./";

interface StudentsListProps {
  page: number;
  onPageChange: (page: number) => void;
}

export function StudentsListCard({ page, onPageChange }: StudentsListProps) {
  const { students, meta, isLoading, isError, refetch } = useInstructorStudentsList({ page });

  // Si la page courante n'existe plus (ex. liste réduite), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, page, onPageChange]);

  if (isLoading) return <StudentsListSkeleton />;
  if (isError) return <StudentsListError onRetry={() => refetch()} />;

  if (students.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="Aucun apprenant"
        description="Les apprenants inscrits à vos formations apparaîtront ici."
      />
    );
  }

  return (
    <div className="space-y-4">
      <StudentsTable students={students} />

      {meta ? (
        <PaginationBar
          page={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}