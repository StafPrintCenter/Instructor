// src/components/instructor/sessions/SessionReviewRequestDialog.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRequestInstructorSessionReview } from "@/stores/useSessionsStore";

interface SessionReviewRequestDialogProps {
  /** null = dialog fermé */
  sessionId: string | null;
  sessionTitle?: string;
  onClose: () => void;
}

export function SessionReviewRequestDialog({ sessionId, sessionTitle, onClose }: SessionReviewRequestDialogProps) {
  const request = useRequestInstructorSessionReview();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (sessionId) setMessage("");
  }, [sessionId]);

  const handleSubmit = () => {
    if (!sessionId || !message.trim()) return;
    request.mutate(
      { id: sessionId, message: message.trim() },
      {
        onSuccess: () => {
          toast.success("Demande de réexamen envoyée.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={!!sessionId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Demander un réexamen</DialogTitle>
          <DialogDescription>
            {sessionTitle ? `« ${sessionTitle} » est suspendue. ` : ""}Expliquez pourquoi elle devrait être rétablie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rr-message">Message</Label>
          <Textarea id="rr-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={!message.trim() || request.isPending} onClick={handleSubmit}>
            {request.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}