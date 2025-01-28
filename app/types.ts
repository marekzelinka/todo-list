export interface Item {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  editing?: boolean;
}

/**
 * Represents operations that can be performed on todo items.
 * This includes creating, reading, updating, and deleting todo items,
 * as well as clearing completed items or deleting all items.
 */
export interface Todo {
  /**
   * Creates a new todo item.
   * @param {string} description - The description of the new todo item.
   * @returns {Promise<Item>} A promise that resolves to the newly created todo item.
   */
  create: (description: string) => Promise<Item>;

  /**
   * Retrieves all todo items.
   * @returns {Promise<Item[]>} A promise that resolves to an array of todo items.
   */
  read: () => Promise<Item[]>;

  /**
   * Updates an existing todo item by its ID.
   * @param {string} id - The unique identifier of the todo item to update.
   * @param {Partial<Omit<Item, "id" | "createdAt">>} fields - An object containing the fields to update.
   * @returns {Promise<Item | undefined>} A promise that resolves to the updated todo item, or `undefined` if the item was not found.
   */
  update: (
    id: string,
    fields: Partial<Omit<Item, "id" | "createdAt">>,
  ) => Promise<Item | undefined>;

  /**
   * Deletes a todo item by its ID.
   * @param {string} id - The unique identifier of the todo item to delete.
   * @returns {Promise<Item | undefined>} A promise that resolves to the deleted todo item, or `undefined` if the item was not found.
   */
  delete: (id: string) => Promise<Item | undefined>;

  /**
   * Clears all completed todo items.
   * @returns {Promise<Item[]>} A promise that resolves to the updated list of todo items.
   */
  clearCompleted: () => Promise<Item[]>;

  /**
   * Deletes all todo items.
   * @returns {Promise<Item[]>} A promise that resolves to an empty array.
   */
  deleteAll: () => Promise<Item[]>;
}

/**
 * Represents the current view mode for displaying todo items.
 *
 * - "all": Displays all todo items.
 * - "active": Displays only the active (incomplete) todo items.
 * - "completed": Displays only the completed todo items.
 */
export type View = "all" | "active" | "completed";
