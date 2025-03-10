import { ObjectId } from "mongodb";
import * as crypto from "node:crypto";
import type { User } from "~/types";
import { collUsers, dbName, mongodb } from "~/utils/db.server";

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ email });
  if (user) {
    return {
      error: "The email address already exists.",
      data: null,
    };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  const { insertedId } = await collection.insertOne({
    createdAt: new Date(),
    name,
    email,
    password: { salt, hash },
    tasks: [],
  });

  return { error: null, data: insertedId.toString() };
}

export async function verifyUser(email: string, password: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ email });
  // If the user is not found, return a generic error message.
  // This prevents revealing whether the email or password is incorrect.
  if (!user) {
    return { error: "Incorrect email or password.", data: null };
  }

  const hash = crypto
    .pbkdf2Sync(password, user.password.salt, 100000, 64, "sha512")
    .toString("hex");
  // If the hashed password does not match, return a generic error message.
  // This also prevents revealing whether the email or password is incorrect.
  if (hash !== user.password.hash) {
    return { error: "Incorrect email or password.", data: null };
  }

  return { error: null, data: user._id.toString() };
}

export async function getUser(id: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    return { error: "User not found.", data: null };
  }

  return { error: null, data: user };
}

export async function initiatePasswordReset(email: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ email });
  // If the user is not found, return a generic error message.
  // This prevents revealing whether an account associated with the email exists.
  if (!user) {
    return {
      error:
        "If an account exists for this email, a password reset link will be sent.",
      data: null,
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  await collection.updateOne(
    { email },
    {
      $set: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpireAt: Date.now() + 1000 * 60 * 60, // 1 hr
      },
    },
  );

  return { error: null, data: token };
}

export async function updatePassword(token: string, password: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ forgotPasswordToken: token });
  if (!user) {
    return { error: "Token is not valid.", data: null };
  }
  if (Date.now() > (user.forgotPasswordTokenExpireAt ?? 0)) {
    return { error: "Token has expired.", data: null };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  await collection.updateOne(
    { _id: user._id },
    {
      $set: {
        password: { salt, hash },
      },
      $unset: {
        forgotPasswordToken: "",
        forgotPasswordTokenExpiryDate: "",
      },
    },
  );

  return { error: null, data: user._id.toString() };
}

export async function deleteUser(id: string) {
  const client = await mongodb();
  const collection = client.db(dbName).collection<User>(collUsers);

  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    return { error: "User not found.", data: null };
  }

  await collection.deleteOne({ _id: new ObjectId(id) });

  return { error: null, data: "User deleted successfully." };
}
