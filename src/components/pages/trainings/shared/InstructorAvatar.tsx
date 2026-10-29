import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveStorageUrl } from "@/lib/api/file";
import { cn } from "@/lib/utils";
import { getInitials } from "./InstructorUtils";

const SIZES = {
  sm: { avatar: "size-6", fallback: "text-[10px]" },
  md: { avatar: "size-9", fallback: "text-xs" },
  lg: { avatar: "size-11", fallback: "text-sm" },
};

interface InstructorAvatarProps {
  name: string;
  photo: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

export function InstructorAvatar({ name, photo, size = "md", className }: InstructorAvatarProps) {
  const src = resolveStorageUrl(photo);

  return (
    <Avatar className={cn("border border-border", SIZES[size].avatar, className)}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className={cn("bg-primary/10 font-semibold text-primary", SIZES[size].fallback)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}