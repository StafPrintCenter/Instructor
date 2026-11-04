import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RecoveryCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codes: string[];
}

export function RecoveryCodesDialog({ open, onOpenChange, codes }: RecoveryCodesDialogProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      toast.success("Codes copiés");
    } catch {
      toast.error("Impossible de copier les codes");
    }
  };

  const download = () => {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codes-de-secours.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vos codes de secours</DialogTitle>
          <DialogDescription>
            Conservez-les dès maintenant dans un endroit sûr. Ils ne seront plus affichés après la fermeture de cette fenêtre.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid grid-cols-2 gap-2 rounded-xl border bg-muted/20 p-4">
          {codes.map((code) => (
            <li key={code} className="font-mono text-sm">{code}</li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={copy}><Copy className="mr-1 h-4 w-4" /> Copier</Button>
          <Button variant="outline" onClick={download}><Download className="mr-1 h-4 w-4" /> Télécharger</Button>
          <Button onClick={() => onOpenChange(false)}>J'ai sauvegardé mes codes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}