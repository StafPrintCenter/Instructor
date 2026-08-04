import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, LayoutList, MapPin, Plus, Video } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCalendar } from "@/components/instructor/session-calendar";
import { rosterQuery, sessionsQuery, trainingsQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { formatDateTime, sessionsApi, type SessionRow } from "@/lib/api";

export const Route = createFileRoute("/_instructor/sessions")({
  head: () => ({
    meta: [
      { title: "Sessions & présences — STAF PRINT CENTER" },
      {
        name: "description",
        content: "Planifiez vos sessions live ou en présentiel à Cotonou et enregistrez les présences des apprenants.",
      },
      { property: "og:title", content: "Sessions & présences — STAF PRINT CENTER" },
      { property: "og:description", content: "Planning des sessions et feuille de présence par cohorte." },
    ],
  }),
  loader: ({ context }) => {
    const id = getSessionInstructorId();
    return Promise.all([
      context.queryClient.ensureQueryData(sessionsQuery(id)),
      context.queryClient.ensureQueryData(trainingsQuery(id)),
    ]);
  },
  component: SessionsPage,
});

function AttendanceSheet({ session }: { session: SessionRow }) {
  const queryClient = useQueryClient();
  const { data: roster = [] } = useQuery(rosterQuery(session.training_id));
  const mark = useMutation({
    mutationFn: (input: { studentId: string; present: boolean }) =>
      sessionsApi.setAttendance(session.id, input.studentId, input.present),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-2">
      {roster.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun apprenant inscrit à cette cohorte.</p>
      ) : (
        roster.map((student) => {
          const record = session.attendance.find((a) => a.student_id === student.id);
          return (
            <div
              key={student.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
            >
              <span className="text-sm">{student.full_name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {record ? (record.present ? "Présent·e" : "Absent·e") : "Non pointé"}
                </span>
                <Switch
                  checked={!!record?.present}
                  onCheckedChange={(present) => mark.mutate({ studentId: student.id, present })}
                  aria-label={`Présence de ${student.full_name}`}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function SessionsPage() {
  const { instructorId } = useInstructorAuth();
  const queryClient = useQueryClient();
  const { data: sessions } = useSuspenseQuery(sessionsQuery(instructorId));
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));
  const [open, setOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [form, setForm] = useState({
    training_id: trainings[0]?.id ?? "",
    title: "",
    mode: "live" as "live" | "onsite",
    starts_at: "",
    duration_minutes: 90,
    location: "",
    notes: "",
  });

  const create = useMutation({
    mutationFn: () =>
      sessionsApi.create({
        training_id: form.training_id,
        title: form.title,
        mode: form.mode,
        starts_at: new Date(form.starts_at).toISOString(),
        duration_minutes: Number(form.duration_minutes),
        location: form.location,
        notes: form.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setOpen(false);
      setForm((f) => ({ ...f, title: "", starts_at: "", location: "", notes: "" }));
      toast.success("Session planifiée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const now = Date.now();
  const upcoming = sessions.filter((s) => +new Date(s.starts_at) >= now);
  const past = sessions.filter((s) => +new Date(s.starts_at) < now).reverse();

  const renderSession = (s: SessionRow) => (
    <Card key={s.id}>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-snug">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.training_title}</p>
          </div>
          <Badge variant={s.mode === "live" ? "secondary" : "outline"} className="gap-1.5">
            {s.mode === "live" ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
            {s.mode === "live" ? "En ligne" : "Présentiel"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> {formatDateTime(s.starts_at)}
          </span>
          <span>{s.duration_minutes} min</span>
          <span>{s.location}</span>
          <span>
            {s.attendance.filter((a) => a.present).length}/{s.attendance.length || 0} présent·e·s pointé·e·s
          </span>
        </div>
        {s.notes ? <p className="text-sm text-muted-foreground">{s.notes}</p> : null}
        <Button
          variant="soft"
          size="sm"
          onClick={() => setOpenSheet(openSheet === s.id ? null : s.id)}
        >
          {openSheet === s.id ? "Masquer la feuille de présence" : "Feuille de présence"}
        </Button>
        {openSheet === s.id ? <AttendanceSheet session={s} /> : null}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Planning"
        title="Sessions & présences"
        description="Organisez vos ateliers live et en présentiel, puis pointez les présences."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="size-4" /> Planifier une session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle session</DialogTitle>
                <DialogDescription>
                  La session apparaîtra dans l'agenda des apprenants de la cohorte choisie.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Formation</Label>
                  <Select
                    value={form.training_id}
                    onValueChange={(v) => setForm((f) => ({ ...f, training_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainings.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="session-title">Intitulé</Label>
                  <Input
                    id="session-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Atelier sérigraphie — préparation des écrans"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="session-date">Date et heure</Label>
                    <Input
                      id="session-date"
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="session-duration">Durée (min)</Label>
                    <Input
                      id="session-duration"
                      type="number"
                      min={15}
                      value={form.duration_minutes}
                      onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Modalité</Label>
                    <Select
                      value={form.mode}
                      onValueChange={(v) => setForm((f) => ({ ...f, mode: v as "live" | "onsite" }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">En ligne</SelectItem>
                        <SelectItem value="onsite">Présentiel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="session-location">Lieu / lien</Label>
                    <Input
                      id="session-location"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Studio Akpakpa ou lien visio"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="session-notes">Notes</Label>
                  <Textarea
                    id="session-notes"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Matériel à prévoir, consignes…"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="accent"
                  disabled={create.isPending || !form.title || !form.starts_at || !form.training_id}
                  onClick={() => create.mutate()}
                >
                  Planifier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list" className="gap-1.5"><LayoutList className="size-4" /> Liste</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5"><CalendarDays className="size-4" /> Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <SessionCalendar sessions={sessions} renderSession={renderSession} />
        </TabsContent>

        <TabsContent value="list" className="space-y-8">
      <section className="space-y-4">
        <CardHeaderTitle title="À venir" count={upcoming.length} />
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="size-6" />}
            title="Aucune session à venir"
            description="Planifiez un atelier pour vos cohortes."
          />
        ) : (
          <div className="space-y-4">{upcoming.map(renderSession)}</div>
        )}
      </section>

      {past.length > 0 ? (
        <section className="space-y-4">
          <CardHeaderTitle title="Sessions passées" count={past.length} />
          <div className="space-y-4">{past.map(renderSession)}</div>
        </section>
      ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CardHeaderTitle({ title, count }: { title: string; count: number }) {
  return (
    <CardHeader className="px-0 py-0">
      <CardTitle className="font-display text-xl">
        {title} <span className="text-sm font-normal text-muted-foreground">({count})</span>
      </CardTitle>
    </CardHeader>
  );
}
