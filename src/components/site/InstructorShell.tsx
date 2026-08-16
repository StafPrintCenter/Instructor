import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Users, ClipboardCheck, CalendarDays, LogOut, UserCircle, Users2, Mail } from "lucide-react";

import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { toast } from "sonner";
import logo from "@/assets/logos.json";
import { SITE } from "@/data/site";
import { ConfirmDisconnect } from "@/components/site/InstructorBits";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  matchPrefixes?: string[];
};

type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Général",
    items: [
      { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Pilotage",
    items: [
      { to: "/trainings", label: "Mes formations", icon: BookOpen },
      { to: "/students", label: "Apprenants", icon: Users },
      { to: "/corrections", label: "Corrections", icon: ClipboardCheck },
      { to: "/sessions", label: "Sessions", icon: CalendarDays },
    ],
  },
  {
    label: "Échanges",
    items: [
      { to: "/community", label: "Communauté", icon: Users2 },
      { to: "/messages", label: "Messages privés", icon: Mail },
    ],
  },
];

const navItemClass =
  "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " +
  "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground " +
  "data-[active=true]:hover:bg-sidebar-primary data-[active=true]:hover:text-sidebar-primary-foreground";

function InstructorSidebarContent({
  user,
  pathname,
  onDisconnectClick,
}: {
  user: ReturnType<typeof useInstructorAuth>["user"];
  pathname: string;
  onDisconnectClick: () => void;
}) {
  const { setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  const isLinkActive = (n: NavItem) =>
    n.exact
      ? pathname === n.to
      : n.matchPrefixes
        ? n.matchPrefixes.some((prefix) => pathname.startsWith(prefix))
        : pathname.startsWith(n.to);

  const profileActive = pathname.startsWith("/profil");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="px-3.5 py-4">
        <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden">
            <img src={logo.mw} alt="Logo SPC" className="h-7 w-auto object-contain" />
          </span>
          <span className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
            <span className="font-display font-bold text-sm tracking-tight truncate">{SITE.name}</span>
            <span className="text-[10px] opacity-60 truncate">Espace Formateur</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {NAV_GROUPS.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px] px-2">
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
                        <Link to={item.to as "/dashboard"} onClick={handleNavClick}>
                          <item.icon className="size-4 shrink-0" />
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
                      <p className="text-xs font-medium truncate">{user?.name && user.name !== "undefined undefined" ? user.name : "Profil"}</p>
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
        <header className="flex items-center gap-3 bg-card/80 backdrop-blur border-b px-5 h-14 shrink-0">
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