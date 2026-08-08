import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Demande de compte formateur — STAF PRINT CENTER" },
      { name: "description", content: "Soumettez une demande de compte formateur, validée ensuite par l'administration." },
      {
        property: "og:title", content: `Demande de compte formateur — STAF PRINT CENTER`
      },
      {
        property: "og:description", content: `Rejoignez l'équipe pédagogique du centre de formation STAF PRINT CENTER.`
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", title: "", specialties: "", bio: "" });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({
        ...form,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setSubmitted(true);
      toast.success("Demande envoyée : en attente de validation administrateur.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Demande d'accès formateur"
      subtitle="Votre compte sera actif après validation par l'administration."
      footer={<Link to="/" className="font-medium text-foreground underline underline-offset-4">Retour à la connexion</Link>}
    >
      {submitted ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm">
          <p className="font-display text-lg">Demande enregistrée</p>
          <p className="mt-2 text-muted-foreground">
            Statut : <span className="font-medium text-foreground">en attente de validation</span>. Vous recevrez un e-mail
            d'activation dès l'approbation de votre compte.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input id="full_name" value={form.full_name} onChange={set("full_name")} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Titre / fonction</Label>
            <Input id="title" value={form.title} onChange={set("title")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
            <Input id="specialties" value={form.specialties} onChange={set("specialties")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Présentation</Label>
            <Textarea id="bio" rows={4} value={form.bio} onChange={set("bio")} />
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? "Envoi…" : "Envoyer ma demande"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
