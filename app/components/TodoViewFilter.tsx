import clsx from "clsx";
import { Form } from "react-router";
import type { View } from "~/types";

export function TodoViewFilter({ view }: { view: View }) {
  return (
    <Form className="flex items-center justify-center gap-12 text-sm">
      <button
        aria-label="View all tasks"
        name="view"
        value="all"
        className={clsx(
          "transition",
          view === "all" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
      >
        All
      </button>
      <button
        aria-label="View active tasks"
        name="view"
        value="active"
        className={clsx(
          "transition",
          view === "active" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
      >
        Active
      </button>
      <button
        aria-label="View completed"
        name="view"
        value="completed"
        className={clsx(
          "transition",
          view === "completed" ? "font-bold" : "opacity-50 hover:opacity-100",
        )}
      >
        Completed
      </button>
    </Form>
  );
}
