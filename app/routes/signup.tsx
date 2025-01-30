import { useState } from "react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import LoaderIcon from "~/components/icons/LoaderIcon";
import { createUser } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/signup";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Sign Up | Todo App" },
    {
      name: "description",
      content: "Create an account to manage your tasks efficiently.",
    },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
          Sign up
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign in
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
                <label htmlFor="name" className="block text-sm/5 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={2}
                  className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
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
                    className="text-sm/5 font-medium text-red-500"
                  >
                    {actionData?.fieldErrors.name}
                  </p>
                )}
              </div>
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
              <div className="space-y-2">
                <div className="flex justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="block text-sm/5 font-medium"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="relative text-sm/5 font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
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
                  <div
                    className="absolute inset-y-0 right-4 flex items-center"
                    aria-hidden
                  >
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={() =>
                        setShowPassword((prevPassword) => !prevPassword)
                      }
                      className="inline-flex text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {actionData?.fieldErrors?.password && (
                  <p
                    id="password-error"
                    className="text-sm/5 font-medium text-red-500"
                  >
                    {actionData?.fieldErrors.password}
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
                {isSubmitting ? "Signing up…" : "Sign up"}
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
