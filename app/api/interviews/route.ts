import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role, type, level, techStack, questions } = body;

    if (!role || !type || !level) {
      return NextResponse.json(
        { error: "Role, type, and level are required" },
        { status: 400 }
      );
    }

    // Parse tech stack if provided
    const techStackArray = Array.isArray(techStack)
      ? techStack
      : techStack
      ? techStack
          .split(",")
          .map((tech: string) => tech.trim())
          .filter(Boolean)
      : [];

    // Create interview data
    const interviewData = {
      role,
      type,
      level,
      techstack: techStackArray,
      questions: questions || [],
      userId: user.id,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const interviewRef = await db.collection("interviews").add(interviewData);
    const interviewId = interviewRef.id;

    return NextResponse.json({
      success: true,
      interviewId,
      interview: { id: interviewId, ...interviewData },
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "user") {
      // Fetch user's own interviews
      const userInterviews = await db
        .collection("interviews")
        .where("userId", "==", user.id)
        .orderBy("createdAt", "desc")
        .get();

      const interviews = userInterviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        success: true,
        interviews,
      });
    } else if (type === "available") {
      // Fetch all available interviews (all interviews, filter finalized in memory)
      const allInterviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();

      // Filter for finalized interviews in memory to avoid index requirement
      const interviews = allInterviews.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((interview) => interview.finalized === true)
        .slice(0, 50); // Limit to 50 after filtering

      return NextResponse.json({
        success: true,
        interviews,
      });
    } else {
      // Default: fetch all interviews (for backward compatibility)
      const allInterviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const interviews = allInterviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        success: true,
        interviews,
      });
    }
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
