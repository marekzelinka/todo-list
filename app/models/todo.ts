import { ObjectId } from "mongodb";
import * as crypto from "node:crypto";
import type { Item, User } from "~/types";
import { collUsers, dbName, mongodb } from "~/utils/db.server";

export async function createTodo(userId: string, description: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    const createdTodo: Item = {
      id: crypto.randomBytes(16).toString("hex"),
      description,
      completed: false,
      createdAt: new Date(),
      completedAt: undefined,
    };

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { tasks: createdTodo } },
    );

    return createdTodo;
  } catch (error) {
    console.error("Error creating task:", error);

    return undefined;
  }
}

export async function getAllTodos(userId: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    return user.tasks;
  } catch (error) {
    console.error("Error reading task:", error);

    return undefined;
  }
}

export async function updateTodo(
  userId: string,
  todoId: string,
  fields: Partial<Omit<Item, "_id" | "createdAt">>,
) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    let updatedTodo = user.tasks.find((task) => todoId === task.id);
    if (!updatedTodo) {
      return undefined;
    }

    updatedTodo = {
      ...updatedTodo,
      ...fields,
      completedAt: fields.completed ? fields.completedAt : undefined,
    };

    await collection.updateOne(
      { _id: new ObjectId(userId), "tasks.id": todoId },
      {
        $set: {
          "tasks.$": updatedTodo,
        },
      },
    );

    return updatedTodo;
  } catch (error) {
    console.error("Error updating task:", error);

    return undefined;
  }
}

export async function deleteTodo(userId: string, todoId: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    const deletedTodo = user.tasks.find((task) => todoId === task.id);
    if (!deletedTodo) {
      return undefined;
    }

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { tasks: { id: todoId } } },
    );

    return deletedTodo;
  } catch (error) {
    console.error("Error deleting task:", error);

    return undefined;
  }
}

export async function clearCompletedTodos(userId: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { tasks: { completed: true } } },
    );

    return user.tasks.filter((task) => !task.completed);
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
    return undefined;
  }
}

export async function deleteAllTodos(userId: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    }

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { tasks: [] } },
    );

    return [];
  } catch (error) {
    console.error("Error deleting all tasks:", error);

    return undefined;
  }
}
