import { useEffect, useMemo } from "react";
import { useNavigation, useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "~/root";
import type { Theme } from "~/types";

export function useTheme(): Theme {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>("root");
  const rootTheme = rootLoaderData?.theme ?? "system";

  const optimisticTheme = useOptimisticTheme();

  return optimisticTheme ?? rootTheme;
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticTheme(): Theme | undefined {
  const navigation = useNavigation();
  if (navigation.formData?.has("theme")) {
    return navigation.formData.get("theme") as Theme;
  }
}

export function ThemeScript() {
  const theme = useTheme();

  const script = useMemo(
    () => `
      const theme = ${JSON.stringify(theme)};
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      if (theme === "system" && media.matches) {
        document.documentElement.classList.add("dark");
      }
    `,
    [], // eslint-disable-line -- we don't want this script to ever change
  );

  useEffect(() => {
    switch (theme) {
      case "system": {
        const syncTheme = (media: MediaQueryList | MediaQueryListEvent) => {
          document.documentElement.classList.toggle("dark", media.matches);
        };
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        syncTheme(media);
        media.addEventListener("change", syncTheme);
        return () => media.removeEventListener("change", syncTheme);
      }
      case "light": {
        document.documentElement.classList.remove("dark");
        break;
      }
      case "dark": {
        document.documentElement.classList.add("dark");
        break;
      }
      default: {
        console.error("Invalid theme:", theme);
      }
    }
  }, [theme]);

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
