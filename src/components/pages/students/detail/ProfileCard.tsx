import { Briefcase, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { APIInstructorStudentProfile } from "@/data/students";
import { StudentAvatar } from "./Avatar";

export function StudentProfileCard({ student }: { student: APIInstructorStudentProfile }) {
  return (
    <Card className="border-border/70">
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <StudentAvatar
          firstName={student.firstName}
          lastName={student.lastName}
          name={student.name}
          photo={student.photo}
          size="lg"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" /> {student.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-primary" /> {student.phone || "Téléphone non renseigné"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="size-3.5 text-primary" /> {student.occupation || "Profession non renseignée"}
            </span>
          </div>
          {student.bio ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{student.bio}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">Aucune biographie renseignée.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}