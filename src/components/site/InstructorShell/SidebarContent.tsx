import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { InstructorHeaderBrand, InstructorSidebarNav, InstructorSidebarFooter } from "./";

export function InstructorSidebarContent({
  user,
  pathname,
  onDisconnectClick,
}: {
  user: ReturnType<typeof useInstructorAuth>["user"];
  pathname: string;
  onDisconnectClick: () => void;
}) {
  const { setOpenMobile } = useSidebar();
  const handleNavClick = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <InstructorHeaderBrand onNavClick={handleNavClick} />
      <InstructorSidebarNav pathname={pathname} onNavClick={handleNavClick} />
      <InstructorSidebarFooter
        user={user}
        pathname={pathname}
        onNavClick={handleNavClick}
        onDisconnectClick={onDisconnectClick}
      />
    </Sidebar>
  );
}