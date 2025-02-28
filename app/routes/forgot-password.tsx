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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { initiatePasswordReset } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/forgot-password";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Forgot Password | Taskgun" },
    {
      name: "description",
      content: "Recover your password to regain access to your account.",
    },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;

  const fieldErrors = validateAuthForm({ email });
  if (fieldErrors) {
    return data({ formError: null, fieldErrors }, { status: 400 });
  }

  const { error, data: token } = await initiatePasswordReset(email);
  if (error) {
    return data({ formError: error, fieldErrors: null }, { status: 400 });
  }

  return redirect(`/reset-password?token=${token}`);
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/forgot-password";

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Password recovery</h1>
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
                <Label htmlFor="email">Email address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  aria-invalid={
                    actionData?.fieldErrors?.email ? true : undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.email ? "email-error" : undefined
                  }
                />
                {actionData?.fieldErrors?.email && (
                  <p
                    id="email-error"
                    className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                  >
                    {actionData?.fieldErrors.email}
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
                {isSubmitting ? "Recovering…" : "Recover"}
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
