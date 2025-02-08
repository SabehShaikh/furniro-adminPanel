import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  
  // Remove authentication cookie
  cookieStore.set("isAuthenticated", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire the cookie immediately
  });

  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
