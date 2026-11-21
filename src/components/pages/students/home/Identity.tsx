import { Mail, Phone } from "lucide-react";
import type { APIInstructorStudentListItem } from "@/data/students";
import { UserAvatar } from "@/components/site/UserAvatar";

export function StudentIdentity({ student: s }: { student: APIInstructorStudentListItem }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar
        name={s.name}
        photo={s.photo}
        className="size-10 border border-border"
        fallbackClassName="bg-primary/10 text-xs font-semibold text-primary"
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