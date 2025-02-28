import { useRef } from "react";
import { Form } from "react-router";
import LogoutIcon from "~/components/icons/LogoutIcon";
import { useUser } from "~/utils/user";
import { UserRoundXIcon } from "./icons/UserRoundXIcon";

export default function ProfileMenu() {
  const user = useUser();

  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={detailsRef} className="group relative cursor-pointer">
      <summary
        role="button"
        tabIndex={0}
        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition group-open:before:fixed group-open:before:inset-0 group-open:before:cursor-auto hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 [&::-webkit-details-marker]:hidden"
        aria-haspopup="menu"
        aria-label="Open profile menu"
      >
        {user.name[0].toUpperCase()}
      </summary>
      <div
        role="menu"
        className="absolute top-full right-0 z-50 mt-2 w-56 min-w-[8rem] overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 py-1 text-sm font-semibold shadow-lg ring-1 ring-slate-900/10 dark:border-gray-700 dark:bg-gray-900 dark:ring-0"
        aria-roledescription="Profile menu"
      >
        <div
          role="presentation"
          className="cursor-default border-b border-gray-200 px-4 py-2 dark:border-gray-700"
        >
          <p>{user.name}</p>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
        <Form
          role="presentation"
          method="POST"
          action="/resources/signout"
          preventScrollReset
          replace
          onSubmit={() => detailsRef.current?.removeAttribute("open")}
        >
          <button
            role="menuitem"
            type="submit"
            className="inline-flex w-full items-center px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <LogoutIcon className="mr-2 size-5 text-gray-600 dark:text-gray-400" />
            Sign out
          </button>
        </Form>
        <Form
          role="presentation"
          method="POST"
          action="/resources/delete-account"
          preventScrollReset
          replace
          onSubmit={(event) => {
            detailsRef.current?.removeAttribute("open");

            const shouldDelete = confirm(
              "Are you sure you want to delete your account?",
            );
            if (!shouldDelete) {
              event.preventDefault();
            }
          }}
        >
          <button
            role="menuitem"
            type="submit"
            className="inline-flex w-full items-center px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <UserRoundXIcon className="mr-2 size-5 text-gray-600 dark:text-gray-400" />
            Delete
          </button>
        </Form>
      </div>
    </details>
  );
}
