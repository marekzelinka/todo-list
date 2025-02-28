import { data, useSearchParams } from "react-router";
import { AddTodo } from "~/components/AddTodo";
import { TodoActions } from "~/components/TodoActions";
import { TodoList } from "~/components/TodoList";
import { TodoViewFilter } from "~/components/TodoViewFilter";
import {
  clearCompletedTodos,
  createTodo,
  deleteAllTodos,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "~/models/todo";
import type { View } from "~/types";
import { requireUserId } from "~/utils/auth.server";
import type { Route } from "./+types/todos";

export const meta: Route.MetaFunction = () => [
  { title: "Your todos | Taskgun" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);

  const tasks = await getAllTodos(userId);

  return { tasks: tasks ?? [] };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const intent = formData.get("intent");
  switch (intent) {
    case "create-task": {
      const description = String(formData.get("description"));

      await createTodo(userId, description);

      break;
    }
    case "toggle-task-completion": {
      const todoId = String(formData.get("id"));
      const completed = String(formData.get("completed"));

      await updateTodo(userId, todoId, {
        completed: completed === "true",
        completedAt: completed === "true" ? new Date() : undefined,
      });

      break;
    }
    case "save-task": {
      const todoId = String(formData.get("id"));
      const description = String(formData.get("description"));

      await updateTodo(userId, todoId, {
        description,
      });

      break;
    }
    case "delete-task": {
      const id = String(formData.get("id"));

      await deleteTodo(userId, id);

      break;
    }
    case "clear-completed-tasks": {
      await clearCompletedTodos(userId);

      break;
    }
    case "delete-all-tasks": {
      await deleteAllTodos(userId);

      break;
    }
    default: {
      throw data(`Invalid/Missing intent: ${intent}`, { status: 400 });
    }
  }
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;

  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") ?? "all") as View;

  return (
    <div className="space-y-8">
      <AddTodo />
      <div className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white/90 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
        <div className="px-4 py-2">
          {tasks.length > 0 ? (
            <TodoList todos={tasks} view={view} />
          ) : (
            <p className="text-center leading-7">No tasks available</p>
          )}
        </div>
        <div className="px-6 py-2">
          <TodoViewFilter view={view} />
        </div>
        <div className="px-6 py-2">
          <TodoActions tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
