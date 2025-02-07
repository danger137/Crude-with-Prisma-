import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Save user in MongoDB
    const user = await prisma.user.create({
      data: {
        email,
        password, // Consider hashing the password before saving (bcrypt)
      },
    });

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
