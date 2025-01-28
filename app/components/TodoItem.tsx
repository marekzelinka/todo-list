import clsx from "clsx";
import { useState } from "react";
import { useFetcher, useFetchers } from "react-router";
import type { Item } from "~/types";
import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";
import { SaveIcon } from "./icons/SaveIcon";
import { SquareCheckIcon } from "./icons/SquareCheckIcon";
import { SquareIcon } from "./icons/SquareIcon";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZone: "UTC",
});

export function TodoItem({ todo }: { todo: Item }) {
  const fetchers = useFetchers();

  const isClearingCompleted = fetchers.some(
    (fetcher) =>
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "clear-completed-tasks",
  );
  const isDeletingAll = fetchers.some(
    (fetcher) =>
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "delete-all-tasks",
  );
  const isActionInProgress =
    isDeletingAll || (todo.completed && isClearingCompleted);

  const fetcher = useFetcher();

  const isTogglingCompletion =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "toggle-task-completion";
  const isSaving =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "save-task";

  const completed = isTogglingCompletion
    ? fetcher.formData?.get("completed") === "true"
    : todo.completed;
  const completedAt =
    isTogglingCompletion || !todo.completedAt ? new Date() : todo.completedAt;
  const description = isSaving
    ? String(fetcher.formData?.get("description"))
    : todo.description;

  const [isEditing, setIsEditing] = useState(false);

  const editing = typeof document !== "undefined" ? isEditing : todo.editing;

  return (
    <li
      className={clsx(
        "my-4 flex gap-4 border-b border-dashed border-gray-200 pb-4 last:border-none last:pb-0 dark:border-gray-700",
        editing ? "items-center" : "items-start",
      )}
    >
      <fetcher.Form method="POST">
        <input type="hidden" name="id" value={todo.id} />
        <input
          type="hidden"
          name="completed"
          value={completed ? "false" : "true"}
        />
        <button
          aria-label={`Mark task as ${completed ? "incomplete" : "complete"}`}
          disabled={editing || isActionInProgress}
          name="intent"
          value="toggle-task-completion"
          className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          {completed ? (
            <SquareCheckIcon className="size-4" />
          ) : (
            <SquareIcon className="size-4" />
          )}
        </button>
      </fetcher.Form>
      {!editing && (
        <div
          className={clsx(
            "flex-1 space-y-0.5",
            completed || isActionInProgress ? "opacity-25" : "",
          )}
        >
          <p>{description}</p>
          <div className="space-y-0.5 text-xs">
            <p>
              Created at{" "}
              <time dateTime={new Date(todo.createdAt).toISOString()}>
                {dateFormatter.format(new Date(todo.createdAt))}
              </time>
            </p>
            {completed && (
              <p>
                Completed at{" "}
                <time dateTime={new Date(completedAt).toISOString()}>
                  {dateFormatter.format(new Date(completedAt))}
                </time>
              </p>
            )}
          </div>
        </div>
      )}
      <fetcher.Form
        method="POST"
        className={clsx("flex items-center gap-4", editing ? "flex-1" : "")}
        onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
          switch (submitter.value) {
            case "edit-task": {
              setIsEditing(true);

              event.preventDefault();

              break;
            }
            case "save-task": {
              setIsEditing(false);

              break;
            }
            case "delete-task": {
              const shouldDelete = confirm(
                "Are you sure you want to delete this task?",
              );
              if (!shouldDelete) {
                event.preventDefault();
              }

              break;
            }
          }
        }}
      >
        <input type="hidden" name="id" value={todo.id} />
        {editing ? (
          <>
            <input
              name="description"
              defaultValue={description}
              required
              className="flex-1 rounded-full border-2 px-3 py-2 text-sm text-black"
            />
            <button
              aria-label="Save task"
              disabled={isActionInProgress}
              name="intent"
              value="save-task"
              className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <SaveIcon className="size-4" />
            </button>
          </>
        ) : (
          <button
            aria-label="Edit task"
            disabled={completed || isActionInProgress}
            name="intent"
            value="edit-task"
            className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <EditIcon className="size-4" />
          </button>
        )}
        <button
          aria-label="Delete task"
          disabled={completed || editing || isActionInProgress}
          name="intent"
          value="delete-task"
          className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <DeleteIcon className="size-4" />
        </button>
      </fetcher.Form>
    </li>
  );
}
