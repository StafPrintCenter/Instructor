import type { InstructorMfaLoginMethod } from "@/data/auth";

const LABELS: Record<InstructorMfaLoginMethod, string> = {
  email: "Recevoir un code par e-mail",
  totp: "Utiliser mon application d'authentification",
  recovery: "Utiliser un code de secours",
};

interface MfaMethodSwitcherProps {
  available: InstructorMfaLoginMethod[];
  active: InstructorMfaLoginMethod;
  disabled?: boolean;
  onSelect: (method: InstructorMfaLoginMethod) => void;
}

export function MfaMethodSwitcher({ available, active, disabled, onSelect }: MfaMethodSwitcherProps) {
  const others = available.filter((m) => m !== active);
  if (others.length === 0) return null;

  return (
    <div className="space-y-2 border-t pt-4 text-center">
      {others.map((m) => (
        <button
          key={m}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(m)}
          className="block w-full text-xs font-medium text-foreground underline underline-offset-4 disabled:opacity-50"
        >
          {LABELS[m]}
        </button>
      ))}
    </div>
  );
}