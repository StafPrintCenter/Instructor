import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/instructor/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { profileQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { initials, profileApi, type Availability, type NotificationPrefs } from "@/lib/api";

const DAYS: Availability["day"][] = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const DAY_LABELS: Record<Availability["day"], string> = {
  lun: "Lundi",
  mar: "Mardi",
  mer: "Mercredi",
  jeu: "Jeudi",
  ven: "Vendredi",
  sam: "Samedi",
  dim: "Dimanche",
};

const PREF_LABELS: Record<keyof NotificationPrefs, string> = {
  submissions_email: "Nouveaux travaux rendus",
  session_reminders: "Rappels de sessions",
  community_mentions: "Mentions dans la communauté",
  admin_reviews: "Décisions de validation admin",
};

export const Route = createFileRoute("/_instructor/profil")({
  head: () => ({
    meta: [
      { title: "Profil & réglages formateur — STAF PRINT CENTER" },
      {
        name: "description",
        content: "Mettez à jour votre biographie, vos spécialités, vos disponibilités et vos préférences de notification.",
      },
      { property: "og:title", content: "Profil & réglages formateur — STAF PRINT CENTER" },
      { property: "og:description", content: "Biographie, spécialités, disponibilités et notifications." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(getSessionInstructorId())),
  component: ProfilePage,
});

function ProfilePage() {
  const { instructorId, refresh } = useInstructorAuth();
  const queryClient = useQueryClient();
  const { data: instructor } = useSuspenseQuery(profileQuery(instructorId));

  const [profile, setProfile] = useState({
    full_name: instructor.full_name,
    title: instructor.title,
    phone: instructor.phone,
    bio: instructor.bio,
    specialties: instructor.specialties.join(", "),
  });
  const [availability, setAvailability] = useState<Availability[]>(
    DAYS.map(
      (day) =>
        instructor.availability.find((a) => a.day === day) ?? {
          day,
          from: "09:00",
          to: "17:00",
          enabled: false,
        },
    ),
  );
  const [prefs, setPrefs] = useState<NotificationPrefs>(instructor.notification_prefs);

  const afterSave = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await refresh();
    toast.success(message);
  };

  const saveProfile = useMutation({
    mutationFn: () =>
      profileApi.update(instructorId, {
        full_name: profile.full_name,
        title: profile.title,
        phone: profile.phone,
        bio: profile.bio,
        specialties: profile.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => afterSave("Profil mis à jour."),
    onError: (e: Error) => toast.error(e.message),
  });

  const saveAvailability = useMutation({
    mutationFn: () => profileApi.updateAvailability(instructorId, availability),
    onSuccess: () => afterSave("Disponibilités enregistrées."),
    onError: (e: Error) => toast.error(e.message),
  });

  const savePrefs = useMutation({
    mutationFn: () => profileApi.updateNotifications(instructorId, prefs),
    onSuccess: () => afterSave("Préférences de notification enregistrées."),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Compte"
        title="Profil & réglages"
        description="Vos informations sont visibles par l'administration et les apprenants de vos cohortes."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-success/30 bg-success/15 text-success">
              Compte validé
            </Badge>
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials(instructor.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
          <CardDescription>Votre présentation publique auprès des apprenants.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={instructor.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
            <Input
              id="specialties"
              value={profile.specialties}
              onChange={(e) => setProfile((p) => ({ ...p, specialties: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              className="min-h-28"
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>
          <Button variant="accent" disabled={saveProfile.isPending} onClick={() => saveProfile.mutate()}>
            Enregistrer le profil
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disponibilités hebdomadaires</CardTitle>
          <CardDescription>Créneaux proposés pour les sessions live et l'accompagnement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {availability.map((slot, index) => (
            <div
              key={slot.day}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border/70 px-3 py-2"
            >
              <Switch
                checked={slot.enabled}
                onCheckedChange={(enabled) =>
                  setAvailability((a) => a.map((s, i) => (i === index ? { ...s, enabled } : s)))
                }
                aria-label={`Disponible le ${DAY_LABELS[slot.day]}`}
              />
              <span className="w-24 text-sm">{DAY_LABELS[slot.day]}</span>
              <Input
                type="time"
                value={slot.from}
                disabled={!slot.enabled}
                onChange={(e) =>
                  setAvailability((a) => a.map((s, i) => (i === index ? { ...s, from: e.target.value } : s)))
                }
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">→</span>
              <Input
                type="time"
                value={slot.to}
                disabled={!slot.enabled}
                onChange={(e) =>
                  setAvailability((a) => a.map((s, i) => (i === index ? { ...s, to: e.target.value } : s)))
                }
                className="w-32"
              />
            </div>
          ))}
          <Button variant="accent" disabled={saveAvailability.isPending} onClick={() => saveAvailability.mutate()}>
            Enregistrer les disponibilités
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Choisissez les alertes que vous souhaitez recevoir par e-mail.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(PREF_LABELS) as (keyof NotificationPrefs)[]).map((key) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5">
              <Label htmlFor={key} className="text-sm font-normal">
                {PREF_LABELS[key]}
              </Label>
              <Switch
                id={key}
                checked={prefs[key]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
          <Button variant="accent" disabled={savePrefs.isPending} onClick={() => savePrefs.mutate()}>
            Enregistrer les préférences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
