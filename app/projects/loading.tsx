
export default function ProjectsLoading() {
  return (
    <main className="p-8" aria-live="polite">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-700" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-lg bg-gray-800"
          />
        ))}
      </div>
      <p className="mt-4 text-gray-400">Loading projects...</p>
    </main>
  );
}
