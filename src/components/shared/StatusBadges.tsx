import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Video } from "lucide-react";
import type { PaymentStatus } from "@/data/trainings";
import type { SubmissionStatus } from "@/data/submissions";
import { contentStatusLabels, type ContentStatus } from "@/data/content";
import { instructorSubmissionStatusLabels, type SubmissionStatus as InstructorSubmissionStatus } from "@/data/submissions";
import { getReviewRequestStatusBadgeClass, getReviewRequestStatusLabel, getSessionResponseBadgeClass, getSessionResponseLabel, getSessionStatusBadgeClass, getSessionStatusLabel, sessionModalityLabels, type SessionModality } from "@/data/sessions";

const contentTone: Record<ContentStatus, string> = {
  draft: "bg-muted text-muted-foreground border-transparent",
  pending_review: "bg-info/15 text-info border-info/30",
  published: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/12 text-destructive border-destructive/30",
};

const paymentTone: Record<PaymentStatus, string> = {
  paid: "bg-success/15 text-success border-success/30",
  partial: "bg-accent/20 text-accent-foreground border-accent/40",
  unpaid: "bg-destructive/12 text-destructive border-destructive/30",
};

const submissionTone: Record<SubmissionStatus, string> = {
  pending: "bg-accent/20 text-accent-foreground border-accent/40",
  graded: "bg-success/15 text-success border-success/30",
  returned: "bg-info/15 text-info border-info/30",
};

const instructorSubmissionTone: Record<InstructorSubmissionStatus, string> = {
  submitted: "bg-accent/20 text-accent-foreground border-accent/40",
  under_review: "bg-info/15 text-info border-info/30",
  validated: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/12 text-destructive border-destructive/30",
};

export function ContentStatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", contentTone[status], className)}>
      {contentStatusLabels[status]}
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

export function InstructorSubmissionBadge({ status, className }: { status: InstructorSubmissionStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", instructorSubmissionTone[status], className)}>
      {instructorSubmissionStatusLabels[status]}
    </Badge>
  );
}

// Sessions
export function SessionStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", getSessionStatusBadgeClass(status), className)}>
      {getSessionStatusLabel(status)}
    </Badge>
  );
}

export function SessionModalityBadge({ modality }: { modality: SessionModality }) {
  const Icon = modality === "online" ? Video : MapPin;
  return (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <Icon className="size-3" /> {sessionModalityLabels[modality]}
    </Badge>
  );
}

export function ReviewRequestStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", getReviewRequestStatusBadgeClass(status))}>
      {getReviewRequestStatusLabel(status)}
    </Badge>
  );
}

export function SessionResponseBadge({ response }: { response: string }) {
  return (
    <Badge variant="outline" className={cn("border text-[10px] font-medium", getSessionResponseBadgeClass(response))}>
      {getSessionResponseLabel(response)}
    </Badge>
  );
}

