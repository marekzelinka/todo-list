import { Outlet } from "react-router";
import ProfileMenu from "~/components/ProfileMenu";
import ThemeSwitcher from "~/components/ThemeSwitcher";

export default function DashboardLayout() {
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
