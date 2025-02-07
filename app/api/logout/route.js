import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // ✅ Cookies se token remove karo
  response.cookies.set("token", "", {
    expires: new Date(0), // ✅ Token expire kar do
    path: "/",
  });

  return response;
}
