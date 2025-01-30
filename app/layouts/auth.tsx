import { Outlet, redirect } from "react-router";
import { getUserId } from "~/utils/auth.server";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/");
  }

  return {};
}

export default function AuthLayout() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 md:mx-auto md:w-[720px] lg:p-20">
      <div className="w-full rounded-3xl border border-gray-200 bg-white/90 p-8 dark:border-gray-700 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
}
