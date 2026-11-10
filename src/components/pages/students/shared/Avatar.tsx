import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveStorageUrl } from "@/lib/api/file";
import { cn } from "@/lib/utils";
import { initials } from "@/components/site/UserAvatar";

const SIZES = {
  md: { avatar: "size-10", fallback: "text-xs" },
  lg: { avatar: "size-16", fallback: "text-lg" },
};

interface StudentAvatarProps {
  firstName: string;
  lastName: string;
  name: string;
  photo: string | null;
  size?: keyof typeof SIZES;
}

export function StudentAvatar({ firstName, lastName, name, photo, size = "md" }: StudentAvatarProps) {
  const src = resolveStorageUrl(photo);

  return (
    <Avatar className={cn("border border-border", SIZES[size].avatar)}>
      {src
        ? <AvatarImage src={src} alt={name} />
        : null
      }
      <AvatarFallback
        className={
          cn("bg-primary/10 font-semibold text-primary", SIZES[size].fallback)}>
        {initials(`${firstName} ${lastName}`.trim() || name)}
      </AvatarFallback>
    </Avatar>
  );
}