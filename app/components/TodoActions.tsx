import { useFetcher, useFetchers } from "react-router";
import type { Item } from "~/types";

export function TodoActions({ tasks }: { tasks: Item[] }) {
  const fetchers = useFetchers();

  const pendingToggleTodoCompletionFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "toggle-task-completion",
  );
  const isTogglingCompletion = pendingToggleTodoCompletionFetchers.length > 0;
  const completingTodos = pendingToggleTodoCompletionFetchers.map(
    (fetcher) => ({
      id: String(fetcher.formData?.get("id")),
      completed: fetcher.formData?.get("completed") === "true",
    }),
  );

  const pendingDeleteTodoFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-task",
  );
  const isDeleting = pendingDeleteTodoFetchers.length > 0;
  const deletingTodoIds = pendingDeleteTodoFetchers.map((fetcher) =>
    String(fetcher.formData?.get("id")),
  );

  tasks = isTogglingCompletion
    ? tasks.map((task) => {
        const completingTodo = completingTodos.find(
          (todo) => todo.id === task.id,
        );
        if (completingTodo) {
          task.completed = completingTodo.completed;
        }

        return task;
      })
    : tasks;

  tasks = isDeleting
    ? tasks.filter((task) => !deletingTodoIds.includes(task.id))
    : tasks;

  const fetcher = useFetcher();

  const isClearingCompleted =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "clear-completed-tasks";

  const isDeletingAll =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "delete-all-tasks";

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <p className="text-center leading-7">
        {tasks.length} {tasks.length === 1 ? "item" : "items"} left
      </p>
      <fetcher.Form method="POST" className="flex items-center gap-4">
        <button
          type="submit"
          name="intent"
          value="clear-completed-tasks"
          onClick={(event) => {
            const shouldClearCompleted = confirm(
              "Are you sure you want to clear all completed tasks?",
            );
            if (!shouldClearCompleted) {
              event.preventDefault();
            }
          }}
          disabled={
            !tasks.some((todo) => todo.completed) || isClearingCompleted
          }
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          {isClearingCompleted ? "Clearing…" : "Clear Completed"}
        </button>
        <button
          type="submit"
          name="intent"
          value="delete-all-tasks"
          onClick={(event) => {
            const shouldDeleteAll = confirm(
              "Are you sure you want to delete all tasks?",
            );
            if (!shouldDeleteAll) {
              event.preventDefault();
            }
          }}
          disabled={tasks.length === 0 || isDeletingAll}
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          {isDeletingAll ? "Deleting…" : "Delete All"}
        </button>
      </fetcher.Form>
    </div>
  );
}
