import { useMemo } from "react";
import { useFetchers } from "react-router";
import type { Item, View } from "~/types";
import { TodoItem } from "./TodoItem";

export function TodoList({ todos, view }: { todos: Item[]; view: View }) {
  const fetchers = useFetchers();

  const pendingDeleteTodoFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-task",
  );
  const isDeleting = pendingDeleteTodoFetchers.length > 0;
  const deletingTodoIds = pendingDeleteTodoFetchers.map((fetcher) =>
    String(fetcher.formData?.get("id")),
  );

  const visibleTodos = useMemo(() => {
    let filteredTodos = todos;

    if (view !== "all") {
      filteredTodos = todos.filter((todo) =>
        view === "active" ? !todo.completed : todo.completed,
      );
    }

    if (isDeleting) {
      filteredTodos = filteredTodos.filter(
        (todo) => !deletingTodoIds.includes(todo.id),
      );
    }

    return filteredTodos;
  }, [todos, view, isDeleting, deletingTodoIds]);
  if (visibleTodos.length === 0) {
    return (
      <p className="text-center leading-7">
        {view === "all"
          ? "No tasks available"
          : view === "active"
            ? "No active tasks"
            : "No completed tasks"}
      </p>
    );
  }

  return (
    <ul role="list">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
