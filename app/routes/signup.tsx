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
import { PasswordInput } from "~/components/ui/password-input";
import { createUser } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/signup";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Sign Up | Taskgun" },
    {
      name: "description",
      content: "Create an account to manage your tasks efficiently.",
    },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fieldErrors = validateAuthForm({ name, email, password });
  if (fieldErrors) {
    return data({ formError: null, fieldErrors }, { status: 400 });
  }

  const { error } = await createUser(name, email, password);
  if (error) {
    return data({ formError: error, fieldErrors: null }, { status: 400 });
  }

  return redirect("/signin");
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/signup";

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Create an account</h1>
          </CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-foreground underline underline-offset-4"
            >
              Sign in
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
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={2}
                  placeholder="Enter your name"
                  aria-invalid={
                    actionData?.fieldErrors?.name ? true : undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.name ? "name-error" : undefined
                  }
                />
                {actionData?.fieldErrors?.name && (
                  <p
                    id="name-error"
                    className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                  >
                    {actionData?.fieldErrors.name}
                  </p>
                )}
              </div>
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
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Enter your password"
                  aria-invalid={
                    actionData?.fieldErrors?.password ? true : undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.password && (
                  <p
                    id="password-error"
                    className="text-[0.8rem] font-medium text-destructive group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50"
                  >
                    {actionData?.fieldErrors.password}
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
                {isSubmitting ? "Signing up…" : "Sign up"}
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
