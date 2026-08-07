import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell, BookOpen, CalendarDays, ClipboardCheck, LayoutDashboard,
  LogOut, MessagesSquare, Search, UserCircle, Users,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { relativeTime, searchApi } from "@/lib/api";
import { notificationsQuery } from "@/lib/queries";
import logo from "@/assets/logos.json";
import { toast } from "sonner";

const navMain = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/formations", label: "Mes formations", icon: BookOpen },
  { to: "/apprenants", label: "Apprenants", icon: Users },
  { to: "/corrections", label: "Corrections", icon: ClipboardCheck },
  { to: "/sessions", label: "Sessions", icon: CalendarDays },
] as const;

const navSecondary = [
  { to: "/communaute", label: "Communauté", icon: MessagesSquare },
] as const;

function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user } = useInstructorAuth();
  const instructorId = user?.id ?? "";
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { data: hits = [] } = useQuery({
    queryKey: ["search", instructorId, term],
    queryFn: () => searchApi.global(instructorId, term),
    enabled: open && Boolean(instructorId),
  });

  const groups = ["Formations", "Apprenants", "Leçons"] as const;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Rechercher une formation, un apprenant, une leçon…"
        value={term}
        onValueChange={setTerm}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        {groups.map((group) => {
          const items = hits.filter((h) => h.group === group);
          if (!items.length) return null;
          return (
            <CommandGroup key={group} heading={group}>
              {items.map((hit) => (
                <CommandItem
                  key={`${hit.group}-${hit.id}`}
                  value={`${hit.group}-${hit.label}-${hit.id}`}
                  onSelect={() => {
                    onOpenChange(false);
                    navigate({ to: hit.to, params: hit.params as never });
                  }}
                >
                  {hit.label}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}

function NotificationsMenu() {
  const { data: notifications = [] } = useQuery(notificationsQuery());
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" aria-hidden />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications ({unread} non lues)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
            <span className="text-sm font-medium">{n.title}</span>
            <span className="text-xs text-muted-foreground">{n.body}</span>
            <span className="text-[11px] text-muted-foreground">{relativeTime(n.created_at)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InstructorShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useInstructorAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Vous êtes déconnecté·e.");
    navigate({ to: "/" });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="px-3 py-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center">
              <img src={logo.mw} alt="Logo SPC" className="h-9 w-auto" />
            </span>
            <span className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
              <span className="font-display text-sm leading-tight font-bold truncate">STAF PRINT CENTER</span>
              <span className="text-[10px] text-muted-foreground truncate">Espace Formateur</span>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px]">
              Pilotage
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.to)}
                      tooltip={item.label}
                      className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px]">
              Échanges
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSecondary.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.to)}
                      tooltip={item.label}
                      className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/profil")}
                tooltip="Profil"
                className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
              >
                <Link to="/profil">
                  <UserCircle className="size-4 shrink-0" />
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-xs font-medium">{user?.name ?? "Profil"}</p>
                    <p className="truncate text-[10px] opacity-60">{user?.email}</p>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Déconnexion"
                className="text-sidebar-foreground/80 hover:bg-destructive hover:text-white"
              >
                <LogOut className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-lg border border-input bg-card px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <Search className="size-4" />
            <span className="flex-1 truncate">Rechercher…</span>
            <Badge variant="outline" className="hidden font-mono text-[10px] sm:inline-flex">
              ⌘K
            </Badge>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <NotificationsMenu />
            <Button asChild variant="soft" size="sm" className="hidden sm:inline-flex">
              <Link to="/corrections">File de correction</Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </SidebarInset>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}
