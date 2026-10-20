
"use client";

import { useEffect } from "react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects route error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-3 text-2xl font-bold">
        Something went wrong
      </h1>

      <p className="mb-5 text-gray-400">
        We couldn't display the projects. Try loading this page again.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try Again
      </button>
    </main>
  );
}
