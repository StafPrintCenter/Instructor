import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Eye, Mail, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceMarkDialog } from "@/components/site/AttendanceMarkDialog";
import { formatDate } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
  type APIInstructorTrainingOverview,
  type PaymentStatus,
} from "@/data/trainings";

function PaymentBadge({ status }: { status: PaymentStatus | string | null | undefined }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(status))}>
      {getPaymentStatusLabel(status)}
    </Badge>
  );
}

interface TrainingStudentsTableProps {
  trainingId: string;
  students: APIInstructorTrainingOverview["students"];
  mainColor: string;
}

export function TrainingStudentsTable({ trainingId, students, mainColor }: TrainingStudentsTableProps) {
  const [attendanceFor, setAttendanceFor] = useState<{ enrollmentId: string; name: string } | null>(null);

  return (
    <>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Users className="size-5" style={{ color: mainColor }} /> Apprenants inscrits ({students.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Aucun apprenant n'est encore inscrit à cette formation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Assiduité</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.data.map((student) => {
                    const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();
                    const fullName = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || "Apprenant";

                    return (
                      <TableRow key={student.studentId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-border">
                              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                {initials || "AP"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <Link
                                to="/students/$studentId"
                                params={{ studentId: student.studentId }}
                                className="text-sm font-medium leading-none hover:underline"
                              >
                                {fullName}
                              </Link>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="size-3" />
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PaymentBadge status={student.paymentStatus} />
                        </TableCell>
                        <TableCell className="min-w-35">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{student.progress}%</span>
                            </div>
                            <Progress value={student.progress} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.attendance !== null ? (
                            <span className="text-xs font-medium">{student.attendance}%</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {student.lastActivityAt ? formatDate(student.lastActivityAt) : "Jamais connecté"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAttendanceFor({ enrollmentId: student.enrollmentId, name: fullName })}
                            >
                              <CalendarCheck className="size-4" /> Assiduité
                            </Button>
                            <Button asChild size="sm" variant="soft">
                              <Link
                                to="/trainings/$trainingId/students/$studentId"
                                params={{ trainingId, studentId: student.studentId }}
                              >
                                <Eye className="size-4" /> Suivi & soumissions
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AttendanceMarkDialog
        enrollmentId={attendanceFor?.enrollmentId ?? null}
        studentName={attendanceFor?.name}
        onClose={() => setAttendanceFor(null)}
      />
    </>
  );
}