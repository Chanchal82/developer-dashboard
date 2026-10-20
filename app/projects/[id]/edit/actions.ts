"use server";

import { revalidatePath } from "next/cache";
import { projects } from "@/lib/projects";

export type FormState = {
  error: string;
  success: string;
};

export async function updateProject(
  id: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    return {
      error: "Project name is required.",
      success: "",
    };
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return {
      error: "Project description is required.",
      success: "",
    };
  }

  const index = projects.findIndex(
    (project) => project.id === id
  );

  if (index === -1) {
    return {
      error: "Project not found.",
      success: "",
    };
  }

  projects[index] = {
    ...projects[index],
    name: name.trim(),
    description: description.trim(),
  };

  revalidatePath("/projects");

  return {
    error: "",
    success: "Project updated successfully!",
  };
}