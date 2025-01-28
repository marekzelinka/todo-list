import clsx from "clsx";
import { useState } from "react";
import { useFetcher } from "react-router";
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
  const fetcher = useFetcher();

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
          value={todo.completed ? "false" : "true"}
        />
        <button
          aria-label={`Mark task as ${todo.completed ? "incomplete" : "complete"}`}
          disabled={editing}
          name="intent"
          value="toggle-task-completion"
          className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          {todo.completed ? (
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
            todo.completed ? "opacity-25" : "",
          )}
        >
          <p>{todo.description}</p>
          <div className="space-y-0.5 text-xs">
            <p>
              Created at{" "}
              <time dateTime={`${new Date(todo.createdAt).toISOString()}`}>
                {dateFormatter.format(new Date(todo.createdAt))}
              </time>
            </p>
            {todo.completed && (
              <p>
                Completed at{" "}
                <time dateTime={`${new Date(todo.completedAt!).toISOString()}`}>
                  {dateFormatter.format(new Date(todo.completedAt!))}
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
              defaultValue={todo.description}
              required
              className="flex-1 rounded-full border-2 px-3 py-2 text-sm text-black"
            />
            <button
              aria-label="Save task"
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
            disabled={todo.completed}
            name="intent"
            value="edit-task"
            className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <EditIcon className="size-4" />
          </button>
        )}
        <button
          aria-label="Delete task"
          disabled={todo.completed || editing}
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
