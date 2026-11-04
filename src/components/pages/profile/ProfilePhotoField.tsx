import { useEffect, useMemo, useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePhotoFieldProps {
  currentPhoto: string | null;
  initials: string;
  file: File | null;
  removed: boolean;
  onFileChange: (file: File | null) => void;
  onRemovedChange: (removed: boolean) => void;
  disabled?: boolean;
}

export function ProfilePhotoField({
  currentPhoto, initials, file, removed, onFileChange, onRemovedChange, disabled,
}: ProfilePhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const shown = removed ? null : (preview ?? currentPhoto);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    onFileChange(picked);
    onRemovedChange(false);
  };

  const handleRemove = () => {
    onFileChange(null);
    onRemovedChange(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-primary font-display text-2xl font-bold text-primary-foreground">
        {shown ? <img src={shown} alt="Photo de profil" className="h-full w-full object-cover" /> : initials}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handlePick}
          disabled={disabled}
        />
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>
          <Camera className="h-4 w-4 mr-1" /> {shown ? "Changer" : "Ajouter une photo"}
        </Button>
        {shown && (
          <Button
            type="button" variant="outline" size="sm" disabled={disabled}
            className="text-destructive hover:bg-destructive/10" onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
          </Button>
        )}
      </div>
    </div>
  );
}