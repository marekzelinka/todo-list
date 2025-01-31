import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";

export function AddTodo() {
  const fetcher = useFetcher();

  const isPending =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "create-task";

  const addFormRef = useRef<HTMLFormElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear and focus the input after the first submit
    if (fetcher.data && !isPending) {
      addFormRef.current?.reset();
      addInputRef.current?.focus();
    }
  }, [isPending]);

  return (
    <fetcher.Form
      ref={addFormRef}
      method="POST"
      className="rounded-full border border-gray-200 bg-white/90 shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <fieldset
        disabled={isPending}
        className="flex items-center gap-2 p-2 text-sm disabled:pointer-events-none disabled:opacity-25"
      >
        <input
          ref={addInputRef}
          type="text"
          name="description"
          required
          className="flex-1 rounded-full border-2 border-gray-200 px-3 py-2 text-sm font-bold text-black placeholder:text-gray-400 dark:border-white/50"
          placeholder="Create a new todo..."
          aria-label="New task"
        />
        <button
          type="submit"
          name="intent"
          value="create-task"
          className="rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-3 py-2 text-base font-black transition hover:scale-105 hover:border-gray-500 sm:px-6 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white"
        >
          {isPending ? "Adding…" : "Add"}
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
