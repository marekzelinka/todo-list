import { HomeIcon, RefreshCwIcon } from "lucide-react";
import {
  data,
  href,
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
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";
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
    { theme, user },
    {
      headers: { Vary: "Cookie" },
    },
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <h1 className="text-text-balance text-center text-4xl font-bold tracking-tight md:text-5xl">
            Oops, an error occurred!
          </h1>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="." replace>
                <RefreshCwIcon aria-hiden />
                Try again
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={href("/")}>
                <HomeIcon aria-hidden />
                Go home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme() === "dark" ? "dark" : "";

  return (
    <html lang="en">
      <head>
        <ThemeScript />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        <TooltipProvider>{children}</TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
