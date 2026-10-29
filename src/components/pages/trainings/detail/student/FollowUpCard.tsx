import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FollowUpCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Cadre commun aux sections de suivi (quiz, progression, assiduité) */
export function FollowUpCard({ title, action, children }: FollowUpCardProps) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}