import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const { email, password } = await request.json();

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Server misconfiguration: Missing credentials" },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      cookieStore.set("isAuthenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
