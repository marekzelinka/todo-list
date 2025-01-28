import type { Item } from "~/types";
import { TodoItem } from "./TodoItem";

export default function TodoList({ todos }: { todos: Item[] }) {
  return (
    <ul role="list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
