import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Users, ClipboardCheck, CalendarDays, MessagesSquare, LogOut, UserCircle } from "lucide-react";

import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { toast } from "sonner";
import logo from "@/assets/logos.json";
import { SITE } from "@/data/site";
import { ConfirmDisconnect } from "@/components/site/InstructorBits";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset, } from "@/components/ui/sidebar";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; matchPrefixes?: string[]; };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Général",
    items: [
      { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { to: "/formations", label: "Mes formations", icon: BookOpen },
      { to: "/apprenants", label: "Apprenants", icon: Users },
      { to: "/corrections", label: "Corrections", icon: ClipboardCheck },
      { to: "/sessions", label: "Sessions", icon: CalendarDays },
    ],
  },
  {
    label: "Pilotage",
    items: [
      { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { to: "/formations", label: "Mes formations", icon: BookOpen },
      { to: "/apprenants", label: "Apprenants", icon: Users },
      { to: "/corrections", label: "Corrections", icon: ClipboardCheck },
      { to: "/sessions", label: "Sessions", icon: CalendarDays },
    ],
  },
  {
    label: "Échanges",
    items: [
      { to: "/communaute", label: "Communauté", icon: MessagesSquare },
    ],
  },
];

const navItemClass =
  "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " +
  "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground " +
  "data-[active=true]:hover:bg-sidebar-primary data-[active=true]:hover:text-sidebar-primary-foreground";

export function InstructorShell({ children }: { children?: React.ReactNode }) {
  const { user, ready, isAuthenticated, logout } = useInstructorAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false);

  useEffect(() => {
    if (ready && !isAuthenticated) navigate({ to: "/login" });
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnecté");
    navigate({ to: "/login" });
  };

  const isLinkActive = (n: NavItem) =>
    n.exact ? pathname === n.to : n.matchPrefixes ? n.matchPrefixes.some((prefix) => pathname.startsWith(prefix)) : pathname.startsWith(n.to);

  const profileActive = pathname.startsWith("/profil");

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="px-3 py-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center">
              <img src={logo.mw} alt="Logo SPC" className="h-9 w-auto" />
            </span>
            <span className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
              <span className="font-display font-bold text-sm truncate">{SITE.name}</span>
              <span className="text-[10px] opacity-60 truncate">Espace Formateur</span>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {NAV_GROUPS.map((g) => (
            <SidebarGroup key={g.label}>
              <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px]">
                {g.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {g.items.map((item) => {
                    const active = isLinkActive(item);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={navItemClass}
                        >
                          <Link to={item.to as "/dashboard"}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={profileActive}
                tooltip="Profil"
                className={navItemClass}
              >
                <Link to="/profil">
                  <UserCircle className="size-4 shrink-0" />
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                      <p className="text-xs font-medium truncate">{user?.name ?? "Profil"}</p>
                      <p className="text-[10px] opacity-60 truncate">{user?.email}</p>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setConfirmDisconnectOpen(true)}
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

      <SidebarInset className="flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="flex items-center gap-3 bg-card/80 backdrop-blur border-b px-4 h-14 shrink-0">
          <SidebarTrigger />
          <div className="font-display font-semibold text-sm">Formateur</div>
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">{user?.email}</div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto overflow-x-hidden bg-muted/30">
          {children ?? <Outlet />}
        </main>
      </SidebarInset>

      <ConfirmDisconnect
        open={confirmDisconnectOpen}
        onOpenChange={setConfirmDisconnectOpen}
        onConfirm={handleLogout}
      />
    </SidebarProvider>
  );
}