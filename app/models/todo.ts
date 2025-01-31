import { ObjectId } from "mongodb";
import * as crypto from "node:crypto";
import type { Item, User } from "~/types";
import { collUsers, dbName, mongodb } from "~/utils/db.server";

export async function createTodo(userId: string, description: string) {
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
}

export async function getAllTodos(userId: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return undefined;
  }

  return user.tasks;
}

export async function updateTodo(
  userId: string,
  todoId: string,
  fields: Partial<Omit<Item, "_id" | "createdAt">>,
) {
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
}

export async function deleteTodo(userId: string, todoId: string) {
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
}

export async function clearCompletedTodos(userId: string) {
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
}

export async function deleteAllTodos(userId: string) {
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
}
