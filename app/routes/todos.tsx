import { data, Form } from "react-router";
import { todos } from "~/lib/db.server";
import type { Route } from "./+types/todos";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Todo App" },
    {
      name: "description",
      content: "A minimalistic todo app built with Remix.",
    },
  ];
};

export async function loader() {
  const tasks = await todos.read();

  return { tasks };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const description = String(formData.get("description"));
  await todos.create(description);

  return data({ ok: true }, { status: 201 });
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;

  return (
    <div className="flex flex-1 flex-col md:mx-auto md:w-[720px]">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
        <select className="appearance-none rounded-3xl border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <option>System</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </header>
      <main className="flex-1 space-y-8">
        <Form
          method="POST"
          className="rounded-full border border-gray-200 bg-white/90 shadow-md dark:border-gray-700 dark:bg-gray-900"
        >
          <fieldset className="flex items-center gap-2 p-2 text-sm">
            <input
              type="text"
              name="description"
              placeholder="Create a new todo..."
              required
              className="flex-1 rounded-full border-2 border-gray-200 px-3 py-2 text-sm font-bold text-black dark:border-white/50"
              aria-label="New task"
            />
            <button className="rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-3 py-2 text-base font-black transition hover:scale-105 hover:border-gray-500 sm:px-6 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white">
              Add
            </button>
          </fieldset>
        </Form>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>{task.description}</li>
              ))}
            </ul>
          ) : (
            <p className="text-center leading-7">No tasks available</p>
          )}
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="text-center leading-7">
              {tasks.length} {tasks.length === 1 ? "item" : "items"} left
            </p>
            <div className="flex items-center gap-4">
              <button className="text-red-400 transition hover:text-red-600">
                Clear Completed
              </button>
              <button className="text-red-400 transition hover:text-red-600">
                Delete All
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-center gap-12 text-sm">
            <button
              aria-label="View all tasks"
              className="opacity-50 transition hover:opacity-100"
            >
              All
            </button>
            <button
              aria-label="View active tasks"
              className="opacity-50 transition hover:opacity-100"
            >
              Active
            </button>
            <button
              aria-label="View completed"
              className="opacity-50 transition hover:opacity-100"
            >
              Completed
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
