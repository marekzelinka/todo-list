import type { Item, Todo } from "~/types";

const items: Item[] = [];

export const todos: Todo = {
  create: async (description) => {
    const createdTodo: Item = {
      id: Math.random().toString(16).slice(2),
      description,
      completed: false,
      createdAt: new Date(),
    };

    items.push(createdTodo);

    return createdTodo;
  },
  read: async () => {
    return items;
  },
  update: async (id, fields) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return undefined;
    }

    const updatedTodo: Item = {
      ...items[itemIndex],
      ...fields,
      completedAt: fields.completed ? fields.completedAt : undefined,
    };

    items[itemIndex] = updatedTodo;

    return updatedTodo;
  },
  delete: async (id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return undefined;
    }

    const [deletedTodo] = items.splice(itemIndex, 1);

    return deletedTodo;
  },
  clearCompleted: async () => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].completed) {
        items.splice(i, 1);
      }
    }

    return items;
  },
  deleteAll: async () => {
    items.length = 0;

    return items;
  },
};
