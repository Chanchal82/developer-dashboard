
import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import LogoutButton from "@/app/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("developer_dashboard");
  const projects = db.collection("projects");

  // Only retrieve projects belonging to the logged-in user.
  const userFilter = { userId: user.userId };

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const sevenDaysAgo = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    1
  );

  const [
    total,
    thisMonth,
    lastSevenDays,
    recent,
    monthlyCounts,
  ] = await Promise.all([
    projects.countDocuments(userFilter),

    projects.countDocuments({
      ...userFilter,
      createdAt: { $gte: startOfMonth },
    }),

    projects.countDocuments({
      ...userFilter,
      createdAt: { $gte: sevenDaysAgo },
    }),

    projects
      .find(userFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),

    projects
      .aggregate<{ _id: string; count: number }>([
        {
          $match: {
            ...userFilter,
            createdAt: {
              $type: "date",
              $gte: sixMonthsAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
  ]);

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    return {
      key,
      label: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      count:
        monthlyCounts.find((item) => item._id === key)?.count ?? 0,
    };
  });

  const maxCount = Math.max(
    1,
    ...months.map((month) => month.count)
  );

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Developer Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Signed in as {user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/projects"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            View Projects
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Projects", value: total },
          { label: "Created This Month", value: thisMonth },
          {
            label: "Created in Last 7 Days",
            value: lastSevenDays,
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl bg-gray-800 p-5"
          >
            <p className="text-sm text-gray-400">
              {stat.label}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-xl bg-gray-800 p-6">
        <h2 className="mb-6 text-xl font-bold">
          Projects Created Over Six Months
        </h2>

        <div
          className="flex h-48 items-end justify-around gap-3"
          role="img"
          aria-label="Bar chart of your projects created per month"
        >
          {months.map((month) => (
            <div
              key={month.key}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-sm">{month.count}</span>

              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t bg-blue-500"
                  style={{
                    height: `${Math.max(
                      5,
                      (month.count / maxCount) * 100
                    )}%`,
                  }}
                />
              </div>

              <span className="text-xs text-gray-400">
                {month.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            Recent Projects
          </h2>

          <Link
            href="/projects"
            className="text-sm text-blue-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div>
            <p className="text-gray-400">No projects yet.</p>

            <Link
              href="/projects/new"
              className="mt-3 inline-block text-blue-400 hover:underline"
            >
              + Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((project) => {
              const projectId = project._id.toString();

              return (
                <article
                  key={projectId}
                  className="rounded-lg border border-gray-700 p-4"
                >
                  {ObjectId.isValid(projectId) ? (
                    <Link
                      href={`/projects/${projectId}`}
                      className="font-semibold hover:text-blue-400"
                    >
                      {String(project.name)}
                    </Link>
                  ) : (
                    <p className="font-semibold">
                      {String(project.name)}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-gray-400">
                    {String(project.description ?? "")}
                  </p>

                  <Link
                    href="/projects"
                    className="mt-2 inline-block text-sm text-blue-400 hover:underline"
                  >
                    View all projects
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
