import crypto from "crypto";
import { ObjectId } from "mongodb";
import type { User } from "~/types";
import { mongodb } from "~/utils/mongodb.server";

if (!process.env.MONGODB_DBNAME) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DBNAME"');
}
if (!process.env.MONGODB_COLL_USERS) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_COLL_USERS"');
}

const dbName = process.env.MONGODB_DBNAME;
const collUsers = process.env.MONGODB_COLL_USERS;

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  try {
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
  } catch (error) {
    return { error: "An unexpected error occured.", data: null };
  }
}

export async function verifyUser(email: string, password: string) {
  try {
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
  } catch (error) {
    return { error: "An unexpected error occured.", data: null };
  }
}

export async function getUser(id: string) {
  try {
    const client = await mongodb();
    const collection = client.db(dbName).collection<User>(collUsers);

    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return { error: "User not found.", data: null };
    }

    return { error: null, data: user };
  } catch (error) {
    return { error: "An unexpected error occured.", data: null };
  }
}

export async function initiatePasswordReset(email: string): Promise<
  | {
      error: string;
      data: null;
    }
  | {
      error: null;
      data: string;
    }
> {
  // TODO
  return {} as any;
}
