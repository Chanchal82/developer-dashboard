type StatCardProps = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-blue-500">
      <p className="text-sm font-medium text-gray-400">{title}</p>

      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}