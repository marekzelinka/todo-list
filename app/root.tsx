import clsx from "clsx";
import {
  data,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { ThemeScript, useTheme } from "./components/ThemeScript";
import { requireUser } from "./utils/auth.server";
import { parseTheme } from "./utils/theme.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await parseTheme(request);
  const user = await requireUser(request);

  return data(
    {
      theme,
      user,
    },
    {
      headers: { Vary: "Cookie" },
    },
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Oops, an error occurred!
      </h1>
      <Link
        to="."
        replace
        className="inline-flex justify-center rounded-full border border-gray-200 bg-gray-50 px-8 py-4 text-xl font-medium hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
      >
        Try again
      </Link>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme() === "dark" ? "dark" : "";

  return (
    <html
      lang="en"
      className="font-system bg-white/90 antialiased dark:bg-gray-900"
    >
      <head>
        <ThemeScript />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={clsx(
          "flex min-h-screen max-w-[100vw] flex-col overflow-x-hidden bg-gradient-to-r from-[#00fff0] to-[#0083fe] px-4 py-8 text-black dark:from-[#8E0E00] dark:to-[#1F1C18] dark:text-white",
          theme,
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
