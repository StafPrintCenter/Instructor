import { Mail, Phone } from "lucide-react";
import type { APIInstructorStudentListItem } from "@/data/students";
import { StudentAvatar } from "./Avatar";

export function StudentIdentity({ student: s }: { student: APIInstructorStudentListItem }) {
  return (
    <div className="flex items-center gap-3">
      <StudentAvatar
        firstName={s.firstName}
        lastName={s.lastName}
        name={s.name}
        photo={s.photo}
      />

      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium leading-none">
          {s.name}
        </p>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="size-3" />
          {s.email}
        </p>

        {s.phone ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="size-3" /> {s.phone}
          </p>
        ) : null}
      </div>
    </div>
  );
}