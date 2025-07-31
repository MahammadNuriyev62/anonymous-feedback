import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const feedbacksCollection = db.collection("feedbacks");

    const feedbacks = await feedbacksCollection
      .find({ question_id: id })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedFeedbacks = feedbacks.map((feedback) => ({
      _id: feedback._id.toString(),
      feedback: feedback.feedback,
      question_id: feedback.question_id,
      createdAt: feedback.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
