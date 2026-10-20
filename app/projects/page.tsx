
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
};

type SortOrder = "newest" | "oldest";

const PROJECTS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setError("");

      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data: Project[] = await response.json();
      setProjects(data);
    } catch {
      setError("Could not load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== id),
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const query = search.trim().toLowerCase();

      return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(
    filteredProjects.length / PROJECTS_PER_PAGE,
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleSortChange(value: SortOrder) {
    setSortOrder(value);
    setCurrentPage(1);
  }

  // Keep the current page valid if a project is deleted.
  useEffect(() => {
    setCurrentPage((page) =>
      Math.max(1, Math.min(page, totalPages || 1)),
    );
  }, [totalPages]);

  return (
    <main className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>

        <Link
          href="/projects/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Project
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search projects by name or description..."
          aria-label="Search projects"
          className="w-full rounded border border-gray-600 bg-transparent p-3 text-current outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="sortOrder" className="text-sm">
          Sort by:
        </label>

        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(event) =>
            handleSortChange(event.target.value as SortOrder)
          }
          className="rounded border border-gray-600 bg-gray-800 p-2 text-white"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <div>
          <p className="mb-3 text-red-500">{error}</p>

          <button
            type="button"
            onClick={loadProjects}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <p>No projects found. Add your first project to get started.</p>
      ) : filteredProjects.length === 0 ? (
        <p>No projects match "{search}". Try another search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedProjects.map((project) => (
              <article
                key={project._id}
                className="rounded-lg bg-gray-800 p-4"
              >
                <h2 className="mb-2 text-lg font-bold">{project.name}</h2>

                <p className="mb-4 whitespace-pre-wrap text-gray-300">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/projects/${project._id}/edit`}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              Showing {paginatedProjects.length} of {filteredProjects.length}{" "}
              matching projects
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="rounded bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
