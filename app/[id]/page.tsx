import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { Metadata } from "next";
import QuestionClient from "./question-client";

// Server-side function to generate metadata
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    if (!ObjectId.isValid(params.id)) {
      return {
        title: "Anonymous Feedback",
        description: "Share your anonymous feedback",
      };
    }

    const db = await getDatabase();
    const question = await db.collection("questions").findOne({
      _id: new ObjectId(params.id),
    });

    if (!question) {
      return {
        title: "Question Not Found",
        description: "This feedback question could not be found",
      };
    }

    const questionText = question.question;
    const truncatedQuestion =
      questionText.length > 60
        ? questionText.substring(0, 60) + "..."
        : questionText;

    return {
      title: `${truncatedQuestion} - Anonymous Feedback`,
      description: `Share your anonymous feedback: "${questionText}"`,
      openGraph: {
        title: questionText,
        description: "Share your anonymous feedback on this question",
        type: "website",
        siteName: "Anonymous Feedback",
      },
      twitter: {
        card: "summary",
        title: questionText,
        description: "Share your anonymous feedback on this question",
      },
    };
  } catch (error) {
    return {
      title: "Anonymous Feedback",
      description: "Share your anonymous feedback",
    };
  }
}

// Server component
export default async function QuestionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  let question = null;
  let error = "";

  try {
    if (!ObjectId.isValid(params.id)) {
      error = "Invalid question ID";
    } else {
      const db = await getDatabase();
      const questionDoc = await db.collection("questions").findOne({
        _id: new ObjectId(params.id),
      });

      if (!questionDoc) {
        error = "Question not found";
      } else {
        question = {
          _id: questionDoc._id.toString(),
          question: questionDoc.question,
        };
      }
    }
  } catch (err) {
    error = "Failed to load question";
  }

  return (
    <QuestionClient
      questionId={params.id}
      initialQuestion={question}
      initialError={error}
    />
  );
}
