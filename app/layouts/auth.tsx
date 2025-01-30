import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 md:mx-auto md:w-[720px] lg:p-20">
      <div className="w-full flex-col space-y-4 rounded-3xl border border-gray-200 bg-white/90 p-8 dark:border-gray-700 dark:bg-gray-900">
        <header>
          <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
            Sign up
          </h1>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
