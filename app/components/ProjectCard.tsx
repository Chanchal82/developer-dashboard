type ProjectCardProps = {
  name: string;
  description: string;
  stars: number;
};

export default function ProjectCard({
  name,
  description,
  stars,
}: ProjectCardProps) {
  return (
    <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-blue-500/10">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-white group-hover:text-blue-400">
          {name}
        </h2>

        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
          ⭐ {stars}
        </span>
      </div>

      <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
        {description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
        <span className="text-xs uppercase tracking-wide text-gray-500">
          Project
        </span>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
          View Project
        </button>
      </div>
    </div>
  );
}