
"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

type Project = {
  _id: string;
  name: string;
  description: string;
};

export default function EditProjectPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/projects/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load project.");
        }

        const project: Project = data.project ?? data;

        if (!cancelled) {
          setName(project.name ?? "");
          setDescription(project.description ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the project."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setError("Please enter both the project name and description.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Project name cannot exceed 100 characters.");
      return;
    }

    if (trimmedDescription.length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project.");
      }

      router.replace("/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the project."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-8 text-gray-200">
        Loading project...
      </main>
    );
  }

  if (error && !name && !description) {
    return (
      <main className="mx-auto max-w-2xl p-8 text-gray-200">
        <p className="mb-4 text-red-400">{error}</p>
        <Link
          href="/projects"
          className="text-blue-400 hover:underline"
        >
          ← Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8 text-gray-100">
      <Link
        href={`/projects/${id}`}
        className="mb-6 inline-block text-blue-400 hover:underline"
      >
        ← Back to Project Details
      </Link>

      <h1 className="mb-2 text-3xl font-bold">Edit Project</h1>
      <p className="mb-6 text-gray-400">
        Update your project name and description.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-gray-800 p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium"
          >
            Project Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={6}
            required
            className="w-full resize-y rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="Enter project description"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Project"}
          </button>

          <Link
            href={`/projects/${id}`}
            className="rounded-lg border border-gray-600 px-5 py-3 text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
