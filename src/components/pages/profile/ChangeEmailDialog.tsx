import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/site/PasswordField";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { useRequestInstructorEmailChange, useConfirmInstructorEmailChange } from "@/stores/useAccountStore";

const emailSchema = z.object({
  newEmail: z.string().trim().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});
const codeSchema = z.string().trim().regex(/^\d{6}$/, "Le code contient 6 chiffres.");

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeEmailDialog({ open, onOpenChange }: ChangeEmailDialogProps) {
  const { user, refresh } = useInstructorAuth();
  const requestChange = useRequestInstructorEmailChange();
  const confirmChange = useConfirmInstructorEmailChange();

  const [step, setStep] = useState<"request" | "confirm">("request");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [hint, setHint] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("request");
    setNewEmail(""); setPassword(""); setCode("");
    setHint(""); setExpiresIn(0); setError("");
  }, [open]);

  const submitRequest = () => {
    setError("");
    const parsed = emailSchema.safeParse({ newEmail, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides.");
      return;
    }
    requestChange.mutate(parsed.data, {
      onSuccess: (res) => {
        setHint(res.hint);
        setExpiresIn(res.expiresInMinutes);
        setPassword("");
        setStep("confirm");
        toast.success(res.message);
      },
      onError: (e) => setError(e.message),
    });
  };

  const submitConfirm = () => {
    setError("");
    const parsed = codeSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Code invalide.");
      return;
    }
    confirmChange.mutate({ code: parsed.data }, {
      onSuccess: async () => {
        await refresh();
        toast.success("Adresse e-mail modifiée");
        onOpenChange(false);
      },
      onError: (e) => setError(e.message),
    });
  };

  const pending = requestChange.isPending || confirmChange.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Changer d'adresse e-mail</DialogTitle>
          <DialogDescription>
            {step === "request"
              ? `Adresse actuelle : ${user?.email ?? ""}`
              : `Un code a été envoyé à ${hint}. Il expire dans ${expiresIn} minutes.`}
          </DialogDescription>
        </DialogHeader>

        {step === "request" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Nouvelle adresse e-mail</Label>
              <Input
                id="newEmail" type="email" className="bg-card" autoComplete="email"
                value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={pending}
              />
            </div>
            <PasswordField
              id="email-change-password"
              label="Mot de passe actuel"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              disabled={pending}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="code">Code de confirmation</Label>
            <Input
              id="code" inputMode="numeric" maxLength={6} className="bg-card tracking-[0.4em]"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} disabled={pending}
            />
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <DialogFooter>
          {step === "confirm" && (
            <Button variant="ghost" onClick={() => { setStep("request"); setError(""); }} disabled={pending}>
              Changer d'adresse
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Annuler</Button>
          <Button onClick={step === "request" ? submitRequest : submitConfirm} disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === "request" ? "Envoyer le code" : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}