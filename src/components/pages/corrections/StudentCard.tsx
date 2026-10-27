// src/components/pages/corrections/CorrectionStudentCard.tsx
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { APIInstructorSubmissionDetail } from "@/data/submissions";

interface CorrectionStudentCardProps {
  student: APIInstructorSubmissionDetail["student"];
  trainingId: string;
}

export function CorrectionStudentCard({ student, trainingId }: CorrectionStudentCardProps) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Apprenant</p>
        <div>
          <p className="text-sm font-medium">{student.name}</p>
          <p className="text-xs text-muted-foreground">{student.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/students/$studentId" params={{ studentId: student.id }}>Profil</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/trainings/$trainingId/students/$studentId" params={{ trainingId, studentId: student.id }}>
              Suivi dans la formation
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}