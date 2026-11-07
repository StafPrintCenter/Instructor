import { useEffect } from "react";
import { toast } from "sonner";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import {
  useInstructorProfileHealth,
  useDismissInstructorHealthRecommendation,
} from "@/stores/useProfileHealthStore";

const MAX_TOASTS = 3;
const TOAST_DURATION_MS = 15000;
const shown = new Set<string>(); // userId:recommendationId

export function useHealthToasts() {
  const { user } = useInstructorAuth();
  const { recommendations } = useInstructorProfileHealth();
  const { mutate: dismiss } = useDismissInstructorHealthRecommendation();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    recommendations.slice(0, MAX_TOASTS).forEach((rec) => {
      const key = `${userId}:${rec.id}`;
      if (shown.has(key)) return;
      shown.add(key);

      const show = rec.level === "warning" ? toast.warning : toast.info;
      show(rec.title, {
        id: `health-${rec.id}`,
        description: rec.message,
        duration: TOAST_DURATION_MS,
        cancel: { label: "Fermer", onClick: () => { } },
        action: {
          label: "Masquer",
          onClick: () =>
            dismiss(
              { id: rec.id },
              {
                onSuccess: (res) => toast.success(`Recommandation masquée pour ${res.snoozeDays} jours`),
                onError: (e) => toast.error(e.message),
              }
            ),
        },
      });
    });
  }, [recommendations, userId, dismiss]);
}