import { useFetcher } from "react-router";
import type { Item } from "~/types";

export function TodoActions({ tasks }: { tasks: Item[] }) {
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
      <fetcher.Form
        method="post"
        className="flex items-center gap-4"
        onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
          switch (submitter.value) {
            case "clear-completed-tasks": {
              const shouldClearCompleted = confirm(
                "Are you sure you want to clear all completed tasks?",
              );
              if (!shouldClearCompleted) {
                event.preventDefault();
              }

              break;
            }
            case "delete-all-tasks": {
              const shouldDeleteAll = confirm(
                "Are you sure you want to delete all tasks?",
              );
              if (!shouldDeleteAll) {
                event.preventDefault();
              }

              break;
            }
          }
        }}
      >
        <button
          disabled={
            !tasks.some((todo) => todo.completed) || isClearingCompleted
          }
          name="intent"
          value="clear-completed-tasks"
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          {isClearingCompleted ? "Clearing…" : "Clear Completed"}
        </button>
        <button
          disabled={tasks.length === 0 || isDeletingAll}
          name="intent"
          value="delete-all-tasks"
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          {isDeletingAll ? "Deleting…" : "Delete All"}
        </button>
      </fetcher.Form>
    </div>
  );
}
