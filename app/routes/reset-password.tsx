import { data, Form, Link, redirect, useNavigation } from "react-router";
import LoaderIcon from "~/components/icons/LoaderIcon";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { updatePassword } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/reset-password";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Reset Password | Taskgun" },
    {
      name: "description",
      content: "Set a new password to secure your account.",
    },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  const formData = await request.formData();

  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  const fieldErrors = validateAuthForm({ newPassword, confirmPassword });
  if (fieldErrors) {
    return data({ formError: null, fieldErrors }, { status: 400 });
  }

  const { error } = await updatePassword(token, newPassword);
  if (error) {
    return data({ formError: error, fieldErrors: null }, { status: 400 });
  }

  return redirect("/signin");
}

export default function ResetPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/reset-password";

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Password reset</h1>
          </CardTitle>
          <CardDescription>
            Never mind!{" "}
            <Link
              to="/signin"
              className="text-foreground underline underline-offset-4"
            >
              Take me back to login
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            method="POST"
            noValidate
            aria-invalid={actionData?.formError ? true : undefined}
            aria-describedby={actionData?.formError ? "form-error" : undefined}
          >
            <fieldset
              disabled={isSubmitting}
              data-disabled={isSubmitting}
              className="group grid gap-6"
            >
              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <PasswordInput
                  name="new-password"
                  id="new-password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Enter your new password"
                  aria-invalid={
                    actionData?.fieldErrors?.newPassword ? true : undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.newPassword
                      ? "new-password-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.newPassword && (
                  <p
                    id="new-password-error"
                    className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                  >
                    {actionData?.fieldErrors.newPassword}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <PasswordInput
                  name="confirm-password"
                  id="confirm-password"
                  autoComplete="off"
                  required
                  minLength={8}
                  placeholder="Re-enter your new password"
                  aria-invalid={
                    actionData?.fieldErrors?.confirmPassword ? true : undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                  >
                    {actionData?.fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="relative"
              >
                {isSubmitting ? (
                  <div className="absolute inset-y-0 left-4 flex items-center">
                    <LoaderIcon aria-hidden className="size-4 animate-spin" />
                  </div>
                ) : null}
                {isSubmitting ? "Reseting…" : "Reset"}
              </Button>
              {actionData?.formError && (
                <p
                  id="form-error"
                  className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                >
                  {actionData?.formError}
                </p>
              )}
            </fieldset>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
