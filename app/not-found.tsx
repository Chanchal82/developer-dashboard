
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <p className="text-6xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
