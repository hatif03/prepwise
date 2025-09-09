import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, type, level, techStack } = body;

    if (!role || !type || !level) {
      return NextResponse.json(
        { error: "Role, type, and level are required" },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "GEMINI_API_KEY not found, falling back to static questions"
      );
      const questions = generateQuestionsByType(role, type, level, techStack);
      return NextResponse.json({
        success: true,
        questions,
      });
    }

    // Generate questions using Gemini AI
    const questions = await generateQuestionsWithGemini(
      role,
      type,
      level,
      techStack
    );

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error generating questions:", error);

    // Fallback to static questions if Gemini fails
    try {
      const body = await request.json();
      const { role, type, level, techStack } = body;
      const questions = generateQuestionsByType(role, type, level, techStack);

      return NextResponse.json({
        success: true,
        questions,
        fallback: true,
      });
    } catch {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

async function generateQuestionsWithGemini(
  role: string,
  type: string,
  level: string,
  techStack: string[]
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const techStackText =
      techStack && techStack.length > 0
        ? ` with focus on these technologies: ${techStack.join(", ")}`
        : "";

    const prompt = `You are an expert interview coach. Generate exactly 5 high-quality interview questions for a ${level.toLowerCase()} level ${role} position.

Interview Type: ${type}
Experience Level: ${level}
Role: ${role}${techStackText}

Requirements:
- Questions should be appropriate for ${level.toLowerCase()} level candidates
- Focus on ${type.toLowerCase()} aspects
- Make questions specific to the ${role} role
- Include practical, real-world scenarios
- Ensure questions are clear and actionable
- Avoid generic or overly broad questions

Format: Return only the questions, one per line, without numbering or bullet points.

Example format:
What specific challenges have you faced when working with [technology] in production environments?
Describe a time when you had to optimize performance in a [role-specific] project.
How do you approach debugging complex issues in [technology stack]?

Generate 5 questions now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response to extract questions
    const questions = text
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && !q.match(/^\d+\./)) // Remove numbered items
      .slice(0, 5); // Ensure we only get 5 questions

    // If we don't have enough questions, supplement with fallback
    if (questions.length < 5) {
      const fallbackQuestions = generateQuestionsByType(
        role,
        type,
        level,
        techStack
      );
      const needed = 5 - questions.length;
      questions.push(...fallbackQuestions.slice(0, needed));
    }

    return questions;
  } catch (error) {
    console.error("Error with Gemini AI:", error);
    throw error;
  }
}

function generateQuestionsByType(
  role: string,
  type: string,
  level: string,
  techStack: string[]
): string[] {
  const baseQuestions = {
    Technical: [
      `Explain your experience with ${role} and the technologies you've worked with.`,
      `Describe a challenging technical problem you solved in your previous role.`,
      `How do you approach debugging and troubleshooting issues?`,
      `What design patterns have you implemented in your projects?`,
      `How do you ensure code quality and maintainability?`,
    ],
    Behavioral: [
      `Tell me about a time when you had to work under pressure to meet a deadline.`,
      `Describe a situation where you had to collaborate with a difficult team member.`,
      `Give me an example of a project where you took initiative to improve something.`,
      `Tell me about a time when you failed and what you learned from it.`,
      `Describe a situation where you had to learn a new technology quickly.`,
    ],
    Situational: [
      `How would you handle a situation where a client is not satisfied with your work?`,
      `What would you do if you discovered a critical bug in production?`,
      `How would you approach a project with unclear requirements?`,
      `What would you do if you disagreed with a technical decision made by your team lead?`,
      `How would you handle a situation where you're behind schedule on a project?`,
    ],
    Mixed: [
      `Tell me about your experience with ${role} and what interests you most about this field.`,
      `Describe a technical challenge you faced and how you solved it.`,
      `How do you stay updated with the latest technologies and industry trends?`,
      `Give me an example of a project where you had to work with multiple stakeholders.`,
      `What would you do if you had to implement a feature you've never worked with before?`,
    ],
  };

  let questions =
    baseQuestions[type as keyof typeof baseQuestions] || baseQuestions.Mixed;

  // Add level-specific questions
  if (level === "Entry") {
    questions = [
      `What motivated you to pursue a career in ${role}?`,
      `Tell me about your educational background and how it relates to this role.`,
      `What projects have you worked on during your studies or personal time?`,
      `How do you approach learning new technologies?`,
      ...questions.slice(0, 3),
    ];
  } else if (level === "Senior") {
    questions = [
      `How do you mentor junior developers and help them grow?`,
      `Describe your experience leading technical projects and making architectural decisions.`,
      `How do you handle technical debt and prioritize refactoring efforts?`,
      `Tell me about a time when you had to make a difficult technical trade-off.`,
      ...questions.slice(0, 3),
    ];
  }

  // Add tech stack specific questions if provided
  if (techStack && techStack.length > 0) {
    const techQuestions = techStack.map(
      (tech) =>
        `Can you explain your experience with ${tech} and how you've used it in projects?`
    );
    questions = [
      ...techQuestions,
      ...questions.slice(0, 5 - techQuestions.length),
    ];
  }

  // Ensure we have exactly 5 questions
  return questions.slice(0, 5);
}
