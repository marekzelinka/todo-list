import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "clear-completed-tasks",
  );

  const isDeletingAll = fetchers.some(
    (fetcher) =>
      fetcher.state !== "idle" &&
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

  const optimisticTodo = {
    completed: isTogglingCompletion
      ? fetcher.formData?.get("completed") === "true"
      : todo.completed,
    completedAt:
      isTogglingCompletion || !todo.completedAt ? new Date() : todo.completedAt,
    description: isSaving
      ? String(fetcher.formData?.get("description"))
      : todo.description,
  };

  const [isEditing, setIsEditing] = useState(false);

  // Used to focus the edit form input when we enter edit mode
  const editInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  return (
    <li
      className={clsx(
        "my-4 flex gap-4 border-b border-dashed border-gray-200 pb-4 last:border-none last:pb-0 dark:border-gray-700",
        isEditing ? "items-center" : "items-start",
      )}
    >
      <fetcher.Form method="POST">
        <input type="hidden" name="id" value={todo.id} />
        <input
          type="hidden"
          name="completed"
          value={optimisticTodo.completed ? "false" : "true"}
        />
        <button
          type="submit"
          name="intent"
          value="toggle-task-completion"
          disabled={isEditing || isActionInProgress}
          className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label={`Mark task as ${optimisticTodo.completed ? "incomplete" : "complete"}`}
        >
          {optimisticTodo.completed ? (
            <SquareCheckIcon className="size-4" />
          ) : (
            <SquareIcon className="size-4" />
          )}
        </button>
      </fetcher.Form>
      {!isEditing && (
        <div
          className={clsx(
            "flex-1 space-y-0.5",
            optimisticTodo.completed || isActionInProgress ? "opacity-50" : "",
          )}
        >
          <p>{optimisticTodo.description}</p>
          <div className="space-y-0.5 text-xs">
            <p>
              Created at{" "}
              <time dateTime={new Date(todo.createdAt).toISOString()}>
                {dateFormatter.format(new Date(todo.createdAt))}
              </time>
            </p>
            {optimisticTodo.completed && (
              <p>
                Completed at{" "}
                <time
                  dateTime={new Date(optimisticTodo.completedAt).toISOString()}
                >
                  {dateFormatter.format(new Date(optimisticTodo.completedAt))}
                </time>
              </p>
            )}
          </div>
        </div>
      )}
      <fetcher.Form
        method="POST"
        className={clsx("flex items-center gap-4", isEditing ? "flex-1" : "")}
      >
        <input type="hidden" name="id" value={todo.id} />
        {isEditing ? (
          <>
            <input
              ref={editInputRef}
              name="description"
              onBlur={(event) => {
                // Cancel edit mode when we click outside the input
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsEditing(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsEditing(false);
                }
              }}
              required
              defaultValue={optimisticTodo.description}
              className="flex-1 rounded-full border-2 px-3 py-2 text-sm text-black"
            />
            <button
              type="submit"
              name="intent"
              value="save-task"
              onClick={() => setIsEditing(false)}
              disabled={isActionInProgress}
              className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
              aria-label="Save task"
            >
              <SaveIcon className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            name="intent"
            value="edit-task"
            onClick={() => setIsEditing(true)}
            disabled={optimisticTodo.completed || isActionInProgress}
            className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
            aria-label="Edit task"
          >
            <EditIcon className="size-4" />
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value="delete-task"
          onClick={(event) => {
            const shouldDelete = confirm(
              "Are you sure you want to delete this task?",
            );
            if (!shouldDelete) {
              event.preventDefault();
            }
          }}
          disabled={optimisticTodo.completed || isEditing || isActionInProgress}
          className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label="Delete task"
        >
          <DeleteIcon className="size-4" />
        </button>
      </fetcher.Form>
    </li>
  );
}
