import { data, Form, Link, redirect, useNavigation } from "react-router";
import LoaderIcon from "~/components/icons/LoaderIcon";
import { initiatePasswordReset } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/forgot-password";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Forgot Password | Todo App" },
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
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
          Password recovery
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Never mind!{" "}
          <Link
            to="/signin"
            className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Take me back to login
          </Link>
        </p>
      </header>
      <main>
        <Form
          method="POST"
          noValidate
          aria-invalid={actionData?.formError ? true : undefined}
          aria-describedby={actionData?.formError ? "form-error" : undefined}
        >
          <div className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm/5 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
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
                    className="text-sm/5 font-medium text-red-500"
                  >
                    {actionData?.fieldErrors.email}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-4 py-2 text-sm font-medium shadow transition hover:border-gray-500 disabled:pointer-events-none disabled:opacity-50 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white"
              >
                {isSubmitting ? (
                  <div
                    className="absolute inset-y-0 left-4 flex items-center"
                    aria-hidden
                  >
                    <LoaderIcon className="size-4 animate-spin" />
                  </div>
                ) : null}
                {isSubmitting ? "Recovering…" : "Recover"}
              </button>
            </fieldset>
            {actionData?.formError && (
              <div
                id="form-error"
                className="block text-sm/5 font-medium text-red-500"
              >
                {actionData?.formError}
              </div>
            )}
          </div>
        </Form>
      </main>
    </div>
  );
}
