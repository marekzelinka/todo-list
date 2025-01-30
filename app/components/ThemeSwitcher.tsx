import clsx from "clsx";
import { useRef } from "react";
import { Form, useLocation } from "react-router";
import { useTheme } from "./ThemeScript";
import { MonitorIcon } from "./icons/MonitorIcon";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";
import { UpDownIcon } from "./icons/UpDownIcon";

export default function ThemeSwitcher() {
  const location = useLocation();
  const theme = useTheme();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={detailsRef} className="group relative cursor-pointer">
      <summary
        role="button"
        tabIndex={0}
        className="flex w-28 items-center justify-between rounded-3xl border border-gray-200 bg-gray-50 px-4 py-2 transition group-open:before:fixed group-open:before:inset-0 group-open:before:cursor-auto hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 [&::-webkit-details-marker]:hidden"
        aria-haspopup="listbox"
        aria-label="Select your theme preference"
      >
        {theme.replace(/^./, (c) => c.toUpperCase())}
        <UpDownIcon className="ml-2 size-4" />
      </summary>
      <Form
        role="listbox"
        method="POST"
        action="/resources/theme"
        preventScrollReset
        replace
        onSubmit={() => {
          detailsRef.current?.removeAttribute("open");
        }}
        className="absolute top-full right-0 z-50 mt-2 w-36 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 py-1 text-sm font-semibold ring-1 shadow-lg ring-slate-900/10 dark:border-gray-700 dark:bg-gray-900 dark:ring-0"
        aria-roledescription="Theme switcher"
      >
        <input
          type="hidden"
          name="returnTo"
          value={location.pathname + location.search + location.hash}
        />
        {[
          { name: "system", icon: MonitorIcon },
          { name: "light", icon: SunIcon },
          { name: "dark", icon: MoonIcon },
        ].map((option) => (
          <button
            key={option.name}
            role="option"
            type="submit"
            name="theme"
            value={option.name}
            className={clsx(
              "flex w-full items-center px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700",
              option.name === theme ? "text-sky-500 dark:text-red-500" : "",
            )}
            aria-selected={option.name === theme}
          >
            <option.icon className="mr-2 size-5" />{" "}
            {option.name.replace(/^./, (c) => c.toUpperCase())}
          </button>
        ))}
      </Form>
    </details>
  );
}
