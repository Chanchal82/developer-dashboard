"use client";

import { useActionState } from "react";
import type { Project } from "@/lib/projects";
import type { FormState } from "./actions";

type Props = {
  project: Project;
  action: (
    prevState: FormState,
    formData: FormData
  ) => Promise<FormState>;
};

const initialState: FormState = {
  error: "",
  success: "",
};

export default function EditProjectForm({
  project,
  action,
}: Props) {
  const [state, formAction] = useActionState(
    action,
    initialState
  );

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Edit Project
      </h1>

      <form action={formAction} className="flex flex-col gap-4">
        <label htmlFor="name">Project name</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={project.name}
          required
          className="rounded border p-2 text-white"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={project.description}
          required
          className="rounded border p-2 text-white"
        />

        {state.error && (
          <p className="text-sm text-red-500">
            {state.error}
          </p>
        )}

        {state.success && (
          <p className="text-sm text-green-600">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          className="rounded bg-blue-600 p-2 text-white"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}