import { href, redirectDocument } from "react-router";
import { destroySession, getSession } from "~/utils/session.server";
import type { Route } from "./+types/signout";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirectDocument(href("/signin"), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
