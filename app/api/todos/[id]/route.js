import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // ✅ Ensure Prisma is correctly imported

export async function PUT(req, { params }) {
    try {
      // Await the params to make sure it's resolved before using it
      const { id } = await params; // Await params to resolve it
      
      if (!id) {
        return NextResponse.json(
          { status: "error", message: "ID is required in the URL" },
          { status: 400 }
        );
      }
  
      const { title } = await req.json(); // Get title from the request body
  
      if (!title || typeof title !== "string") {
        return NextResponse.json(
          { status: "error", message: "Title must be a non-empty string" },
          { status: 400 }
        );
      }
  
      const updatedTodo = await prisma.todo.update({
        where: { id },
        data: { title },
      });
  
      return NextResponse.json({ status: "success", data: updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
      return NextResponse.json(
        { status: "error", message: "Todo not found or update failed" },
        { status: 500 }
      );
    }
  }


export async function DELETE(req, { params }) {
    try {
      // Await params to access its properties
      const { id } = await params; 
  
      if (!id) {
        return NextResponse.json(
          { status: "error", message: "ID is required in the URL" },
          { status: 400 }
        );
      }
  
      await prisma.todo.delete({
        where: { id },
      });
  
      return NextResponse.json({ status: "success", message: "Todo deleted" });
    } catch (error) {
      console.error("Prisma Error:", error);
      return NextResponse.json(
        { status: "error", message: "Todo not found or failed to delete" },
        { status: 500 }
      );
    }
  }
