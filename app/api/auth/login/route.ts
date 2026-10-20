
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { createSession } from "@/lib/auth";

type UserRecord = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client
      .db("developer_dashboard")
      .collection<UserRecord>("users");

    const user = await users.findOne({ email });

    if (!user || !(await compare(password, user.passwordHash))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(user._id.toString(), user.email);

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json(
      { message: "Could not log in" },
      { status: 500 }
    );
  }
}
