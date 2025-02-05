import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json({ status: "success", data: todos });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

// POST: Create a new todo
export async function POST(req) {
  try {
    const body = await req.json();

    // Log and check if body is valid
    if (!body) {
      return NextResponse.json(
        { status: "error", message: "Request body is empty or invalid" },
        { status: 400 }
      );
    }

    console.log("Received Body:", body);
    console.log("Type of title:", typeof body?.title);

    // Validate the body content
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { status: "error", message: "Title must be a string and not empty" },
        { status: 400 }
      );
    }

    // Create a new Todo entry
    const newTodo = await prisma.todo.create({
      data: { title: body.title.trim() },
    });

    if (!newTodo) {
      throw new Error("Failed to create Todo");
    }

    return NextResponse.json({ status: "success", data: newTodo });
  } catch (error) {
    // Better error handling
    console.error("Error:", error.message || error);

    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a todo
export async function PUT(req) {
  try {
    const { id, title } = await req.json();

    if (!id || !title || typeof title !== "string") {
      return NextResponse.json(
        { status: "error", message: "Invalid input: id and title are required" },
        { status: 400 }
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ status: "success", data: updatedTodo });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { status: "error", message: "Todo not found or failed to update" },
      { status: 404 }
    );
  }
}

// DELETE: Remove a todo
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required to delete a todo" },
        { status: 400 }
      );
    }

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ status: "success", message: "Todo deleted" });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { status: "error", message: "Todo not found or failed to delete" },
      { status: 404 }
    );
  }
}
