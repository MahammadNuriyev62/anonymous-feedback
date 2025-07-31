import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { feedback, question_id } = await request.json();

    if (
      !feedback ||
      typeof feedback !== "string" ||
      feedback.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    if (!question_id || !ObjectId.isValid(question_id)) {
      return NextResponse.json(
        { error: "Valid question ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const feedbacksCollection = db.collection("feedbacks");
    const questionsCollection = db.collection("questions");

    // Verify question exists
    const questionExists = await questionsCollection.findOne({
      _id: new ObjectId(question_id),
    });

    if (!questionExists) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const result = await feedbacksCollection.insertOne({
      feedback: feedback.trim(),
      question_id: question_id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      feedback: feedback.trim(),
      question_id,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
