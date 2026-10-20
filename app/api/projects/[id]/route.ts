
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: ProjectRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("developer_dashboard");

    const project = await db.collection("projects").findOne({
      _id: new ObjectId(id),
      userId: user.userId,
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);

    return NextResponse.json(
      { message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: ProjectRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
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

    const result = await db.collection("projects").updateOne(
      {
        _id: new ObjectId(id),
        userId: user.userId,
      },
      {
        $set: {
          name: body.name.trim(),
          description: body.description.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Failed to update project:", error);

    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: ProjectRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("developer_dashboard");

    const result = await db.collection("projects").deleteOne({
      _id: new ObjectId(id),
      userId: user.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
