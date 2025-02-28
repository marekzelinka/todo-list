import { LoaderIcon } from "lucide-react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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
import { verifyUser } from "~/models/user";
import { commitSession, getSession } from "~/utils/session.server";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/signin";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Sign In | Taskgun" },
    {
      name: "description",
      content: "Access your account to manage your tasks.",
    },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fieldErrors = validateAuthForm({ email, password });
  if (fieldErrors) {
    return data({ formError: null, fieldErrors }, { status: 400 });
  }

  const { error, data: id } = await verifyUser(email, password);
  if (error) {
    return data({ formError: error, fieldErrors: null }, { status: 400 });
  }

  // Login succeeded, send them to the home page.
  session.set("_id", id as string);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/signin";

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Sign in to your account</h1>
          </CardTitle>
          <CardDescription>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-foreground underline underline-offset-4"
            >
              Sign up
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
              <div className="grid gap-2">
                <div className="flex">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  name="password"
                  id="password"
                  autoComplete="current-password"
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
                {isSubmitting ? "Signing in…" : "Sign in"}
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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Privacy Notice</AccordionTrigger>
          <AccordionContent>
            We won't use your email address for anything other than
            authenticating with this demo application. This app doesn't send
            email anyway, so you can put whatever fake email address you want.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Terms of Service</AccordionTrigger>
          <AccordionContent>
            This is a portfolio project, there are no terms of service. Don't be
            surprised if your data dissappears.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
