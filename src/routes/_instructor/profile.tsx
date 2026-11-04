import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Briefcase,
  Tags,
  Loader2,
} from "lucide-react";
import { ConfirmDisconnect } from "@/components/site/InstructorBits";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { usePublicCategories, useUpdateInstructorCategories } from "@/stores/useCategoriesStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/profile")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Mon profil | ${SITE.name}` },
      {
        name: "description",
        content:
          "Consultez les informations de votre compte formateur et gérez vos catégories préférées.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, refresh } = useInstructorAuth();
  const navigate = useNavigate();
  const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false);

  // Catégories préférées
  const {
    categories: allCategories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = usePublicCategories();
  const updateCategories = useUpdateInstructorCategories();
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedCategoryIds(user.categories?.map((c) => c.id) ?? []);
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

  const handleCancelCategories = () => {
    setSelectedCategoryIds(user?.categories?.map((c) => c.id) ?? []);
    setIsEditingCategories(false);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSaveCategories = () => {
    updateCategories.mutate(selectedCategoryIds, {
      onSuccess: async () => {
        await refresh();
        toast.success("Catégories préférées mises à jour.");
        setIsEditingCategories(false);
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnecté");
    navigate({ to: "/login" });
  };

  const userFullName =
    user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Formateur";
  const userInitials = userFullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* En-tête du profil */}
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="h-32 bg-gradient-hero" />
        <div className="p-6 pt-0">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-primary font-display text-3xl font-bold text-primary-foreground shadow-sm">
                {user?.photo ? (
                  <img src={user.photo} alt={userFullName} className="h-full w-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="truncate font-display text-2xl font-bold">{userFullName}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {user?.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> Formateur
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Inscrit le{" "}
                    {formattedDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

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
        {/* Colonne Principale (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Bloc Informations Personnelles */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-4 mb-5">
              <UserIcon className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Informations personnelles</h3>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Prénom</Label>
                  <div className="mt-1 text-sm font-medium">
                    {user?.firstName || "Non renseigné"}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nom</Label>
                  <div className="mt-1 text-sm font-medium">
                    {user?.lastName || "Non renseigné"}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Adresse e-mail</Label>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email || "Non renseigné"}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Biographie / Présentation</Label>
                <div className="mt-1.5 rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed">
                  {user?.bio || (
                    <span className="italic text-muted-foreground">
                      Aucune biographie disponible.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bloc Catégories préférées */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display text-lg font-semibold">Catégories préférées</h3>
                  <p className="text-xs text-muted-foreground">
                    Thèmes sur lesquels vous souhaitez être proposé comme formateur.
                  </p>
                </div>
              </div>

              {isEditingCategories ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelCategories}>
                    <X className="h-4 w-4 mr-1" /> Annuler
                  </Button>
                  <Button
                    size="sm"
                    disabled={updateCategories.isPending}
                    onClick={handleSaveCategories}
                  >
                    {updateCategories.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Enregistrer
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCategoriesLoading || isCategoriesError}
                  onClick={() => setIsEditingCategories(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Modifier
                </Button>
              )}
            </div>

            {isCategoriesError && (
              <p role="alert" className="mb-4 text-sm text-destructive">
                Impossible de charger la liste des catégories. Réessayez plus tard.
              </p>
            )}

            {isCategoriesLoading ? (
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
            ) : isCategoriesError && isEditingCategories ? (
              <p className="text-sm text-muted-foreground">
                La modification des catégories est indisponible.
              </p>
            ) : isEditingCategories ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {allCategories.map((cat) => {
                  const checked = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        checked
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/70 hover:bg-muted/40"
                      }`}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <Switch checked={checked} onCheckedChange={() => toggleCategory(cat.id)} />
                    </button>
                  );
                })}
              </div>
            ) : user?.categories && user.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Aucune catégorie préférée définie.
              </p>
            )}
          </div>
        </div>

        {/* Barre Latérale (1/3) */}
        <div className="space-y-6 lg:col-span-1">
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
                {user?.isBlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                    <XCircle className="h-3.5 w-3.5" /> Bloqué
                  </span>
                ) : user?.isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                    <XCircle className="h-3.5 w-3.5" /> Inactif
                  </span>
                )}
              </div>

              {(user?.isPending || user?.needsApproval) && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Validation</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                    {user?.needsApproval ? "À valider" : "En attente"}
                  </span>
                </div>
              )}
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
                  {formattedDate(user?.createdAt)}
                </span>
              </div>
              {user?.acceptedAt && (
                <div className="flex justify-between">
                  <span>Invitation acceptée</span>
                  <span className="font-medium text-foreground">
                    {formattedDate(user.acceptedAt)}
                  </span>
                </div>
              )}
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
