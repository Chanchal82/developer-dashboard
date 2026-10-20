
export default function DashboardLoading() {
  return (
    <main className="p-8" aria-live="polite">
      <h1 className="mb-6 text-2xl font-bold">Loading Dashboard...</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-gray-800"
          />
        ))}
      </div>
    </main>
  );
}
