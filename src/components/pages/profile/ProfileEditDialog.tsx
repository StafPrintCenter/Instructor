import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { useUpdateInstructorProfile } from "@/stores/useAccountStore";
import { initials } from "@/components/site/UserAvatar";
import { ProfilePhotoField } from "./ProfilePhotoField";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // à aligner sur la règle de validation du backend

const schema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit faire au moins 2 caractères").max(100),
  lastName: z.string().trim().min(2, "Le nom doit faire au moins 2 caractères").max(100),
  bio: z.string().trim().max(1000, "1 000 caractères maximum").optional(),
});

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const { user, refresh } = useInstructorAuth();
  const updateProfile = useUpdateInstructorProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialise le formulaire à chaque ouverture
  useEffect(() => {
    if (!open || !user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setBio(user.bio ?? "");
    setPhoto(null);
    setRemovePhoto(false);
    setErrors({});
  }, [open, user]);

  const photoInitials = initials(`${firstName} ${lastName}`.trim() || "Formateur");

  const submit = () => {
    const parsed = schema.safeParse({ firstName, lastName, bio });
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
    }
    if (photo && photo.size > MAX_PHOTO_BYTES) errs.photo = "La photo ne doit pas dépasser 2 Mo.";
    if (Object.keys(errs).length > 0 || !parsed.success) {
      setErrors(errs);
      return;
    }

    updateProfile.mutate(
      { ...parsed.data, photo, removePhoto },
      {
        onSuccess: async () => {
          await refresh();
          toast.success("Profil mis à jour");
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const pending = updateProfile.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Modifier mon profil</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <ProfilePhotoField
            currentPhoto={user?.photo ?? null}
            initials={photoInitials}
            file={photo}
            removed={removePhoto}
            onFileChange={setPhoto}
            onRemovedChange={setRemovePhoto}
            disabled={pending}
          />
          {errors.photo && <p className="text-xs text-destructive">{errors.photo}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={pending} />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={pending} />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Biographie / Présentation</Label>
            <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} disabled={pending} />
            {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Annuler</Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}