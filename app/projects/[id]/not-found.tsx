
import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="mb-3 text-3xl font-bold">Project not found</h1>

      <p className="mb-6 text-gray-400">
        This project may have been deleted, or the URL may be incorrect.
      </p>

      <Link
        href="/projects"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Back to Projects
      </Link>
    </main>
  );
}
