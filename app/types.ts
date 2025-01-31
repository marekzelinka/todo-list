import type { ObjectId } from "mongodb";

export interface Item {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Represents the current view mode for displaying todo items.
 *
 * - "all": Displays all todo items.
 * - "active": Displays only the active (incomplete) todo items.
 * - "completed": Displays only the completed todo items.
 */
export type View = "all" | "active" | "completed";

/**
 * Represents the available theme options for the application.
 *
 * - "system": Follows the system's color scheme, but defaults to light if JavaScript is disabled.
 * - "light": Applies the light color scheme.
 * - "dark": Applies the dark color scheme.
 */
export type Theme = "system" | "light" | "dark";

/**
 * Represents a user in the application.
 */
export interface User {
  /**
   * Unique identifier for the user in the database.
   * This field is optional because it should be left out when creating a new user,
   * allowing the MongoDB driver to automatically generate it.
   */
  _id?: ObjectId;
  createdAt: Date;
  name: string;
  email: string;
  password: {
    // Used in hashing the user's password.
    salt: string;
    // Hash of the user's password.
    hash: string;
  };
  tasks: Item[];
  /**
   * Token for resetting the user's password. This field is optional and is only present if a password reset was requested.
   */
  forgotPasswordToken?: string;
  /**
   * The expiration timestamp for the password reset token, in milliseconds since the Unix epoch. This field is optional.
   */
  forgotPasswordTokenExpireAt?: number;
}
