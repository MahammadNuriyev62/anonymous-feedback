import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const questionsCollection = db.collection("questions");

    const result = await questionsCollection.insertOne({
      question: question.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      question: question.trim(),
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
