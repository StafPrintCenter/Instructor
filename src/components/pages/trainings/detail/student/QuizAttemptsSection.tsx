import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuizAttemptFeedbackDialog } from "@/components/pages/trainings/detail/student";
import type { APIInstructorStudentQuizAttempt } from "@/data/training-students";
import { FollowUpCard } from "./FollowUpCard";
import { QuizAttemptRow } from "./QuizAttemptRow";

interface QuizAttemptsSectionProps {
  attempts: APIInstructorStudentQuizAttempt[];
  studentName: string;
}

export function QuizAttemptsSection({ attempts, studentName }: QuizAttemptsSectionProps) {
  const [feedbackAttemptId, setFeedbackAttemptId] = useState<string | null>(null);

  return (
    <FollowUpCard title={`Tentatives de quiz (${attempts.length})`}>
      {attempts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune tentative enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leçon</TableHead>
                <TableHead>Tentative</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Soumise le</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((a) => (
                <QuizAttemptRow key={a.attemptId} attempt={a} onGiveFeedback={() => setFeedbackAttemptId(a.attemptId)} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <QuizAttemptFeedbackDialog
        attemptId={feedbackAttemptId}
        studentName={studentName}
        onClose={() => setFeedbackAttemptId(null)}
      />
    </FollowUpCard>
  );
}