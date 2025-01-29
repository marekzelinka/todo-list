import { data, useSearchParams } from "react-router";
import { AddTodo } from "~/components/AddTodo";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import { TodoActions } from "~/components/TodoActions";
import { TodoList } from "~/components/TodoList";
import { TodoViewFilter } from "~/components/TodoViewFilter";
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
      const completed = String(formData.get("completed"));

      await todos.update(id, {
        completed: completed === "true",
        completedAt: completed === "true" ? new Date() : undefined,
      });

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

  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") || "all") as View;

  return (
    <div className="flex flex-1 flex-col md:mx-auto md:w-[720px]">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
        <ThemeSwitcher />
      </header>
      <main className="flex-1 space-y-8">
        <AddTodo />
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          {tasks.length > 0 ? (
            <TodoList todos={tasks} view={view} />
          ) : (
            <p className="text-center leading-7">No tasks available</p>
          )}
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <TodoActions tasks={tasks} />
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <TodoViewFilter view={view} />
        </div>
      </main>
    </div>
  );
}
