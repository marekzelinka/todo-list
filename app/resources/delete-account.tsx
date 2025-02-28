import { href, redirect } from "react-router";
import { deleteUser } from "~/models/user";
import { requireSignin } from "~/utils/auth.server";
import { destroySession, getSession } from "~/utils/session.server";
import type { Route } from "./+types/delete-account";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("_id");
  if (!userId) {
    throw requireSignin();
  }

  const { error } = await deleteUser(userId);
  if (error) {
    throw error;
  }

  return redirect(href("/signup"), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
