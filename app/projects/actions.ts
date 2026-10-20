"use server";

import { revalidatePath } from "next/cache";
import { projects } from "@/lib/projects";

export async function deleteProject(id: number) {
  if (!Number.isInteger(id)) {
    throw new Error("Invalid project ID.");
  }

  const index = projects.findIndex(
    (project) => project.id === id
  );

  if (index === -1) {
    throw new Error("Project not found.");
  }

  projects.splice(index, 1);

  revalidatePath("/projects");
}