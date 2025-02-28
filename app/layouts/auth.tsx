import { ListTodoIcon } from "lucide-react";
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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ListTodoIcon aria-hidden className="size-4" />
          </div>
          Taskgun
        </div>
        <Outlet />
      </div>
    </div>
  );
}
