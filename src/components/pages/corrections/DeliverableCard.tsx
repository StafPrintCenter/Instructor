import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveStorageUrl } from "@/lib/file-url";

interface CorrectionDeliverableCardProps {
  body: string | null;
  fileUrl: string | null;
  previewTitle: string;
  onPreview: (url: string, title: string) => void;
}

export function CorrectionDeliverableCard({ body, fileUrl, previewTitle, onPreview }: CorrectionDeliverableCardProps) {
  const resolvedUrl = resolveStorageUrl(fileUrl);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-lg">Livrable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {body ? (
          <p className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">{body}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">Aucun texte joint.</p>
        )}

        {resolvedUrl ? (
          <Button variant="outline" size="sm" onClick={() => onPreview(resolvedUrl, previewTitle)}>
            <Paperclip className="size-4" /> Voir le fichier
          </Button>
        ) : (
          <p className="text-sm italic text-muted-foreground">Aucun fichier joint.</p>
        )}
      </CardContent>
    </Card>
  );
}