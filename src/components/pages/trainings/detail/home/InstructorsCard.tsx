import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInstructorRoleConfig, type APIInstructorTrainingInstructorDetail } from "@/data/trainings";
import { InstructorAvatar, sortTrainingInstructors } from "@/components/pages/trainings/shared";

interface TrainingInstructorsProps {
  instructors: APIInstructorTrainingInstructorDetail[];
  mainColor: string;
}

export function TrainingInstructorsCard({ instructors, mainColor }: TrainingInstructorsProps) {
  const sorted = sortTrainingInstructors(instructors);
  const isAlone = sorted.length === 1 && sorted[0].isMe;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <GraduationCap className="size-4" style={{ color: mainColor }} /> Formateurs ({sorted.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun formateur assigné à cette formation.</p>
        ) : null}
        {isAlone ? (
          <p className="text-sm text-muted-foreground">Vous êtes le seul formateur de cette formation.</p>
        ) : null}

        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((i) => {
            const roleConfig = getInstructorRoleConfig(i.role);
            return (
              <li key={i.instructorId} className="space-y-2 rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <InstructorAvatar name={i.name} photo={i.photo} size="lg" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={roleConfig.variant} className="text-[10px]">{roleConfig.label}</Badge>
                      {i.isMe ? <Badge variant="outline" className="text-[10px]">Vous</Badge> : null}
                    </div>
                  </div>
                </div>

                {i.bio ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{i.bio}</p>
                ) : (
                  <p className="text-xs italic text-muted-foreground">
                    Aucune biographie renseignée.
                    {i.isMe ? (
                      <>
                        {" "}
                        <Link to="/profil" className="not-italic text-primary hover:underline">
                          Compléter mon profil
                        </Link>
                      </>
                    ) : null}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}