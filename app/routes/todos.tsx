import clsx from "clsx";
import { data, Form, useFetcher, useSearchParams } from "react-router";
import { TodoActions } from "~/components/TodoActions";
import { TodoList } from "~/components/TodoList";
import { todos } from "~/lib/db.server";
import type { View } from "~/types";
import type { Route } from "./+types/todos";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Todo App" },
    {
      name: "description",
      content: "A minimalistic todo app built with Remix.",
    },
  ];
};

export async function loader() {
  const tasks = await todos.read();

  return { tasks };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const intent = formData.get("intent");
  switch (intent) {
    case "create-task": {
      const description = String(formData.get("description"));

      await todos.create(description);

      break;
    }
    case "toggle-task-completion": {
      const id = String(formData.get("id"));
      const completed = String(formData.get("completed")) === "true";

      await todos.update(id, {
        completed,
        completedAt: completed ? new Date() : undefined,
      });

      break;
    }
    case "edit-task": {
      const id = String(formData.get("id"));

      await todos.update(id, { editing: false });

      break;
    }
    case "save-task": {
      const id = String(formData.get("id"));
      const description = String(formData.get("description"));

      await todos.update(id, {
        description,
        editing: false,
      });

      break;
    }
    case "delete-task": {
      const id = String(formData.get("id"));

      await todos.delete(id);

      break;
    }
    case "clear-completed-tasks": {
      await todos.clearCompleted();

      break;
    }
    case "delete-all-tasks": {
      await todos.deleteAll();

      break;
    }
    default: {
      throw data("Unknown intent", { status: 400 });
    }
  }

  return { ok: true };
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;

  const fetcher = useFetcher();

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "all";

  return (
    <div className="flex flex-1 flex-col md:mx-auto md:w-[720px]">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
        <select className="appearance-none rounded-3xl border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <option>System</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </header>
      <main className="flex-1 space-y-8">
        <fetcher.Form
          method="POST"
          className="rounded-full border border-gray-200 bg-white/90 shadow-md dark:border-gray-700 dark:bg-gray-900"
        >
          <fieldset className="flex items-center gap-2 p-2 text-sm">
            <input
              type="text"
              name="description"
              placeholder="Create a new todo..."
              required
              className="flex-1 rounded-full border-2 border-gray-200 px-3 py-2 text-sm font-bold text-black dark:border-white/50"
              aria-label="New task"
            />
            <button
              name="intent"
              value="create-task"
              className="rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-3 py-2 text-base font-black transition hover:scale-105 hover:border-gray-500 sm:px-6 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white"
            >
              Add
            </button>
          </fieldset>
        </fetcher.Form>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          {tasks.length > 0 ? (
            <TodoList todos={tasks} view={view as View} />
          ) : (
            <p className="text-center leading-7">No tasks available</p>
          )}
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <TodoActions tasks={tasks} />
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
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
                view === "active"
                  ? "font-bold"
                  : "opacity-50 hover:opacity-100",
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
                view === "completed"
                  ? "font-bold"
                  : "opacity-50 hover:opacity-100",
              )}
            >
              Completed
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
