
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const project = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
    };

    if (!project.name || !project.description) {
      setError("Please enter both the project name and description.");
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to create project."
        );
      }

      // Creation succeeded. Navigate to the projects list.
      router.replace("/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the project."
      );
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Add a Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Project name"
          maxLength={100}
          required
          disabled={isPending}
          className="rounded border p-2 text-white disabled:opacity-50"
        />

        <textarea
          name="description"
          placeholder="Project description"
          maxLength={2000}
          required
          disabled={isPending}
          rows={5}
          className="rounded border p-2 text-white disabled:opacity-50"
        />

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Project"}
        </button>
      </form>
    </main>
  );
}
