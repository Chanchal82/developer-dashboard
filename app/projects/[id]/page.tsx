
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailsPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;

  const project = await client
    .db("developer_dashboard")
    .collection("projects")
    .findOne({
      _id: new ObjectId(id),
      userId: user.userId,
    });

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8 text-gray-100">
      <Link
        href="/projects"
        className="mb-6 inline-block text-blue-400 hover:underline"
      >
        ← Back to Projects
      </Link>

      <div className="rounded-xl bg-gray-800 p-6">
        <h1 className="mb-4 text-3xl font-bold">{project.name}</h1>

        <p className="whitespace-pre-wrap text-gray-300">
          {project.description}
        </p>

        <div className="mt-6">
          <Link
            href={`/projects/${id}/edit`}
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Edit Project
          </Link>
        </div>
      </div>
    </main>
  );
}
