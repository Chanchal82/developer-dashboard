"use server";

import { revalidatePath } from "next/cache";
import { projects } from "@/lib/projects";

type FormState = {
  error: string;
  success: string;
};

export async function createProject(
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

  projects.push({
    id: Date.now(),
    name: name.trim(),
    description: description.trim(),
  });

  revalidatePath("/projects");

  return {
    error: "",
    success: "Project created successfully!",
  };
}