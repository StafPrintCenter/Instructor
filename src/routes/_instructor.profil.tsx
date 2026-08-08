import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Save,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  X,
  Phone,
  Briefcase,
  Bell,
  Sliders,
} from "lucide-react";
import { ConfirmDisconnect } from "@/components/site/InstructorBits";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { initials, profileApi, type Availability, type NotificationPrefs } from "@/lib/api";
import { SITE } from "@/data/site";

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
      { title: `Profil formateur | ${SITE.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, refresh } = useInstructorAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false);

  // Formulaire profil
  const [profile, setProfile] = useState({
    full_name: user?.full_name ?? "",
    title: user?.title ?? "",
    phone: user?.phone ?? "",
    bio: user?.bio ?? "",
    specialties: user?.specialties?.join(", ") ?? "",
  });

  // Availability
  const [availability, setAvailability] = useState<Availability[]>(
    DAYS.map(
      (day) =>
        user?.availability?.find((a) => a.day === day) ?? {
          day,
          from: "09:00",
          to: "17:00",
          enabled: false,
        }
    )
  );

  // Notification prefs
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    user?.notification_prefs ?? {
      submissions_email: true,
      session_reminders: true,
      community_mentions: true,
      admin_reviews: true,
    }
  );

  // Synchronisation si le user est réactualisé
  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || "",
        title: user.title || "",
        phone: user.phone || "",
        bio: user.bio || "",
        specialties: user.specialties?.join(", ") || "",
      });
      if (user.availability) {
        setAvailability(
          DAYS.map(
            (day) =>
              user.availability.find((a) => a.day === day) ?? {
                day,
                from: "09:00",
                to: "17:00",
                enabled: false,
              }
          )
        );
      }
      if (user.notification_prefs) {
        setPrefs(user.notification_prefs);
      }
    }
  }, [user]);

  const formattedDate = (dateStr?: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : "Non renseigné";

  const handleCancel = () => {
    if (user) {
      setProfile({
        full_name: user.full_name || "",
        title: user.title || "",
        phone: user.phone || "",
        bio: user.bio || "",
        specialties: user.specialties?.join(", ") || "",
      });
    }
    setIsEditing(false);
  };

  const afterSave = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await refresh();
    toast.success(message);
  };

  const saveProfileMutation = useMutation({
    mutationFn: () =>
      profileApi.update(user?.id ?? "", {
        full_name: profile.full_name,
        title: profile.title,
        phone: profile.phone,
        bio: profile.bio,
        specialties: profile.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      afterSave("Profil mis à jour.");
      setIsEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveAvailabilityMutation = useMutation({
    mutationFn: () => profileApi.updateAvailability(user?.id ?? "", availability),
    onSuccess: () => afterSave("Disponibilités enregistrées."),
    onError: (e: Error) => toast.error(e.message),
  });

  const savePrefsMutation = useMutation({
    mutationFn: () => profileApi.updateNotifications(user?.id ?? "", prefs),
    onSuccess: () => afterSave("Préférences de notification enregistrées."),
    onError: (e: Error) => toast.error(e.message),
  });

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnecté");
    navigate({ to: "/login" });
  };

  const userInitials = initials(user?.full_name || "Formateur");

  return (
    <>
      {/* En-tête du profil */}
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="h-32 bg-gradient-hero" />
        <div className="p-6 pt-0">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border-4 border-card bg-primary font-display text-3xl font-bold text-primary-foreground shadow-sm">
                {userInitials}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="truncate font-display text-2xl font-bold">
                  {user?.full_name || "Formateur"}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {user?.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> {user?.title || "Formateur"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Inscrit le{" "}
                    {formattedDate(user?.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Déconnexion */}
            <div className="self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDisconnectOpen(true)}
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-1" /> Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Colonne Principale (2/3) : Informations & Disponibilités */}
        <div className="space-y-6 lg:col-span-2">
          {/* Bloc Informations Personnelles */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Informations personnelles</h3>
              </div>

              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" /> Annuler
                    </Button>
                    <Button
                      size="sm"
                      disabled={saveProfileMutation.isPending}
                      onClick={() => saveProfileMutation.mutate()}
                    >
                      <Save className="h-4 w-4 mr-1" /> Enregistrer
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
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
                    <Label htmlFor="title">Titre / Postulat</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" value={user?.email || ""} disabled className="bg-muted/50" />
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
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nom complet</Label>
                    <div className="mt-1 text-sm font-medium">{user?.full_name || "Non renseigné"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Titre</Label>
                    <div className="mt-1 text-sm font-medium">{user?.title || "Non renseigné"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Adresse email</Label>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Téléphone</Label>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.phone || "Non renseigné"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Spécialités</Label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {user?.specialties?.length ? (
                      user.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">
                        Aucune spécialité spécifiée.
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Biographie / Présentation</Label>
                  <div className="mt-1.5 rounded-xl border bg-muted/20 p-4 text-sm text-foreground leading-relaxed">
                    {user?.bio ? (
                      user.bio
                    ) : (
                      <span className="italic text-muted-foreground">
                        Aucune biographie disponible.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bloc Disponibilités Hebdomadaires */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Disponibilités hebdomadaires
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Créneaux proposés pour les sessions live et l'accompagnement.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {availability.map((slot, index) => (
                <div
                  key={slot.day}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 px-3 py-2"
                >
                  <Switch
                    checked={slot.enabled}
                    onCheckedChange={(enabled) =>
                      setAvailability((a) =>
                        a.map((s, i) => (i === index ? { ...s, enabled } : s))
                      )
                    }
                    aria-label={`Disponible le ${DAY_LABELS[slot.day]}`}
                  />
                  <span className="w-24 text-sm font-medium">{DAY_LABELS[slot.day]}</span>
                  <Input
                    type="time"
                    value={slot.from}
                    disabled={!slot.enabled}
                    onChange={(e) =>
                      setAvailability((a) =>
                        a.map((s, i) => (i === index ? { ...s, from: e.target.value } : s))
                      )
                    }
                    className="w-32 bg-background"
                  />
                  <span className="text-sm text-muted-foreground">→</span>
                  <Input
                    type="time"
                    value={slot.to}
                    disabled={!slot.enabled}
                    onChange={(e) =>
                      setAvailability((a) =>
                        a.map((s, i) => (i === index ? { ...s, to: e.target.value } : s))
                      )
                    }
                    className="w-32 bg-background"
                  />
                </div>
              ))}
              <div className="pt-2">
                <Button
                  variant="outline"
                  disabled={saveAvailabilityMutation.isPending}
                  onClick={() => saveAvailabilityMutation.mutate()}
                >
                  <Save className="h-4 w-4 mr-1.5" /> Enregistrer les disponibilités
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Barre Latérale (1/3) : Notifications & Statut */}
        <div className="space-y-6 lg:col-span-1">
          {/* Notifications */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Préférences e-mail</h3>
            </div>

            <div className="space-y-3">
              {(Object.keys(PREF_LABELS) as (keyof NotificationPrefs)[]).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2.5"
                >
                  <Label htmlFor={key} className="text-xs font-normal cursor-pointer">
                    {PREF_LABELS[key]}
                  </Label>
                  <Switch
                    id={key}
                    checked={prefs[key]}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                disabled={savePrefsMutation.isPending}
                onClick={() => savePrefsMutation.mutate()}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" /> Enregistrer les préférences
              </Button>
            </div>
          </div>

          {/* Statut du Compte */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Statut du compte</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rôle</span>
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                  Formateur
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">État du compte</span>
                {user?.is_active !== false ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Validé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                    <XCircle className="h-3.5 w-3.5" /> Inactif
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Métadonnées de dates */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Dates système</h3>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Date d'inscription</span>
                <span className="font-medium text-foreground">
                  {formattedDate(user?.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dernière mise à jour</span>
                <span className="font-medium text-foreground">
                  {formattedDate(user?.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDisconnect
        open={confirmDisconnectOpen}
        onOpenChange={setConfirmDisconnectOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}