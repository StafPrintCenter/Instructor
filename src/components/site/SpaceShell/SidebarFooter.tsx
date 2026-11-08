import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, UserCircle, LogOut } from "lucide-react";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SocialLinks } from "@/components/site/SocialLinks";
import { docsUrl, navItemClass } from "./config";

export function InstructorSidebarFooter({
  user,
  pathname,
  onNavClick,
  onDisconnectClick,
}: {
  user: ReturnType<typeof useInstructorAuth>["user"];
  pathname: string;
  onNavClick: () => void;
  onDisconnectClick: () => void;
}) {
  const profileActive = pathname.startsWith("/profile");

  return (
    <SidebarFooter className="border-t border-sidebar-border p-2 space-y-1">
      {/* SocialLinks */}
      <div className="px-2 pt-1 group-data-[collapsible=icon]:hidden flex flex-col gap-1.5">
        <div className="flex items-center justify-center px-1">
          <SocialLinks
            className="flex-wrap justify-center gap-0.5"
            linkClassName="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent p-1"
            iconClassName="size-3.5"
          />
        </div>

        <div className="flex items-center gap-1 border-t border-sidebar-border/40 pt-1.5">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground py-1 px-2 rounded-md hover:bg-sidebar-accent transition-colors flex-1 justify-center"
          >
            <BookOpen className="size-3.5 shrink-0" />
            <span>Doc</span>
          </a>

          <Link
            to="/cgu"
            onClick={onNavClick}
            className={`flex items-center gap-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground py-1 px-2 rounded-md hover:bg-sidebar-accent transition-colors flex-1 justify-center ${pathname === "/cgu" ? "text-sidebar-foreground bg-sidebar-accent font-medium" : ""
              }`}
          >
            <FileText className="size-3.5 shrink-0" />
            <span>CGU</span>
          </Link>
        </div>
      </div>

      <SidebarMenu>
        {/* Doc */}
        <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
          <SidebarMenuButton asChild tooltip="Documentation" className={navItemClass}>
            <a href={docsUrl} target="_blank" rel="noopener noreferrer">
              <BookOpen className="size-4 shrink-0" />
              <span>Documentation</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* CGU */}
        <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
          <SidebarMenuButton
            asChild
            isActive={pathname === "/cgu"}
            tooltip="Conditions d’utilisation"
            className={navItemClass}
          >
            <Link to="/cgu" onClick={onNavClick}>
              <FileText className="size-4 shrink-0" />
              <span>Conditions d’utilisation</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={profileActive} tooltip="Profil" className={navItemClass}>
            <Link to="/profile" onClick={onNavClick}>
              <UserCircle className="size-4 shrink-0" />
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="text-xs font-medium truncate">
                    {user?.name && user.name !== "undefined undefined" ? user.name : "Profil"}
                  </p>
                  <p className="text-[10px] opacity-60 truncate">{user?.email}</p>
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              onNavClick();
              onDisconnectClick();
            }}
            tooltip="Déconnexion"
            className="text-sidebar-foreground/80 hover:bg-destructive hover:text-white"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
