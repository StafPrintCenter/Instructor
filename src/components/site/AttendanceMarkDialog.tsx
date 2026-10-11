// src/components/site/AttendanceMarkDialog.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ATTENDANCE_STATUSES, attendanceStatusLabels, type AttendanceStatus } from "@/data/attendance";
import { useMarkInstructorAttendance } from "@/stores/useAttendanceStore";

interface AttendanceMarkDialogProps {
  /** null = dialog fermé */
  enrollmentId: string | null;
  studentName?: string;
  onClose: () => void;
}

/** Date locale du jour au format YYYY-MM-DD */
const today = () => new Date().toLocaleDateString("en-CA");

export function AttendanceMarkDialog({ enrollmentId, studentName, onClose }: AttendanceMarkDialogProps) {
  const mark = useMarkInstructorAttendance();
  const [date, setDate] = useState(today());
  const [status, setStatus] = useState<AttendanceStatus>("present");

  useEffect(() => {
    if (enrollmentId) {
      setDate(today());
      setStatus("present");
    }
  }, [enrollmentId]);

  const handleSubmit = () => {
    if (!enrollmentId) return;
    mark.mutate(
      { enrollmentId, payload: { date, status } },
      {
        onSuccess: () => {
          toast.success("Assiduité enregistrée.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={!!enrollmentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            Assiduité{studentName ? ` — ${studentName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad">Date</Label>
            <Input id="ad" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ATTENDANCE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{attendanceStatusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={!date || mark.isPending} onClick={handleSubmit}>
            {mark.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}