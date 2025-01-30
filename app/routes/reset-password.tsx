import { useState } from "react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import LoaderIcon from "~/components/icons/LoaderIcon";
import { updatePassword } from "~/models/user";
import { validateAuthForm } from "~/utils/user-validation";
import type { Route } from "./+types/reset-password";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Reset Password | Todo App" },
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

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
          Password reset
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
                <label
                  htmlFor="new-password"
                  className="block text-sm/5 font-medium"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    id="new-password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
                    placeholder="Enter new password"
                    aria-invalid={
                      actionData?.fieldErrors?.newPassword ? true : undefined
                    }
                    aria-describedby={
                      actionData?.fieldErrors?.newPassword
                        ? "new-password-error"
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
                        setShowNewPassword((prevPassword) => !prevPassword)
                      }
                      className="inline-flex text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                    >
                      {showNewPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {actionData?.fieldErrors?.newPassword && (
                  <p
                    id="new-password-error"
                    className="text-sm/5 font-medium text-red-500"
                  >
                    {actionData?.fieldErrors.newPassword}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm/5 font-medium"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    id="confirm-password"
                    autoComplete="off"
                    required
                    minLength={8}
                    className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
                    placeholder="Re-enter new password"
                    aria-invalid={
                      actionData?.fieldErrors?.confirmPassword
                        ? true
                        : undefined
                    }
                    aria-describedby={
                      actionData?.fieldErrors?.confirmPassword
                        ? "confirm-password-error"
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
                        setShowConfirmPassword((prevPassword) => !prevPassword)
                      }
                      className="inline-flex text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {actionData?.fieldErrors?.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-sm/5 font-medium text-red-500"
                  >
                    {actionData?.fieldErrors.confirmPassword}
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
                {isSubmitting ? "Reseting…" : "Reset"}
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
