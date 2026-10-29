import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel } from "@/data/trainings";
import { cn } from "@/lib/utils";

interface StudentPaymentCardProps {
  paymentStatus: string;
  amountPaid: number;
}

export function StudentPaymentCard({ paymentStatus, amountPaid }: StudentPaymentCardProps) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Paiement</p>
        <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(paymentStatus))}>
          {getPaymentStatusLabel(paymentStatus)}
        </Badge>
        <p className="text-sm font-medium">{amountPaid.toLocaleString("fr-FR")} FCFA versés</p>
      </CardContent>
    </Card>
  );
}