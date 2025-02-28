import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { Form, href, Outlet } from "react-router";
import ProfileMenu from "~/components/ProfileMenu";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { useUser } from "~/utils/user";

export default function DashboardLayout() {
  return (
    <HotkeysProvider initiallyActiveScopes={["sidebar"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mx-auto min-h-[100vh] w-full max-w-3xl flex-1 md:min-h-min">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </HotkeysProvider>
  );

  return (
    <div className="flex flex-1 flex-col gap-12 md:mx-auto md:w-[720px]">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
        <div className="flex items-center justify-center gap-2">
          <ThemeSwitcher />
          <ProfileMenu />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

function NavUser() {
  const user = useUser();

  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          aria-label="Open profile menu"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-6 rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
            <AvatarFallback />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
          </div>
          <ChevronsUpDownIcon aria-hidden className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <AvatarFallback />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Form method="post" action={href("/resources/signout")}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOutIcon aria-hidden />
              Sign out
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
