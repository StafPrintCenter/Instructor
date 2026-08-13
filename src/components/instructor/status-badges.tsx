import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  paymentLabels,
  submissionStatusLabels,
  type ContentStatus,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/api";

const contentTone: Record<ContentStatus, string> = {
  draft: "bg-muted text-muted-foreground border-transparent",
  submitted: "bg-info/15 text-info border-info/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/12 text-destructive border-destructive/30",
};

const paymentTone: Record<PaymentStatus, string> = {
  paid: "bg-success/15 text-success border-success/30",
  partial: "bg-accent/20 text-accent-foreground border-accent/40",
  pending: "bg-muted text-muted-foreground border-transparent",
  late: "bg-destructive/12 text-destructive border-destructive/30",
};

const submissionTone: Record<SubmissionStatus, string> = {
  pending: "bg-accent/20 text-accent-foreground border-accent/40",
  graded: "bg-success/15 text-success border-success/30",
  returned: "bg-info/15 text-info border-info/30",
};

export function ContentStatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", contentTone[status], className)}>
      {statusLabels[status]}
    </Badge>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", paymentTone[status])}>
      {paymentLabels[status]}
    </Badge>
  );
}

export function SubmissionBadge({ status }: { status: SubmissionStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", submissionTone[status])}>
      {submissionStatusLabels[status]}
    </Badge>
  );
}
