
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || name.length > 100) {
      return NextResponse.json(
        { message: "Name is required (maximum 100 characters)" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: "Enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        { message: "Password must be 8–72 characters long" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db("developer_dashboard").collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const result = await users.insertOne({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    });

    await createSession(result.insertedId.toString(), email);

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Registration failed:", error);

    return NextResponse.json(
      { message: "Could not create account" },
      { status: 500 }
    );
  }
}
