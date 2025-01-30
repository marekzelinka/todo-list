import { useState } from "react";
import { Form, Link, useNavigation } from "react-router";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import LoaderIcon from "~/components/icons/LoaderIcon";
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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const isSubmitting = navigation.formAction === "/signup";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
        >
          Sign in
        </Link>
      </p>
      <Form method="post">
        <fieldset disabled={isSubmitting} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm leading-none font-medium">
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
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm leading-none font-medium">
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
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm leading-none font-medium"
            >
              Password
            </label>
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
              />
              <button
                type="button"
                onClick={() => setShowPassword((prevPassword) => !prevPassword)}
                className="absolute top-[5px] right-2 text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            <div className="flex justify-end gap-4">
              <Link
                to="/forgot-password"
                className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-4 py-2 text-sm font-medium shadow transition hover:border-gray-500 disabled:pointer-events-none disabled:opacity-50 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="size-4 animate-spin" />
                Signing up
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </fieldset>
      </Form>
    </div>
  );
}
