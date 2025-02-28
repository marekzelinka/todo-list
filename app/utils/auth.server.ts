import { href, redirect } from "react-router";
import { getUser } from "~/models/user";
import { getSession } from "./session.server";

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("_id");
  if (!userId) {
    return null;
  }

  return userId;
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw requireSignin();
  }

  return userId;
}

export async function requireUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }

  const { error, data: user } = await getUser(userId);
  if (error || !user) {
    throw requireSignin();
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export function requireSignin() {
  return redirect(href("/signin"), {
    /**
     * Clear the cookie to handle cases where the session ID remains in the
     * cookie but is no longer valid in the database. Without this,
     * `commitSession` willcontinue calling `updateData` instead of
     * `createData`, which updates thedatabase but doesn't set a new session ID
     * in the cookie. Clearing the cookie ensures `createData` runs on the next
     * sign-in, creating a new session ID.
     */
    headers: { "Set-Cookie": "__session=; Max-Age=0" },
  });
}
