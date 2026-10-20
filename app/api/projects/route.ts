
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;

    const projects = await client
      .db("developer_dashboard")
      .collection("projects")
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);

    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 100 ||
      typeof body.description !== "string" ||
      !body.description.trim() ||
      body.description.trim().length > 2000
    ) {
      return NextResponse.json(
        {
          message:
            "Name is required (maximum 100 characters) and description is required (maximum 2000 characters).",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("developer_dashboard");

    const newProject = {
      name: body.name.trim(),
      description: body.description.trim(),
      userId: user.userId,
      createdAt: new Date(),
    };

    const result = await db
      .collection("projects")
      .insertOne(newProject);

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: {
          _id: result.insertedId,
          ...newProject,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create project:", error);

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
