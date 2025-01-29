import { data, redirect } from "react-router";
import { serializeTheme, validateTheme } from "~/lib/theme.server";
import type { Route } from "./+types/theme";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const theme = formData.get("theme");
  if (!validateTheme(theme)) {
    throw data("Invalid theme", { status: 400 });
  }

  let returnTo = formData.get("returnTo");
  if (
    !returnTo ||
    typeof returnTo !== "string" ||
    !returnTo.startsWith("/") ||
    returnTo.startsWith("//")
  ) {
    returnTo = "/";
  }

  return redirect(returnTo, {
    headers: { "Set-Cookie": await serializeTheme(theme) },
  });
}
