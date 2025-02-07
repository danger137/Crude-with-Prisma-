import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user by email and password
    const user = await prisma.user.findUnique({
      where: { email, password },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token, // ✅ Token response mein send kar diya
    });

    // Set token in cookies
    response.cookies.set("token", token, {
      httpOnly: true, // ✅ Security ke liye (JS se access nahi hoga)
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 3600, // ✅ 1 hour expiration
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
