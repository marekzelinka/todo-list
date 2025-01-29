import clsx from "clsx";
import { Form } from "react-router";
import type { View } from "~/types";

export function TodoViewFilter({ view }: { view: View }) {
  return (
    <Form className="flex items-center justify-center gap-12 text-sm">
      <button
        type="submit"
        name="view"
        value="all"
        className={clsx(
          "transition",
          view === "all" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
        aria-label="View all tasks"
      >
        All
      </button>
      <button
        type="submit"
        name="view"
        value="active"
        className={clsx(
          "transition",
          view === "active" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
        aria-label="View active tasks"
      >
        Active
      </button>
      <button
        type="submit"
        name="view"
        value="completed"
        className={clsx(
          "transition",
          view === "completed" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
        aria-label="View completed"
      >
        Completed
      </button>
    </Form>
  );
}
