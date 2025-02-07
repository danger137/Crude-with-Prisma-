// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function middleware(req) {
//   // Get token from Authorization header
//   const authHeader = req.headers.get("Authorization");
//   const token = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

//   console.log(token);
  

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Verify JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "cat says mioon");

//     // If verification is successful, continue request
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set("x-user-id", decoded.id); // Example of passing user data

//     return NextResponse.next({ request: { headers: requestHeaders } });
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
//   }
// }

// // Apply middleware to specific routes
// export const config = {
//   matcher: ["/dashboard", "/todo"], // Protects both routes
// };


import { NextResponse } from "next/server";

export function middleware(req) {
  // ✅ Token ko cookies se get karo (same naam hona chahiye jo login API mein set kiya tha)
  const token = req.cookies.get("token")?.value; // "authToken" ko "token" se replace karo

  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url)); // ✅ Redirect if no token
  }

  return NextResponse.next();
}

// ✅ Middleware sirf protected routes pe chalega
export const config = {
  matcher: ["/dashboard", "/todo"], // ✅ Protect these routes
};

