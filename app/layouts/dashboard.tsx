import { Outlet } from "react-router";
import ThemeSwitcher from "~/components/ThemeSwitcher";

export default function DashboardLayout() {
  return (
    <div className="flex flex-1 flex-col md:mx-auto md:w-[720px]">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
        <ThemeSwitcher />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
